import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Article } from './models/article';
import {
  Project,
  SerializableProject,
} from './models/project';
import { LocalDriveService } from './services/localDrive/local-drive.service';
import { IndexedDbService } from './services/indexedDb/indexed-db.service';
import { Workspace } from './models/workspace';
import { lastValueFrom, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ArticleHierarchyNode } from './models/articleHierarchyNode';
import { ArticleActionEnum } from './enums/articleActionEnum';
import { LlmApiService } from './services/llmApi/llm-api.service';
import { Conversation, Msg } from './models/conversation';
import { MenuEvent } from './models/projectEvent';
import { scrollIncrementDecrement } from './util/functions'
import { ConversationViewerComponent } from './components/conversation-viewer/conversation-viewer.component';
import { EventEmitter } from '@angular/core';
import { ApiConfig } from './models/apiConfig';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  /** HTML Template Elements */
  @ViewChild('projectUpload', { static: false }) projectUpload!: ElementRef;
  @ViewChild('conversationViewer', { static: false }) conversationViewer!: ConversationViewerComponent;
  @ViewChild('actionBar') actionBar!: HTMLInputElement;
  scrollIncrementDecrement = scrollIncrementDecrement;

  /** Project */
  allProjectsPromise: Promise<{ title: string; lastModified: Date }[]>;
  articleHierarchyMap: Map<string, ArticleHierarchyNode> = new Map();
  project?: Project;

  /** Assistants & Consoles */
  input: string = '';
  dropdownPanelActiveTab: 'chat' | 'llm' | 'files' | 'git' | '' | 'menu' | 'alerts' = '';
  activeAssistant?: number;
  consoleInputFocused: boolean = false;
  hideOlderThan: number = 2;

  conversations: Conversation[] = this.loadConversations();
  activeConversationIndex: number = 0;
  selectedLLMIndex: number = 0;
  rightClickedConversationIndex: number = 0;
  addMessageEmitter: EventEmitter<Msg> = new EventEmitter();
  autopromptingEnabled: boolean = false;

  /** Dialogs */
  showSaveProjectOverlay: boolean = false;
  showNewProjectOverlay: boolean = false;
  showPrivacyPolicyDialog: boolean = false;
  loadDialogVisible: boolean = false;
  settingsDialogVisible: boolean = false;

  /** Autosaver */
  autosave = timer(300000, 300000).pipe(
    switchMap(() => {
      if (this.project) {
        this.saveToDB();
        return of({});
      } else {
        return of({});
      }
    })
  );

  /** API Configurations */
  apiConfigs: ApiConfig[] = [];
  apiConfigModelsMap: Record<string, string[]> = {}
  selectedApiIndex: number = 0;

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

  conversationContextMenuItems = [
    {
      label: 'Clear', icon: 'iconoir iconoir-erase', command: () => {
        this.deleteMessages(false, this.rightClickedConversationIndex)
      }
    },
    {
      label: 'Delete', icon: 'iconoir iconoir-bin-half', command: () => {
        this.deleteMessages(true, this.rightClickedConversationIndex)
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
    this.loadSelectedLLMIndex()
    const loadedConfig = localStorage.getItem("apiConfigs")
    if (loadedConfig) {
      this.apiConfigs = JSON.parse(loadedConfig);
      this.loadApiModels()
    }
  }

  saveApiConfigs() {
    localStorage.setItem("apiConfigs", JSON.stringify(this.apiConfigs));
    this.loadApiModels()
  }

  loadApiModels() {
    for (const config of this.apiConfigs) {
      // if localhost use of ollama is assumed
      if (config.url.includes('localhost')) {
        fetch(config.url + "/api/tags", { method: 'GET', headers: config.headers }).then((response) => console.log(response));
      }
      // Otherwise assume openai api style
      else {
        fetch(config.url + "/v1/models", { method: 'GET', headers: config.headers }).then((response) => console.log(response));
      }

    }
  }

  loadConversations(): Conversation[] {
    const lastConversations = localStorage.getItem('conversations')
    if (lastConversations) {
      let convs = JSON.parse(lastConversations)
      return convs;
    }
    return [new Conversation()]
  }

  toggleNewProjectOverlay() {
    this.showNewProjectOverlay = !this.showNewProjectOverlay
  }

  loadProject(project: Project | undefined) {
    if (project === undefined) {
      this.messageService.add({ severity: 'error', summary: `Loading Failed` });
      return;
    }
    if (this.project) {
      this.saveToDB();
    }
    this.project = project;
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
        this.allProjectsPromise = this.indexedDbService.getAllProjects();
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
      this.localdriveService
        .loadFromLocalDrive(input.files[0])
        .then((res) => this.loadProject(res.toProject()));
    }
  }

  async getProjectFromDB(title: string): Promise<Project | undefined> {
    const project = await this.indexedDbService.loadProject(title);
    if (project) {
      const dserializedProject = SerializableProject.deserialize(project.projectJSON).toProject()
      return dserializedProject;
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

  saveToDB() {
    if (this.project) {
      const serializableProject = this.project?.toSerializableProject();
      this.indexedDbService
        .saveProject(
          this.project.title,
          serializableProject.serialize()
        )
        .then(() => {
          this.messageService.add({
            severity: 'success',
            summary: `"${serializableProject.title}" Saved`,
          });
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
            (articleName) => articleName !== name
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

  onToggleConsole(id: 'chat' | 'llm' | 'files' | 'git' | 'menu' | 'alerts' | '') {
    if (this.dropdownPanelActiveTab === id) {
      this.dropdownPanelActiveTab = '';
    } else {
      this.dropdownPanelActiveTab = id;
    }
  }

  onClickConversation(conversation_index: number) {
    if (this.activeConversationIndex === conversation_index || this.dropdownPanelActiveTab !== 'llm') {
      this.onToggleConsole('llm')
    }
    this.activeConversationIndex = conversation_index
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

  commandLineKeyUp(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      if (this.input) {
        this.conversations[this.activeConversationIndex].messages.push({ active: true, role: 'user', content: this.input });
        this.input = '';
      }
      this.promptLlm();
      this.input = '';
    }
  }

  async handleMenuEvent(event: MenuEvent) {
    const allProjects = await this.allProjectsPromise;
    switch (event[0]) {
      case "/folder":
        if (allProjects.findIndex((prj) => prj.title === event[1]) !== -1) {
          if (this.project?.title === event[1]) {
            this.saveToDB()
          } else {
            this.getProjectFromDB(event[1]).then((project) => {
              if (project) {
                this.loadProject(project);
              }
            });
          }
        } else {
          this.newProject(event[1])
        }
        break;
      case "/delete":
        this.deleteFromDB(event[1])
        break;
      case "/download":
        this.getProjectFromDB(event[1]).then((project) => {
          this.downloadProject(project)
        })
        break;
      case "/upload":
        this.projectUpload.nativeElement.click();
        break;
      case "/file":
        const existing_article = this.project?.articles.get(event[1])
        if (existing_article) {
          this.toggleArticleActive(existing_article.name)
        }
        this.addArticle(event[1]);
        break;
      case "/api":
        const urlAndKey = event[1].split(' ');
        const parsedUrl = new URL(urlAndKey[0]);
        parsedUrl.pathname = "/chat/completions"
        const newApi: ApiConfig = {
          url: parsedUrl.protocol + '//' + parsedUrl.host,
          params: {},
          headers: urlAndKey[1] !== undefined ? { 'Authorization': `Bearer ${urlAndKey[1]}` } : {},
          body: {},
        }
        this.apiConfigs.push(newApi);
        this.saveApiConfigs();
        break;
      case "/delete_api":
        const apiIndex = Number(event[1]);
        this.apiConfigs.splice(apiIndex, 1);
        this.saveApiConfigs();
    }
  }

  handleMessageEvent(event: [string, Msg | undefined]) {
    switch (event[0]) {
      case 'save': this.saveMessageAsArticle(event[1]); break;
      case 'added/removed': this.onTouchConversations();
    }
  }

  saveMessageAsArticle(msg: Msg | undefined) {
    if (!msg) {
      return;
    }

    const articleName = msg.content.slice(0, 15)

    if (this.project?.articles.has(articleName)) {
      this.messageService.add({ severity: 'error', summary: 'An article by this name already exists' })
      return;
    }

    let article = new Article(articleName, [], msg.content);
    this.project?.articles.set(articleName, article)
    this.onTouchWorkspaces(true);
  }

  deleteMessages(deleteSystem: boolean = false, conversationIndex: number) {
    if (deleteSystem) {
      this.conversations[conversationIndex].messages = [];
    } else {
      this.conversations[conversationIndex].messages = this.conversations[conversationIndex].messages.filter((msg) => msg.role === 'system')
    }

    this.onTouchConversations();
  }



  onTouchConversations() {
    // Remove all empty conversations that aren't the last conversation
    let removedConversation = true;
    while (removedConversation) {
      removedConversation = false;
      const index = this.conversations.findIndex((conv) => conv.messages.length === 0)
      if (index !== -1 && index !== this.conversations.length - 1) {
        this.conversations.splice(index, 1)
        removedConversation = true;
      } else {
        removedConversation = false;
      }
    }
    // Add new empty conversation if the last conversation is no longer empty
    if (this.conversations[this.conversations.length - 1].messages.length > 0) {
      this.conversations.push(new Conversation())
    }

    localStorage.setItem('conversations', JSON.stringify(this.conversations));
  }

  onClickSend(event: MouseEvent) {
    switch (event.button) {
      case 0:
        this.promptLlm();
        break;
      case 1:
        this.toggleAutoprompting();
        break;
      case 2:
        this.repeatPrompt();
        break;
    }
  }

  promptLlm() {
    const message: Msg = { role: 'assistant', content: '', active: true }

    let conversation_history_file = this.project?.articles.get("convo_history");
    if (conversation_history_file === undefined) {
      conversation_history_file = new Article("convo_history", [], "")
      this.project?.articles.set("convo_history", conversation_history_file)
    }

    this.deactivateOldMessages(this.hideOlderThan, this.conversations[this.activeConversationIndex].messages);

    this.llmApiService.sendLLMPrompt(this.conversations[this.activeConversationIndex], this.apiConfigs[this.selectedLLMIndex]).then((o) => {
      o?.subscribe((a) => {
        for (const v of a) {
          if (v && v.choices !== undefined) {
            // If OPENAI chat style response
            const newContent = v.choices[0]?.delta?.content;
            const finishReason = v.choices[0]?.finish_reason;
            if (newContent !== undefined) {
              message.content += newContent;
              conversation_history_file!.content += `${newContent}`;
            }
            if (finishReason) {
              localStorage.setItem('conversations', JSON.stringify(this.conversations));
              if (this.autopromptingEnabled) {
                this.promptLlm();
              }
            }
          } else if (v && v.response !== undefined) {
            // If OLLAMA generate style response
            const newContent = v.response;
            const done = v.done;
            if (newContent !== undefined) {
              message.content += newContent;
              conversation_history_file!.content += `${newContent}`;
            }
            if (done) {
              localStorage.setItem('conversations', JSON.stringify(this.conversations));
              if (this.autopromptingEnabled) {
                this.promptLlm();
              }
            }
          } else if (v && v.message !== undefined) {
            // If OLLAMA chat style response
            const newContent = v.message.content;
            const done = v.done;
            if (newContent !== undefined) {
              message.content += newContent;
              conversation_history_file!.content += `${newContent}`;
            }
            if (done) {
              localStorage.setItem('conversations', JSON.stringify(this.conversations));
              if (this.autopromptingEnabled) {
                this.promptLlm();
              }
            }
          }
        }
      })
    });
    this.conversations[this.activeConversationIndex].messages.push(message)
    this.addMessageEmitter.emit(message)
    this.onTouchConversations();
  }

  repeatPrompt() {
    this.conversations[this.activeConversationIndex].messages.pop()
    this.promptLlm();
  }

  deactivateOldMessages(allowed_age: number, messages: Msg[]) {
    if (allowed_age > -1)
      messages.forEach((msg, index) => {
        if (msg.role !== "system") {
          msg.active = false;
          if (index > (messages.length - 1) - allowed_age) {
            msg.active = true;
          }
        }
      });
  }

  loadSelectedLLMIndex() {
    const index = Number(localStorage.getItem('llm_index')) ?? 0;
    if (this.apiConfigs[index]) {
      this.selectedLLMIndex = index;
    }
  }

  saveSelectedLLMIndex() {
    localStorage.setItem('llm_index', `${this.selectedLLMIndex}`)
  }

  toggleAutoprompting() {
    this.autopromptingEnabled = !this.autopromptingEnabled;
    if (this.autopromptingEnabled) {
      this.messageService.add({
        severity: 'warn',
        summary: `Once prompted, autoprompting continues sending prompts until turned off.`,
      });
    } else {
      this.messageService.add({
        severity: 'success',
        summary: `Autoprompting off.`,
      });
    }

  }

  num(s: string): number {
    return Number(s);
  }
}

