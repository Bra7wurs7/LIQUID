import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Vault } from './models/vault.model';
import { IndexedDbService } from './services/indexedDb/indexed-db.service';
import { Workspace } from './models/workspace.model';
import { lastValueFrom, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FileHierarchNode } from './models/articleHierarchyNode.model';
import { ArticleActionEnum } from './enums/articleActionEnum';
import { LlmApiService } from './services/llmApi/llm-api.service';
import { Conversation, Msg } from './models/conversation.model';
import { ProjectEvent } from './models/projectEvent.model';
import { scrollIncrementDecrement } from './util/functions'
import { ConversationViewerComponent } from './components/conversation-viewer/conversation-viewer.component';
import { FileName } from './models/fileName.model';

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
  fileHierarchyMap: Map<string, FileHierarchNode> = new Map();
  activeVault?: Vault;
  activeArticleName?: string;

  /** Assistants & Consoles */
  input: string = '';
  dropdownPanelActiveTab: 'chat' | 'llm' | 'files' | 'git' | '' | 'menu' | 'alerts' = '';
  activeAssistant?: number;
  consoleInputFocused: boolean = false;
  input_placeholders = {
    chat: 'Enter chat message here',
    llm: 'Enter LLM prompt here',
    files: 'Search for files',
    git: '',
    alerts: '',
    menu: '',
    '': 'Type here to do stuff'
  }

  /** Workspaces */
  workspaces: Workspace[] = [];
  activeWorkspaceIndex: number = 0;

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
      if (this.activeVault) {
        this.saveToDB(this.activeVault.name);
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
        if (this.rightClickedWorkspace !== (this.workspaces.length ?? 0) - 1) {
          this.removeWorkspace(this.rightClickedWorkspace)
        }
      }
    },
  ];


  constructor(
    private messageService: MessageService,
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
    const activeWorkspace = this.workspaces[
      this.activeWorkspaceIndex
    ];
    activeWorkspace.activeArticleIndex = index;
    this.activeArticleName = this.workspaces[this.activeWorkspaceIndex].viewedArticles[this.workspaces[
      this.activeWorkspaceIndex
    ].activeArticleIndex];
  }

  toggleNewProjectOverlay() {
    this.showNewProjectOverlay = !this.showNewProjectOverlay
  }

  loadProject(project: Vault | undefined) {
    if (project === undefined) {
      this.messageService.add({ severity: 'error', summary: `Loading Failed` });
      return;
    }
    this.activeVault = project;
    this.saveToDB(project.name)
    this.initializeArticleHierarchyMap(true);
  }

  initializeArticleHierarchyMap(refresh: boolean = false) {
    if (refresh) {
      this.fileHierarchyMap = new Map();
    } else {
      this.fileHierarchyMap.clear();
    }

    // Iterate over every file in vault
    for (let entry of this.activeVault?.files.entries() ?? []) {
      // check if a hierarchy node for the currently iterated file exists
      let fileHierarchyNode = this.fileHierarchyMap.get(entry[0].toString());
      if (!fileHierarchyNode) {
        // If it doesn't exist, create it.
        fileHierarchyNode = new FileHierarchNode(entry);
        this.fileHierarchyMap.set(entry[0], fileHierarchyNode);
      }
      // Iterate over the names of all parent files of the currently iterated file
      for (let parentName of (new FileName(entry[0])).parents) {
        const hierarchicalListContainer =
          this.activeVault?.files.get(parentName);
        if (hierarchicalListContainer === undefined) {
          throw new Error(`Unknown parent ${parentName}`);
        }
        // Get the ArticleHierarchyNode for the group (parent) article from the groupNameArticlesMap
        let parentHierarchyNode = this.fileHierarchyMap.get(
          hierarchicalListContainer.name
        );
        // Check if the ArticleHierarchyNode for the group (parent) article exists
        if (!parentHierarchyNode) {
          // If it doesn't exist, create it.
          parentHierarchyNode = new FileHierarchNode(
            hierarchicalListContainer
          );
          this.fileHierarchyMap.set(
            hierarchicalListContainer.name,
            parentHierarchyNode
          );
        }
        parentHierarchyNode.children.push(fileHierarchyNode);
        fileHierarchyNode.parents.push(parentHierarchyNode);
      }
    }
  }

  toggleArticleActive(uniqueName: string) {
    if (!this.activeVault) return;

    const articleActiveIndex =
      this.activeVault.workspaces[
        this.activeVault.activeWorkspaceIndex
      ].viewedArticles.indexOf(uniqueName);

    if (articleActiveIndex >= 0) {
      this.activeVault.workspaces[
        this.activeVault.activeWorkspaceIndex
      ].viewedArticles.splice(articleActiveIndex, 1);
    } else {
      this.activeVault.workspaces[
        this.activeVault.activeWorkspaceIndex
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
    if (this.activeVault?.files.has(articleName)) {
      this.messageService.add({ severity: 'error', summary: 'An article by this name already exists' })
      return;
    }
    let article = this.activeVault?.files.get(articleName) ?? new Article(articleName)
    this.activeVault?.files.set(articleName, article)

    // Then checking for existance of all groups    
    const newCategories = categoryNames.filter((name) => !this.activeVault?.files.has(name));

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

    const hierarchyNode = this.fileHierarchyMap.get(oldName);
    if (!hierarchyNode) {
      throw new Error()
    }
    const childArticles = hierarchyNode?.children;

    if (articleName !== oldName) {
      this.activeVault?.files.set(articleName, hierarchyNode.node);
      this.activeVault?.files.delete(oldName);

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

    const newCategories = categoryNames.filter((name) => !this.activeVault?.files.has(name));

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
    if (!this.activeVault) {
      return;
    }
    let viewedArticles =
      this.activeVault?.workspaces[this.activeVault?.activeWorkspaceIndex]
        .viewedArticles;
    if (index > 0) {
      let tmp = viewedArticles[index - 1];
      viewedArticles[index - 1] = viewedArticles[index];
      viewedArticles[index] = tmp;
    }
  }

  moveDown(index: number) {
    if (!this.activeVault) {
      return;
    }
    let viewedArticles =
      this.activeVault?.workspaces[this.activeVault?.activeWorkspaceIndex]
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
        this.loadProject(new Vault(title !== '' ? title : 'New Database'));
      } else {
        this.messageService.add({
          severity: 'error',
          summary: `Project "${title}" already exists`,
        })
      }
    });
  }

  downloadProject(project: Vault | undefined) {
    if (project) {
      const serializableProject = project?.toSerializableProject();
      this.localdriveService.saveToLocalDrive(
        project.name + '.zip',
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
    } Vault
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
              if (this.activeVault?.name === title) {
                this.activeVault = undefined;
              }
            }
          );
      },
    });
  }

  saveToDB(title?: string) {
    if (this.activeVault) {
      const serializableProject = this.activeVault?.toSerializableProject();
      this.indexedDbService
        .saveProject(
          title ?? this.activeVault.name,
          serializableProject.serialize()
        )
        .then(() => {
          this.messageService.add({
            severity: 'success',
            summary: `"${this.activeVault?.name}" Saved`,
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
    if (this.activeVault) {
      this.activeVault.workspaces?.push(new Workspace());
    }
  }

  removeWorkspace(index: number) {
    if (this.activeVault) {
      this.activeVault.workspaces?.splice(index, 1);
      if (index < this.activeVault.activeWorkspaceIndex) {
        this.activeVault.activeWorkspaceIndex = this.activeVault.activeWorkspaceIndex - 1;
      }
    }
  }

  deleteArticle(name: string) {
    if (this.activeVault) {
      if (this.activeVault.files.delete(name)) {
        for (const workspace of this.activeVault.workspaces) {
          workspace.viewedArticles = workspace.viewedArticles.filter(
            (activeArticleName) => activeArticleName !== name
          );
        }
        this.fileHierarchyMap.get(name)?.children.forEach((child) => {
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

  onToggleConsole(id: 'chat' | 'llm' | 'files' | 'git' | 'menu' | 'alerts' | '') {
    if (this.dropdownPanelActiveTab === id) {
      this.dropdownPanelActiveTab = '';
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

    if (this.activeVault === undefined) return;
    // Remove all empty workspaces that aren't the last workspace
    let removedWorkspace = true;
    while (removedWorkspace && this.activeVault) {
      removedWorkspace = false;
      const index = this.activeVault?.workspaces.findIndex((wrkspc) => wrkspc.viewedArticles.length === 0)
      if (index !== -1 && index !== this.activeVault?.workspaces.length - 1) {
        this.removeWorkspace(index)
        removedWorkspace = true;
      } else {
        removedWorkspace = false;
      }
    }
    // Add new empty workspace if empty workspace is no longer empty
    if ((this.activeVault?.workspaces[this.activeVault?.workspaces.length - 1].viewedArticles.length ?? 0) > 0) {
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

    if (this.activeVault?.files.has(articleName)) {
      this.messageService.add({ severity: 'error', summary: 'An article by this name already exists' })
      return;
    }

    let article = new Article(articleName, [], msg.content);
    this.activeVault?.files.set(articleName, article)
    this.onTouchWorkspaces(true);
  }
}