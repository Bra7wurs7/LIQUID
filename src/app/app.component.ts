import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Type,
  ViewChild,
} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Article } from './models/article.model';
import {
  defaultProject,
  Project,
  SerializableProject,
} from './models/project.model';
import { LocalDriveService } from './services/localDrive/local-drive.service';
import { IndexedDbService } from './services/indexedDb/indexed-db.service';
import { Workspace } from './models/workspace.model';
import { lastValueFrom, of, timer } from 'rxjs';
import { switchMap, timeout } from 'rxjs/operators';
import { ArticleHierarchyNode } from './models/articleHierarchyNode.model';
import { ArticleActionEnum } from './enums/articleActionEnum';
import { LlmApiService } from './services/llmApi/llm-api.service';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  /** HTML Template Elements */
  @ViewChild('projectUpload', { static: false }) projectUpload!: ElementRef;
  @ViewChild('newProjectOverlay', { static: false }) newProjectOverlay!: OverlayPanel;
  activeArticlePages: Map<string, HTMLElement> = new Map();

  /** Application */
  title = 'LIQUID';

  /** Project */
  allProjectsPromise: Promise<{ title: string; lastModified: Date }[]>;
  articleHierarchyMap: Map<string, ArticleHierarchyNode> = new Map();
  project?: Project;
  activeArticle?: string;

  /** Assistants & Consoles */
  dropdownPanelActiveTab?: string;
  activeAssistant?: number;

  /** Dialogs */
  showSaveProjectOverlay: boolean = false;
  showNewProjectOverlay: boolean = false;
  showPrivacyPolicyDialog: boolean = false;
  loadDialogVisible: boolean = false;
  settingsDialogVisible: boolean = false;

  /** Menus */
  saveOptions = [
    {
      label: 'Save',
      icon: 'pi pi-fw pi-save',
      tooltip: `Save \"${this.project?.title}\"`,
      command: () => {
        if (this.project?.title) {
          this.saveToDB(this.project.title);
        }
      },
    },
    {
      label: 'Save As',
      icon: 'pi pi-fw pi-save',
      tooltip: `Save project under specific name`,
      command: () => {
        this.showSaveProjectOverlay = true;
      },
    },
    {
      label: 'Download',
      icon: 'pi pi-fw pi-download',
      command: () => {
        this.downloadProject();
      },
    },
  ];
  moreOptions = [
    {
      label: 'New Database',
      icon: 'pi pi-fw pi-plus',
      command: () => {
        this.newProjectOverlay.toggle(event)
      },
    },
    {
      separator: true,
    },
    {
      label: 'Save Database',
      icon: 'pi pi-fw pi-save',
      items: this.saveOptions,
    },
    {
      label: 'Load Database',
      icon: 'pi pi-fw pi-folder-open',
      items: [
        {
          label: 'Load',
          icon: 'pi pi-fw pi-folder-open',
          command: () => {
            this.loadDialogVisible = true;
          },
        },
        {
          label: 'Upload',
          icon: 'pi pi-fw pi-upload',
          command: () => {
            this.projectUpload.nativeElement.click();
          },
        },
      ],
    }
  ];

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
      await this.loadFromDB(lastProject.title);

      this.autosave.subscribe(() => { });
    });
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

  loadProject(project: Project) {
    this.project = project;
    this.title = this.project.title;
    this.messageService.add({ severity: 'success', summary: `Database "${this.project?.title}" loaded` });
    this.initializeArticleHierarchyMap();
  }

  initializeArticleHierarchyMap() {
    this.articleHierarchyMap.clear();
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
          throw new Error('Unknown Group Name');
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

    this.onTouchWorkspaces();
  }

  addArticle(articleName: string, parentName?: string) {
    const article = this.project?.articles.get(articleName);
    if (article && parentName) {
      if (article.groups.includes(parentName)) {
        this.project!.workspaces[
          this.project!.activeWorkspaceIndex
        ].viewedArticles.push(articleName);
      } else {
        article.groups.push(parentName);
        this.messageService.add({
          severity: 'success',
          summary: `${articleName} has been added to group ${parentName}`,
          life: 3000,
        });
      }
    } else {
      this.project!.articles.set(
        articleName!,
        new Article(articleName, undefined, parentName ? [parentName] : [])
      );
      this.project!.workspaces[
        this.project!.activeWorkspaceIndex
      ].viewedArticles.push(articleName);
      if (parentName) {
        this.project!.workspaces[
          this.project!.activeWorkspaceIndex
        ].viewedArticles.push(parentName);
        this.messageService.add({
          severity: 'success',
          summary: `Added ${articleName}`,
          detail: `${articleName} has been added as member of group ${parentName}`,
          life: 3000,
        });
      } else {
        this.messageService.add({
          severity: 'success',
          summary: `Added ${articleName}`,
        });
      }
    }
    this.initializeArticleHierarchyMap();
    this.onTouchWorkspaces();
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
    this.newProjectOverlay.hide();
    setTimeout(() => {
      this.loadProject(new Project(title !== '' ? title : 'New Database'));
    }, 0);
  }

  downloadProject() {
    if (this.project) {
      const serializableProject = this.project?.toSerializableProject();
      this.localdriveService.saveToLocalDrive(
        this.project.title + '.lqd',
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
      this.localdriveService
        .loadFromLocalDrive(input.files[0])
        .then((res) => this.loadProject(res.toProject()));
    }
  }

  async loadFromDB(title: string) {
    const project = await this.indexedDbService.loadProject(title);
    if (project) {
      this.loadProject(
        SerializableProject.deserialize(project.projectJSON).toProject()
      );
    }
  }

  async deleteFromDB(title: string) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete ${title}?`,
      accept: () => {
        this.indexedDbService
          .deleteProject(title)
          .then(
            () =>
              (this.allProjectsPromise = this.indexedDbService.getAllProjects())
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
            summary: `Saved "${this.project?.title}" to your internet browser's indexed database`,
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
          child.node.groups.splice(
            child.node.groups.findIndex((grp) => (grp = name)),
            1
          );
        });
        this.initializeArticleHierarchyMap();
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

  onToggleConsole(id: string, element: HTMLInputElement) {
    if (this.dropdownPanelActiveTab === id) {
      this.dropdownPanelActiveTab = undefined;
    } else {
      this.dropdownPanelActiveTab = id;
      setTimeout(() => {
        element.focus();
      }, 300);
    }
  }

  onListArticleActionClick(event: {
    action: ArticleActionEnum;
    node: Article;
  }) {
    console.log(event.node);
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
  onTouchWorkspaces() {
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

  assistantKeyUp(event: KeyboardEvent, chatInput: string) {
    if (event.key === 'Enter') {
      if (this.llmApiService.llmConfigs[0]) {
        this.llmApiService
          .sendOpenAiStylePrompt(
            [{ role: 'system', content: chatInput }],
            this.llmApiService.llmConfigs[0]
          )
          .subscribe((msg) => console.log(msg));
      } else {
        this.messageService.add({ severity: 'error', summary: `No LLM: Configure a LLM in the settings` });
      }
    }
  }
}
