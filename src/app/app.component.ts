import { Component, ElementRef, EventEmitter, Input, OnInit, Type, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Article } from './models/article.model';
import { defaultProject, Project, SerializableProject } from './models/project.model';
import { LocalDriveService } from './services/localDrive/local-drive.service';
import { IndexedDbService } from './services/indexedDb/indexed-db.service';
import { Workspace } from './models/workspace.model';
import { of, timer } from 'rxjs';
import { switchMap, timeout } from 'rxjs/operators';
import { ArticleHierarchyNode } from './models/articleHierarchyNode.model';
import { ArticleActionEnum } from './enums/articleActionEnum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  /** HTML Template Elements */
  @ViewChild("projectUpload", { static: false }) projectUpload!: ElementRef;
  activeArticlePages: Map<string, HTMLElement> = new Map();

  /** Application */
  title = 'LIQUID';

  /** Project */
  allProjectsPromise: Promise<{ title: string, lastModified: Date }[]>;
  project?: Project;

  /** Left Sidebar */
  articleHierarchyMap: Map<string, ArticleHierarchyNode> = new Map();
  articleHierarchyArray: ArticleHierarchyNode[] = [];
  highlightedArticlePath: ArticleHierarchyNode[] = [];
  leftSearch: string = '';
  lsArticleName?: string;
  lsParentName?: string;

  /** Right Sidebar */
  rightSearch: string = '';

  /** Assistants */
  activeAssistant?: number;

  /** Dialogs */
  showSaveProjectOverlay: boolean = false;
  showNewProjectOverlay: boolean = false;
  showPrivacyPolicyDialog: boolean = false;
  loadDialogVisible: boolean = false;

  /** Header Menu */
  items = [
    {
      label: 'File',
      icon: 'pi pi-fw pi-file',
      tooltip: `Save, Load, or Start New Projects`,
      items: [
        {
          label: 'New Project',
          icon: 'pi pi-fw pi-plus',
          command: () => {
            this.showNewProjectOverlay = true;
          }
        },
        {
          separator: true
        },
        {
          label: 'Save Project',
          icon: 'pi pi-fw pi-save',
          items: [
            {
              label: 'Save',
              icon: 'pi pi-fw pi-save',
              tooltip: `Save \"${this.project?.title}\"`,
              command: () => {
                if (this.project?.title) {
                  this.saveToDB(this.project.title);
                }
              }
            },
            {
              label: 'Save As',
              icon: 'pi pi-fw pi-save',
              tooltip: `Save project under specific name`,
              command: () => {
                this.showSaveProjectOverlay = true;
              }
            },
            {
              label: 'Download',
              icon: 'pi pi-fw pi-download',
              command: () => {
                this.downloadProject();
              }
            }
          ]
        },
        {
          label: 'Load Project',
          icon: 'pi pi-fw pi-folder-open',
          items: [
            {
              label: 'Load',
              icon: 'pi pi-fw pi-folder-open',
              command: () => {
                this.loadDialogVisible = true;
              }
            },
            {
              label: 'Upload',
              icon: 'pi pi-fw pi-upload',
              command: () => {
                this.projectUpload.nativeElement.click();
              }
            }
          ]
        },
        {
          separator: true
        },
        {
          label: 'Project Manager',
          icon: 'pi pi-fw pi-database'
        },
        {
          label: 'Settings',
          icon: 'pi pi-fw pi-cog'
        }
      ]
    }
  ];

  /** Autosaver */
  autosave = timer(1, 300000).pipe(
    switchMap(() => {
      if (this.project) {
        this.saveToDB(this.project.title);
        return of({});
      } else {
        return of({});
      }
    })
  );



  constructor(private messageService: MessageService, private localdriveService: LocalDriveService, private indexedDbService: IndexedDbService, private confirmationService: ConfirmationService) {
    this.allProjectsPromise = indexedDbService.getAllProjects();
  }

  ngOnInit() {
    this.allProjectsPromise.then(async (allProjects) => {
      let lastProject = { title: '', lastModified: new Date(0) };
      allProjects.forEach((project) => {
        if (project.lastModified.getTime() > lastProject.lastModified.getTime()) {
          lastProject = project;
        }
      })
      await this.loadFromDB(lastProject.title);
      if (!this.project) {
        this.loadProject(defaultProject);
      }
      this.autosave.subscribe(() => { });
    });
  }

  loadProject(project: Project) {
    this.project = project;
    this.title = this.project.title;
    this.messageService.add({ severity: 'success', summary: `Succesfully loaded "${this.title}"` })
    this.initializeArticleHierarchyMap();
  }

  initializeArticleHierarchyMap() {
    this.articleHierarchyMap.clear();
    // Iterate over every article in project
    for (let article of this.project?.articles.values() ?? []) {
      // Get from groupNameArticlesMap the ArticleHierarchyNode for the currently iterated article
      let articleHierarchyNode = this.articleHierarchyMap.get(article.name)
      // Check if the ArticleHierarchyNode for the group (parent) article exists
      if (!articleHierarchyNode) {
        // If it doesn't exist, create it.
        articleHierarchyNode = new ArticleHierarchyNode(article);
        this.articleHierarchyMap.set(article.name, articleHierarchyNode)
      }
      // Iterate over the names of all groups (parent articles) that this article is a group member (child) of
      for (let parentName of article.groups) {
        const hierarchicalListContainer = this.project?.articles.get(parentName);
        if (hierarchicalListContainer === undefined) {
          // @TODO: Implement automatic group creation option
          throw new Error("Unknown Group Name")
        }
        // Get the ArticleHierarchyNode for the group (parent) article from the groupNameArticlesMap
        let parentHierarchyNode = this.articleHierarchyMap.get(hierarchicalListContainer.name)
        // Check if the ArticleHierarchyNode for the group (parent) article exists
        if (!parentHierarchyNode) {
          // If it doesn't exist, create it.
          parentHierarchyNode = new ArticleHierarchyNode(hierarchicalListContainer);
          this.articleHierarchyMap.set(hierarchicalListContainer.name, parentHierarchyNode)
        }
        parentHierarchyNode.children.push(articleHierarchyNode);
        articleHierarchyNode.parents.push(parentHierarchyNode);
      }
    }
    this.articleHierarchyArray = this.articleMapToFilteredList(this.articleHierarchyMap, this.leftSearch);
  }

  articleMapToFilteredList(map: Map<string, ArticleHierarchyNode>, filter: string): ArticleHierarchyNode[] {
    let filteredArticles: ArticleHierarchyNode[] = [];
    for (const article of map.values()) {
      if ((article.parents.length === 0 && !filter) || (filter && article.node.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))) {
        filteredArticles.push(article);
      }
    }
    return filteredArticles;
  }

  toggleArticleActive(uniqueName: string) {
    if (!this.project) {
      return;
    }

    const articleActiveIndex = this.project.workspaces[this.project.activeWorkspaceIndex].activeArticles.indexOf(uniqueName)

    if (articleActiveIndex >= 0) {
      this.project.workspaces[this.project.activeWorkspaceIndex].activeArticles.splice(articleActiveIndex, 1);
    } else {
      this.project.workspaces[this.project.activeWorkspaceIndex].activeArticles.push(uniqueName);
    }
  }

  onLeftSearchKeyUp(searchValue: string, event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowUp":
        this.shiftHighlightUp();
        break;
      case "ArrowDown":
        this.shiftHighlightDown();
        break;
      case "Enter":
        this.activateHighlighted();
        break;
      case "Delete":
        console.log('Delete')
        break;
    }

    const searchValueSeparated: string[] = searchValue.split('.');
    this.lsArticleName = undefined;
    this.lsParentName = undefined;

    for (const s of searchValueSeparated) {
      this.lsArticleName = (this.lsArticleName !== undefined ? `${this.lsArticleName}.${s}` : `${s}`);
      if (this.lsArticleName && this.project?.articles.has(this.lsArticleName)) {
        if (!this.lsParentName) {
          this.lsParentName = this.lsArticleName;
          this.lsArticleName = undefined;
        }
      }
    }

    this.articleHierarchyArray = this.articleMapToFilteredList(this.articleHierarchyMap, searchValue);
  }

  shiftHighlightDown() {

  }

  shiftHighlightUp() {

  }

  activateHighlighted() {

  }

  addArticle(articleName: string, parentName?: string) {
    const article = this.project?.articles.get(articleName)
    if (article && parentName) {
      if (article.groups.includes(parentName)) {
        this.project!.workspaces[this.project!.activeWorkspaceIndex].activeArticles.push(articleName);
      } else {
        article.groups.push(parentName);
        this.messageService.add({ severity: 'success', summary: `${articleName} has been added to group ${parentName}`, life: 3000 })
      }
    } else {
      this.project!.articles.set(articleName!, new Article(articleName, undefined, parentName ? [parentName] : []))
      this.project!.workspaces[this.project!.activeWorkspaceIndex].activeArticles.push(articleName);
      if (parentName) {
        this.project!.workspaces[this.project!.activeWorkspaceIndex].activeArticles.push(parentName);
        this.messageService.add({ severity: 'success', summary: `Added ${articleName}`, detail: `${articleName} has been added as member of group ${parentName}`, life: 3000 })
      } else {
        this.messageService.add({ severity: 'success', summary: `Added ${articleName}` })
      }
    }
    this.initializeArticleHierarchyMap();
  }

  scrollToPanel(child: HTMLElement, parent: HTMLDivElement) {
    parent.scrollTop = child.offsetTop ?? 0;
  }

  moveUp(index: number) {
    if (!this.project) { return }
    let activeArticles = this.project?.workspaces[this.project?.activeWorkspaceIndex].activeArticles
    if (index > 0) {
      let tmp = activeArticles[index - 1];
      activeArticles[index - 1] = activeArticles[index];
      activeArticles[index] = tmp;
    }
  }

  moveDown(index: number) {
    if (!this.project) { return }
    let activeArticles = this.project?.workspaces[this.project?.activeWorkspaceIndex].activeArticles
    if (index < (activeArticles.length - 1)) {
      let tmp = activeArticles[index + 1];
      activeArticles[index + 1] = activeArticles[index];
      activeArticles[index] = tmp;
    }
  }

  navigateInternalLink(internallink: string, contentPanel: HTMLDivElement) {
    const uniqueName = internallink.replace('[[', '').replace(']]', '');
    this.toggleArticleActive(uniqueName);
  }

  newProject(title?: string) {
    this.loadProject(new Project(title ?? 'Untitled Project'));
    this.messageService.add({ severity: 'success', summary: 'New Project' })
    this.addView();
  }

  downloadProject() {
    if (this.project) {
      const serializableProject = this.project?.toSerializableProject()
      this.localdriveService.saveToLocalDrive(this.project.title + '.gasp', serializableProject.serialize())
    } else {
      this.messageService.add({ severity: 'warn', summary: 'You propably wanted to press "Upload" of "New", right?' })
    }
  }

  onFileSelected(input: HTMLInputElement) {
    if (input.files) {
      this.localdriveService.loadFromLocalDrive(input.files[0]).then((res) => this.loadProject(res.toProject()));
    }
  }

  async loadFromDB(title: string) {
    const project = await this.indexedDbService.loadProject(title)
    if (project) {
      this.loadProject(SerializableProject.deserialize(project.projectJSON).toProject());
    }
  }

  async deleteFromDB(title: string) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete ${title}?`,
      accept: () => {
        this.indexedDbService.deleteProject(title).then(
          () => this.allProjectsPromise = this.indexedDbService.getAllProjects()
        );
      }
    });
  }

  saveToDB(title?: string) {
    if (this.project) {
      const serializableProject = this.project?.toSerializableProject()
      this.indexedDbService.saveProject(title ?? this.project.title, serializableProject.serialize()).then(() => {
        this.messageService.add({ severity: 'success', summary: `Saved ${this.project?.title}` })
        this.allProjectsPromise = this.indexedDbService.getAllProjects();
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'You propably wanted to press "Upload" of "New", right?' })
    }
  }

  addView() {
    if (this.project) {
      this.project.workspaces?.unshift(new Workspace());
      this.project.activeWorkspaceIndex = 0;
    }
  }

  removeView(index: number) {
    if (this.project) {
      this.project.workspaces?.splice(index, 1);
      this.project.activeWorkspaceIndex = this.project.workspaces.length - 1;
    }
  }

  deleteArticle(name: string) {
    if (this.project) {
      if (this.project.articles.delete(name)) {
        for (const workspace of this.project.workspaces) {
          workspace.activeArticles = workspace.activeArticles.filter((activeArticleName) => activeArticleName !== name);
        }
        this.articleHierarchyMap.get(name)?.children.forEach((child) => {
          child.node.groups.splice(child.node.groups.findIndex((grp) => grp = name), 1);
        })
        this.initializeArticleHierarchyMap();
      }
    }
  }

  onToggleAssistant(index: number, element: HTMLInputElement) {
    if (this.activeAssistant === index) {
      this.activeAssistant = undefined;
    } else {
      this.activeAssistant = index;
      setTimeout(() => { element.focus() }, 300)
    }
  }

  onListArticleActionClick(event: { action: ArticleActionEnum, node: Article }) {
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

  openPrivacyPolicyDialog() {
    this.showPrivacyPolicyDialog = true;
  }
  openImprintDialog() {
  }
  openDonationDialog() {
  }
  openDevelopmentDialog() {
  }
  openSettingsDialog() {
  }
}
