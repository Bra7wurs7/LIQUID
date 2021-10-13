import { AfterViewInit, Component, OnInit, Type, ViewChild } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { ScrollPanel } from 'primeng/scrollpanel';
import { Category } from './models/category.model';
import { CategoryPanel, GenericPanel, NotePanel } from './models/panel.model';
import { Note } from './models/note.model';
import { defaultProject, Project } from './models/project.model';
import { Panel } from 'primeng/panel';

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
  categoryKeys: string[] = [];
  title = 'GAS';

  infinity: number = Infinity;

  secondarMenu: TreeNode[];
  constructor(private messageService: MessageService) {
    this.secondarMenu = [
      {
        label: 'Project',
        icon: 'pi pi-fw pi-file',
        children: [
          {
            label: 'Save',
            icon: 'pi pi-fw pi-save',
            children: [
              {
                label: 'To Drive',
                icon: 'pi pi-fw pi-desktop'
              },
              {
                label: 'To Browser',
                icon: 'pi pi-fw pi-globe'
              }
            ]
          },
          {
            label: 'Load',
            icon: 'pi pi-fw pi-folder-open',
            children: [
              {
                label: 'From Drive',
                icon: 'pi pi-fw pi-desktop'
              },
              {
                label: 'From Browser',
                icon: 'pi pi-fw pi-globe'
              }
            ]
          }
        ]
      },
      {
        label: 'Settings',
        icon: 'pi pi-fw pi-sliders-h',
        children: [
          {
            label: 'Left',
            icon: 'pi pi-fw pi-align-left'
          },
          {
            label: 'Right',
            icon: 'pi pi-fw pi-align-right'
          },
          {
            label: 'Center',
            icon: 'pi pi-fw pi-align-center'
          },
          {
            label: 'Justify',
            icon: 'pi pi-fw pi-align-justify'
          }
        ]
      }
    ]
  }

  ngOnInit() {
    this.project = defaultProject.toProject();
    for (const key of this.project.notes?.keys()) {
      this.noteKeys?.push(key);
    }
    for (const key of this.project.categories?.keys()) {
      this.categoryKeys?.push(key);
    }
    this.title = this.project.title;
  }

  onAddNoteFolderClick(folderTitle: string) {
    this.messageService.add({ severity: 'error', summary: 'Feature not supported yet.', life: 3000 })
  }

  onAddNoteClick(noteTitle: string) {
    if (this.project?.notes.has(noteTitle)) {
      this.messageService.add({ severity: 'error', summary: 'A note with this name already exists.', life: 3000 })
    } else {
      this.project?.notes?.set(noteTitle, new Note(noteTitle))
      this.noteKeys?.push(noteTitle);
    }
  }

  onNoteClick(noteTitle: string, contentPanel: ScrollPanel) {
    const existingPanel = this.getPanelOfNoteFromActiveView(noteTitle);

    if (existingPanel === undefined) {
      this.project?.views[this.project?.activeViewIndex].panels.push(new NotePanel(noteTitle))
    } else {
      this.scrollToPanel(existingPanel, contentPanel);
    }
  }

  onAddCategoryClick(categoryTitle: string) {
    if (this.project?.categories?.has(categoryTitle)) {
      this.messageService.add({ severity: 'error', summary: 'A category with this name already exists.', life: 3000 })
    } else {
      this.project?.categories?.set(categoryTitle, new Category(categoryTitle))
      this.categoryKeys?.push(categoryTitle);
    }
  }

  onCategoryClick(categoryTitle: string, contentPanel: ScrollPanel) {
    const existingPanel = this.getPanelOfCategoryFromActiveView(categoryTitle);

    if (existingPanel === undefined) {
      this.project?.views[this.project?.activeViewIndex].panels.push(new CategoryPanel(categoryTitle))
    } else {
      this.scrollToPanel(existingPanel, contentPanel);
    }
  }

  getPanelOfNoteFromActiveView(noteTitle: string) {
    return this.project?.views[this.project?.activeViewIndex].panels.find((panel) => {
      if (panel instanceof NotePanel) {
        return panel.noteName === noteTitle;
      }
      return false;
    });
  }

  getPanelOfCategoryFromActiveView(categoryTitle: string) {
    return this.project?.views[this.project?.activeViewIndex].panels.find((panel) => {
      if (panel instanceof CategoryPanel) {
        return panel.categoryName === categoryTitle;
      }
      return false;
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
}
