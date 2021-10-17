import { Component, OnInit, Type } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService, TreeNode } from 'primeng/api';
import { ScrollPanel } from 'primeng/scrollpanel';
import { Category } from './models/category.model';
import { CategoryPanel, GenericPanel, NotePanel } from './models/panel.model';
import { Note } from './models/note.model';
import { defaultProject, Project, SerializableProject } from './models/project.model';
import { LocalDriveService } from './services/localDrive/local-drive.service';
import { IndexedDbService } from './services/indexedDb/indexed-db.service';
import { PanelView } from './models/panelView.model';
import { of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  notePanelType = NotePanel;
  categoryPanelType = CategoryPanel;

  project?: Project;
  noteKeys: string[] = [];
  filteredNoteKeys: string[] | undefined;
  categoryKeys: string[] = [];
  filteredCategoryKeys: string[] | undefined;
  title = 'GAS';
  allProjectsPromise: Promise<{ title: string, lastModified: Date }[]>;
  loadDialogVisible: boolean = false;

  rightSearch: string = '';
  leftSearch: string = '';

  infinity: number = Infinity;
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
        this.newProject();
      }
      this.autosave.subscribe(() => {});
    })
  }

  loadProject(project: Project) {
    this.noteKeys = [];
    this.categoryKeys = [];
    this.project = project;
    for (const key of this.project.notes?.keys()) {
      this.noteKeys.push(key);
    }
    for (const key of this.project.categories?.keys()) {
      this.categoryKeys.push(key);
    }
    this.title = this.project.title;
  }

  onAddNoteFolderClick(folderTitle: string) {
    this.messageService.add({ severity: 'error', summary: 'Feature not supported yet.', life: 3000 })
  }

  onElementClick(uniqueName: string, contentPanel: ScrollPanel) {
    /** Replace onNoteClick and onCategoryClick with this */
  }

  onNoteClick(noteTitle: string, contentPanel: ScrollPanel) {
    if (!this.project) {
      return;
    }

    const existingPanel = this.getPanelFromActiveViewForName(noteTitle);
    if (!this.project) {
      return;
    }
    if (existingPanel === undefined) {
      const newPanel = new NotePanel(noteTitle)
      this.project?.views[this.project?.activeViewIndex].panels.push(newPanel);
      const scrollToNewPanel = (attempt: number = 0) => {
        if (newPanel.htmlElement !== undefined) {
          this.scrollToPanel(newPanel, contentPanel)
        } else {
          if (attempt > 50) {
          } else {
            attempt++;
            setTimeout(() => scrollToNewPanel(attempt), 100)
          }
        }
      }
      scrollToNewPanel();
    } else {
      this.project.views[this.project.activeViewIndex].activePanelIndex = this.project?.views[this.project.activeViewIndex].panels.indexOf(existingPanel)
      this.scrollToPanel(existingPanel, contentPanel);
    }
  }

  onCategoryClick(categoryTitle: string, contentPanel: ScrollPanel) {
    if (!this.project) {
      return;
    }
    const existingPanel = this.getPanelFromActiveViewForName(categoryTitle);

    if (existingPanel === undefined) {
      const newPanel = new CategoryPanel(categoryTitle)
      this.project.views[this.project?.activeViewIndex].panels.push(newPanel);
      const scrollToNewPanel = (attempt: number = 0) => {
        if (newPanel.htmlElement !== undefined) {
          this.scrollToPanel(newPanel, contentPanel)
        } else {
          if (attempt > 50) {
          } else {
            attempt++;
            setTimeout(() => scrollToNewPanel(attempt), 100)
          }
        }
      }
      scrollToNewPanel();
    } else {
      this.project.views[this.project.activeViewIndex].activePanelIndex = this.project.views[this.project.activeViewIndex].panels.indexOf(existingPanel)
      this.scrollToPanel(existingPanel, contentPanel);
    }
  }

  onAddElementClick(uniqueName: string, targetMap: 'categories' | 'notes', contentPanel: ScrollPanel) {
    if (this.project?.categories?.has(uniqueName)) {
      this.messageService.add({ severity: 'error', summary: 'A category with this name already exists. All names in GAS need to be unique.', life: 3000 })
    } else if (this.project?.notes?.has(uniqueName)) {
      this.messageService.add({ severity: 'error', summary: 'A note with this name already exists. All names in GAS need to be unique.', life: 3000 })
    } else {
      switch (targetMap) {
        case 'categories':
          this.project?.categories?.set(uniqueName, new Category(uniqueName))
          this.categoryKeys?.push(uniqueName);
          this.onCategoryClick(uniqueName, contentPanel);
          break;
        case 'notes':
          this.project?.notes?.set(uniqueName, new Note(uniqueName))
          this.noteKeys?.push(uniqueName);
          this.onNoteClick(uniqueName, contentPanel);
          break;
      }
    }
  }

  getPanelFromActiveViewForName(noteTitle: string): GenericPanel | undefined {
    return this.project?.views[this.project?.activeViewIndex].panels.find((panel) => {
      return panel.uniqueName === noteTitle;
    });
  }

  removePanelFromActiveView(panel: GenericPanel) {
    const panelIndex: number = this.project?.views[this.project?.activeViewIndex].panels.indexOf(panel) ?? -1;
    if (panelIndex != -1) {
      this.project?.views[this.project?.activeViewIndex].panels.splice(panelIndex, 1)
    }
  }

  scrollToPanel(child: GenericPanel, parent: ScrollPanel) {
    parent.scrollTop(child.htmlElement?.offsetTop ?? 0)
  }

  panelIsInstanceOf(panel: GenericPanel, type: Type<GenericPanel>): boolean {
    return panel instanceof type;
  }

  castToNotePanel(panel: GenericPanel): NotePanel {
    return panel as NotePanel;
  }
  castToCategoryPanel(panel: GenericPanel): CategoryPanel {
    return panel as CategoryPanel;
  }

  moveUp(index: number, panels: GenericPanel[]) {
    if (index > 0) {
      let tmp = panels[index - 1];
      panels[index - 1] = panels[index];
      panels[index] = tmp;
    }
  }

  moveDown(index: number, panels: GenericPanel[]) {
    if (index < (panels.length - 1)) {
      let tmp = panels[index + 1];
      panels[index + 1] = panels[index];
      panels[index] = tmp;
    }
  }

  navigateInternalLink(internallink: string) {
    internallink.replace('[[', '').replace(']]', '');
  }

  getRelatedElements(panel: GenericPanel) {
    if (panel instanceof NotePanel) {
      return this.project?.notes.get(panel.uniqueName)?.relatedElements;
    } else if (panel instanceof CategoryPanel) {
      return this.project?.categories.get(panel.uniqueName)?.relatedElements;
    } else {
      return [];
    }
  }

  filterKeyArrays(filterString: string) {
    if (filterString) {
      this.filteredNoteKeys = this.noteKeys.filter((key) => key.includes(filterString))
      this.filteredCategoryKeys = this.categoryKeys.filter((key) => key.includes(filterString))
    } else {
      this.filteredNoteKeys = undefined;
      this.filteredCategoryKeys = undefined;
    }
  }

  newProject(title?: string) {
    this.loadProject(new Project(title ?? 'Untitled Project', new Map(), new Map(), []));
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
    if(project) {
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
      this.project.views?.push(new PanelView());
      this.project.activeViewIndex = this.project.views.length - 1;
    }
  }

  removeView(index: number) {
    if (this.project) {
      this.project.activeViewIndex = index - 1;
      this.project.views?.splice(index, 1);
    }
  }

  removeLink(index: number) {
    if (this.project) {
      this.getRelatedElements(this.project.views[this.project.activeViewIndex].panels[this.project.views[this.project.activeViewIndex].activePanelIndex])?.splice(index, 1);
    }
  }

  deleteNote(name: string) {
    if (this.project) {
      if (this.project.notes.delete(name)) {
        this.noteKeys = this.noteKeys.filter((key) => key !== name);
        for (const view of this.project.views) {
          view.panels = view.panels.filter((panel) => panel.uniqueName !== name);
        }
      }
    }
  }

  deleteCategory(name: string) {
    if (this.project) {
      if (this.project.categories.delete(name)) {
        this.categoryKeys = this.categoryKeys.filter((key) => key !== name);
        for (const view of this.project.views) {
          view.panels = view.panels.filter((panel) => panel.uniqueName !== name);
        }
      }
    }
  }
}
