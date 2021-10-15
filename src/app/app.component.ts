import { Component, OnInit, Type } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { ScrollPanel } from 'primeng/scrollpanel';
import { Category } from './models/category.model';
import { CategoryPanel, GenericPanel, NotePanel } from './models/panel.model';
import { Note } from './models/note.model';
import { defaultProject, Project } from './models/project.model';

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

  rightSearch: string = '';
  leftSearch: string = '';

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

  onNoteClick(noteTitle: string, contentPanel: ScrollPanel) {
    if (!this.project) {
      return;
    }

    const existingPanel = this.getPanelFromActiveViewForName(noteTitle);
    if (existingPanel === undefined) {
      this.project?.views[this.project?.activeViewIndex].panels.push(new NotePanel(noteTitle))
    } else {
      this.project.views[this.project.activeViewIndex].activePanelIndex = this.project?.views[this.project.activeViewIndex].panels.indexOf(existingPanel)
      this.scrollToPanel(existingPanel, contentPanel);
    }
  }

  onCategoryClick(categoryTitle: string, contentPanel: ScrollPanel) {
    const existingPanel = this.getPanelFromActiveViewForName(categoryTitle);

    if (existingPanel === undefined) {
      this.project?.views[this.project?.activeViewIndex].panels.push(new CategoryPanel(categoryTitle))
    } else {
      this.scrollToPanel(existingPanel, contentPanel);
    }
  }

  onAddElementClick(uniqueName: string, targetMap: 'categories' | 'notes') {
    if (this.project?.categories?.has(uniqueName)) {
      this.messageService.add({ severity: 'error', summary: 'A category with this name already exists. All names in GAS need to be unique.', life: 3000 })
    } else if (this.project?.notes?.has(uniqueName)) {
      this.messageService.add({ severity: 'error', summary: 'A note with this name already exists. All names in GAS need to be unique.', life: 3000 })
    } else {
      switch (targetMap) {
        case 'categories':
          this.project?.categories?.set(uniqueName, new Category(uniqueName))
          this.categoryKeys?.push(uniqueName);
          break;
        case 'notes':
          this.project?.notes?.set(uniqueName, new Note(uniqueName))
          this.noteKeys?.push(uniqueName);
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
    console.log(internallink);
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
    if(filterString) {
      this.filteredNoteKeys = this.noteKeys.filter((key) => key.includes(filterString))
      this.filteredCategoryKeys = this.categoryKeys.filter((key) => key.includes(filterString))
    } else {
      this.filteredNoteKeys = undefined;
      this.filteredCategoryKeys = undefined;
    }
  }

  log(a: any) {
    console.log(a);
  }
}
