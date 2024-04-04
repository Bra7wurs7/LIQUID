import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Article } from './models/article.model';
import {
  Project,
  SerializableProject,
} from './models/project.model';
import { LocalDriveService } from './services/localDrive/local-drive.service';
import { IndexedDbService } from './services/indexedDb/indexed-db.service';
import { Workspace } from './models/workspace.model';
import { lastValueFrom, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ArticleHierarchyNode } from './models/articleHierarchyNode.model';
import { ArticleActionEnum } from './enums/articleActionEnum';
import { LlmApiService } from './services/llmApi/llm-api.service';
import { Conversation, Msg } from './models/conversation.model';
import { ProjectEvent } from './models/projectEvent.model';
import { scrollIncrementDecrement } from './util/functions'
import { ConversationViewerComponent } from './components/conversation-viewer/conversation-viewer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  /** HTML Template Elements */
  @ViewChild('projectUpload', { static: false }) projectUpload!: ElementRef;
  @ViewChild('conversationViewer', { static: false }) conversationViewer!: ConversationViewerComponent;
  scrollIncrementDecrement = scrollIncrementDecrement;
  activeArticlePages: Map<string, HTMLElement> = new Map();

  /** Project */
  allProjectsPromise: Promise<{ title: string; lastModified: Date }[]>;
  articleHierarchyMap: Map<string, ArticleHierarchyNode> = new Map();
  project?: Project;
  activeArticle?: string;

  /** Assistants & Consoles */
  input: string = '';
  dropdownPanelActiveTab?: string;
  activeAssistant?: number;
  consoleInputFocused: boolean = false;

  conversations: Conversation[] = this.loadConversations();

  /** Dialogs */
  showSaveProjectOverlay: boolean = false;
  showNewProjectOverlay: boolean = false;
  showPrivacyPolicyDialog: boolean = false;
  loadDialogVisible: boolean = false;
  settingsDialogVisible: boolean = false;

  foo: number = 0;

  /** Autosaver */
  autosave = timer(300000, 300000).pipe(
    switchMap(() => {
      if (this.project) {
        this.saveToDB(this.project.title);
        return of({});
      } else {
        return of({});
      }
    })
  );

  rightClickedWorkspace: number = -1;
  workspaceContextMenuItems = [
    {
      label: 'Delete', icon: 'iconoir iconoir-bin-half', command: () => {
        if (this.rightClickedWorkspace !== (this.project?.workspaces.length ?? 0) - 1) {
          this.removeWorkspace(this.rightClickedWorkspace)
        }
      }
    },
  ];


  constructor(
    private messageService: MessageService,
    private localdriveService: LocalDriveService,
    private indexedDbService: IndexedDbService,
    private confirmationService: ConfirmationService,
    public llmApiService: LlmApiService
  ) {
    this.allProjectsPromise = indexedDbService.getAllProjects();
  }

  ngOnInit() {
    this.allProjectsPromise.then(async (allProjects) => {
      let lastProject = { title: '', lastModified: new Date(0) };
      allProjects.forEach((project) => {
        if (
          project.lastModified.getTime() > lastProject.lastModified.getTime()
        ) {
          lastProject = project;
        }
      });
      this.getProjectFromDB(lastProject.title).then((project) => {
        if (project) {
          this.loadProject(project);
        }
      });

      this.autosave.subscribe(() => { });
    });
  }

  loadConversations(): Conversation[] {
    const lastConversations = localStorage.getItem('conversations')
    if (lastConversations) {
      let convs = JSON.parse(lastConversations)
      return convs;
    }
    return [new Conversation()]
  }

  setActiveArticle(index: number) {
    const activeWorkspace = this.project!.workspaces[
      this.project!.activeWorkspaceIndex
    ];
    activeWorkspace.activeArticleIndex = index;
    this.activeArticle = this.project!.workspaces[this.project!.activeWorkspaceIndex].viewedArticles[this.project!.workspaces[
      this.project!.activeWorkspaceIndex
    ].activeArticleIndex];
  }

  toggleNewProjectOverlay() {
    this.showNewProjectOverlay = !this.showNewProjectOverlay
  }

  loadProject(project: Project | undefined) {
    if (project === undefined) {
      this.messageService.add({ severity: 'error', summary: `Loading Failed` });
      return;
    }
    this.project = project;
    this.saveToDB(project.title)
    this.initializeArticleHierarchyMap(true);
  }

  initializeArticleHierarchyMap(refresh: boolean = false) {
    if (refresh) {
      this.articleHierarchyMap = new Map();
    } else {
      this.articleHierarchyMap.clear();
    }

    // Iterate over every article in project
    for (let article of this.project?.articles.values() ?? []) {
      // Get from groupNameArticlesMap the ArticleHierarchyNode for the currently iterated article
      let articleHierarchyNode = this.articleHierarchyMap.get(article.name);
      // Check if the ArticleHierarchyNode for the group (parent) article exists
      if (!articleHierarchyNode) {
        // If it doesn't exist, create it.
        articleHierarchyNode = new ArticleHierarchyNode(article);
        this.articleHierarchyMap.set(article.name, articleHierarchyNode);
      }
      // Iterate over the names of all groups (parent articles) that this article is a group member (child) of
      for (let parentName of article.groups) {
        const hierarchicalListContainer =
          this.project?.articles.get(parentName);
        if (hierarchicalListContainer === undefined) {
          // @TODO: Implement automatic group creation option
          throw new Error(`Unknown Group Name ${parentName}`);
        }
        // Get the ArticleHierarchyNode for the group (parent) article from the groupNameArticlesMap
        let parentHierarchyNode = this.articleHierarchyMap.get(
          hierarchicalListContainer.name
        );
        // Check if the ArticleHierarchyNode for the group (parent) article exists
        if (!parentHierarchyNode) {
          // If it doesn't exist, create it.
          parentHierarchyNode = new ArticleHierarchyNode(
            hierarchicalListContainer
          );
          this.articleHierarchyMap.set(
            hierarchicalListContainer.name,
            parentHierarchyNode
          );
        }
        parentHierarchyNode.children.push(articleHierarchyNode);
        articleHierarchyNode.parents.push(parentHierarchyNode);
      }
    }
  }

  toggleArticleActive(uniqueName: string) {
    if (!this.project) return;

    const articleActiveIndex =
      this.project.workspaces[
        this.project.activeWorkspaceIndex
      ].viewedArticles.indexOf(uniqueName);

    if (articleActiveIndex >= 0) {
      this.project.workspaces[
        this.project.activeWorkspaceIndex
      ].viewedArticles.splice(articleActiveIndex, 1);
    } else {
      this.project.workspaces[
        this.project.activeWorkspaceIndex
      ].viewedArticles.push(uniqueName);
    }

    this.onTouchWorkspaces(false);
  }

  addArticle(input: string) {
    let categoryNames = input.split("#").map((n) => n.trim()).reverse()
    const articleName = categoryNames.pop()
    if (articleName === undefined) {
      return;
    }
    // @TODO If article exists and categories are given proceed and assign categories
    if (this.project?.articles.has(articleName)) {
      this.messageService.add({ severity: 'error', summary: 'An article by this name already exists' })
      return;
    }
    let article = this.project?.articles.get(articleName) ?? new Article(articleName)
    this.project?.articles.set(articleName, article)

    // Then checking for existance of all groups    
    const newCategories = categoryNames.filter((name) => !this.project?.articles.has(name));

    if (newCategories.length > 0) {
      lastValueFrom(this.confirmationService.confirm({
        message: `${newCategories.length} unknown parents. Add Articles for those categories?`,
        accept: () => {
          for (const cat of newCategories) {
            this.addArticle(cat);
          };
          this.onTouchWorkspaces();
        },
      }).accept).then();
    }

    article.groups = categoryNames;
    this.onTouchWorkspaces(true);
  }

  async renameArticle(oldName: string, newNameAndCategories: string) {
    let categoryNames = newNameAndCategories.split("#").map((n) => n.trim()).reverse()
    const articleName = categoryNames.pop()
    if (articleName === undefined) {
      return;
    }

    const hierarchyNode = this.articleHierarchyMap.get(oldName);
    if (!hierarchyNode) {
      throw new Error()
    }
    const childArticles = hierarchyNode?.children;

    if (articleName !== oldName) {
      this.project?.articles.set(articleName, hierarchyNode.node);
      this.project?.articles.delete(oldName);

      if ((childArticles?.length ?? 0) > 0) {
        await lastValueFrom(this.confirmationService.confirm({
          message: `You are renaming '${oldName}' into '${articleName}'.\n ${(childArticles?.length ?? 0)} articles have '${oldName}' as their parent. Update those references to '${articleName}'?`,
          accept: () => {
            for (const child of childArticles ?? []) {
              const oldCategoryIndex = child.node.groups.findIndex((g) => g === oldName);
              child.node.groups.splice(oldCategoryIndex, 1);
              child.node.groups.push(articleName);
            }
          },
        }).accept);
      }
    }

    const newCategories = categoryNames.filter((name) => !this.project?.articles.has(name));

    if (newCategories.length > 0) {
      lastValueFrom(this.confirmationService.confirm({
        message: `${newCategories.length} unknown parents. Add Articles for those categories?`,
        accept: () => {
          for (const cat of newCategories) {
            this.addArticle(cat);
          };
          this.onTouchWorkspaces();
        },
      }).accept).then();
    }

    hierarchyNode.node.name = articleName;
    hierarchyNode.node.groups = categoryNames;
    this.onTouchWorkspaces(true);
  }

  scrollToPanel(child: HTMLElement, parent: HTMLDivElement) {
    parent.scrollTop = child.offsetTop ?? 0;
  }

  moveUp(index: number) {
    if (!this.project) {
      return;
    }
    let viewedArticles =
      this.project?.workspaces[this.project?.activeWorkspaceIndex]
        .viewedArticles;
    if (index > 0) {
      let tmp = viewedArticles[index - 1];
      viewedArticles[index - 1] = viewedArticles[index];
      viewedArticles[index] = tmp;
    }
  }

  moveDown(index: number) {
    if (!this.project) {
      return;
    }
    let viewedArticles =
      this.project?.workspaces[this.project?.activeWorkspaceIndex]
        .viewedArticles;
    if (index < viewedArticles.length - 1) {
      let tmp = viewedArticles[index + 1];
      viewedArticles[index + 1] = viewedArticles[index];
      viewedArticles[index] = tmp;
    }
  }

  navigateInternalLink(internallink: string, contentPanel: HTMLDivElement) {
    const uniqueName = internallink.replace('[[', '').replace(']]', '');
    this.toggleArticleActive(uniqueName);
  }

  newProject(title: string) {
    this.getProjectFromDB(title).then((p) => {
      if (p === undefined) {
        this.loadProject(new Project(title !== '' ? title : 'New Database'));
      } else {
        this.messageService.add({
          severity: 'error',
          summary: `Project "${title}" already exists`,
        })
      }
    });
  }

  downloadProject(project: Project | undefined) {
    if (project) {
      const serializableProject = project?.toSerializableProject();
      this.localdriveService.saveToLocalDrive(
        project.title + '.zip',
        serializableProject.serialize()
      );
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Can\'t download what doesn\'t exist',
      });
    }
  }

  onFileSelected(input: HTMLInputElement) {
    if (input.files) {
      const file = input.files[0]
      this.localdriveService.zipToVault(file).then((project) => this.loadProject(project));
      /*
      this.localdriveService
        .loadFromLocalDrive(input.files[0])
        .then((res) => this.loadProject(res.toProject()));*/
    }
  }

  async getProjectFromDB(title: string): Promise<Project | undefined> {
    const project = await this.indexedDbService.loadProject(title);
    if (project) {
      return SerializableProject.deserialize(project.projectJSON).toProject()
    } else {
      return undefined;
    }
  }

  async deleteFromDB(title: string) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete ${title}?`,
      accept: () => {
        this.indexedDbService
          .deleteProject(title)
          .then(
            () => {
              this.allProjectsPromise = this.indexedDbService.getAllProjects();
              if (this.project?.title === title) {
                this.project = undefined;
              }
            }
          );
      },
    });
  }

  saveToDB(title?: string) {
    if (this.project) {
      const serializableProject = this.project?.toSerializableProject();
      this.indexedDbService
        .saveProject(
          title ?? this.project.title,
          serializableProject.serialize()
        )
        .then(() => {
          this.messageService.add({
            severity: 'success',
            summary: `"${this.project?.title}" Saved`,
          });
          this.allProjectsPromise = this.indexedDbService.getAllProjects();
        });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Project is Undefined',
      });
    }
  }

  addWorkspace() {
    if (this.project) {
      this.project.workspaces?.push(new Workspace());
    }
  }

  removeWorkspace(index: number) {
    if (this.project) {
      this.project.workspaces?.splice(index, 1);
      if (index < this.project.activeWorkspaceIndex) {
        this.project.activeWorkspaceIndex = this.project.activeWorkspaceIndex - 1;
      }
    }
  }

  deleteArticle(name: string) {
    if (this.project) {
      if (this.project.articles.delete(name)) {
        for (const workspace of this.project.workspaces) {
          workspace.viewedArticles = workspace.viewedArticles.filter(
            (activeArticleName) => activeArticleName !== name
          );
        }
        this.articleHierarchyMap.get(name)?.children.forEach((child) => {
          const grps = new Set(child.node.groups)
          grps.delete(name)
          child.node.groups = [...grps]
        });
        this.onTouchWorkspaces(true);
      }
    }
  }

  onToggleAssistant(index: number, element: HTMLInputElement) {
    if (this.activeAssistant === index) {
      this.activeAssistant = undefined;
    } else {
      this.activeAssistant = index;
      setTimeout(() => {
        element.focus();
      }, 300);
    }
  }

  onToggleConsole(id: string) {
    if (this.dropdownPanelActiveTab === id) {
      this.dropdownPanelActiveTab = undefined;
    } else {
      this.dropdownPanelActiveTab = id;
    }
  }

  onListArticleActionClick(event: {
    action: ArticleActionEnum;
    node: Article;
  }) {
    switch (event.action) {
      case ArticleActionEnum.toggle:
        this.toggleArticleActive(event.node.name);
        break;
      case ArticleActionEnum.rename:
        break;
      case ArticleActionEnum.editCategories:
        break;
      case ArticleActionEnum.saveAsMD:
        break;
      case ArticleActionEnum.saveAsPDF:
        break;
      case ArticleActionEnum.delete:
        this.deleteArticle(event.node.name);
        break;
    }
  }

  /**
   * To be called whenever a aricle is opened or closed
   */
  onTouchWorkspaces(refresh: boolean = false) {
    try {
      this.initializeArticleHierarchyMap(refresh);
    } catch { }

    if (this.project === undefined) return;
    // Remove all empty workspaces that aren't the last workspace
    let removedWorkspace = true;
    while (removedWorkspace && this.project) {
      removedWorkspace = false;
      const index = this.project?.workspaces.findIndex((wrkspc) => wrkspc.viewedArticles.length === 0)
      if (index !== -1 && index !== this.project?.workspaces.length - 1) {
        this.removeWorkspace(index)
        removedWorkspace = true;
      } else {
        removedWorkspace = false;
      }
    }
    // Add new empty workspace if empty workspace is no longer empty
    if ((this.project?.workspaces[this.project?.workspaces.length - 1].viewedArticles.length ?? 0) > 0) {
      this.addWorkspace();
    }
  }

  commandLineKeyUp(e: KeyboardEvent, input: HTMLInputElement) {
    if (e.key === 'Enter') {
      if (input.value) {
        this.conversations[this.conversationViewer.activeConversation].messages.push({ active: true, role: 'user', content: input.value });
      }
      this.conversationViewer.promptConversation();
      input.value = '';
    }
  }

  handleProjectEvent(event: ProjectEvent) {
    switch (event[0]) {
      case "load":
        this.getProjectFromDB(event[1]).then((project) => {
          this.loadProject(project)
        })
        break;
      case "delete":
        this.deleteFromDB(event[1])
        break;
      case "saveas":
        this.saveToDB(event[1])
        break;
      case "new":
        this.newProject(event[1])
        break;
      case "download":
        this.getProjectFromDB(event[1]).then((project) => {
          this.downloadProject(project)
        })
        break;
      case "upload":
        this.projectUpload.nativeElement.click();
        break;
    }
  }

  saveMessageAsArticle(msg: Msg) {
    const articleName = msg.content.slice(0, 15)

    if (this.project?.articles.has(articleName)) {
      this.messageService.add({ severity: 'error', summary: 'An article by this name already exists' })
      return;
    }

    let article = new Article(articleName, [], msg.content);
    this.project?.articles.set(articleName, article)
    this.onTouchWorkspaces(true);
  }
}