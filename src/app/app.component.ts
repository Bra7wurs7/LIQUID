import { AfterViewInit, Component, OnInit, Type, ViewChild } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { ScrollPanel } from 'primeng/scrollpanel';
import { GenericPanel, NotePanel } from './models/note-panel.model';
import { Note } from './models/note.model';
import { defaultProject, Project } from './models/project.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  notePanelType = NotePanel;

  project?: Project;
  noteKeys: string[] = [];
  title = 'GAS';

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
    this.title = this.project.title;
  }

  onAddNoteFolderClick(folderTitle: string) {
    this.messageService.add({severity: 'error', summary: 'Feature not supported yet.', life: 3000})
  }

  onAddNoteClick(noteTitle: string) {
    if(this.project?.notes.has(noteTitle)) {
      this.messageService.add({severity: 'error', summary: 'A note with this name already exists.', life: 3000})
    } else {
      this.project?.notes?.set(noteTitle, new Note(noteTitle))
      this.noteKeys?.push(noteTitle);
    }
  }

  onNoteClick(noteTitle: string, contentPanel: ScrollPanel) {
    const existingPanel = this.getPanelOfNoteFromActiveView(noteTitle);

    if(existingPanel === undefined) {
      this.project?.views[this.project?.activeViewIndex].panels.push(new NotePanel(noteTitle))
    } else {
      this.scrollToPanel(existingPanel, contentPanel);
    }

  }

  getPanelOfNoteFromActiveView(noteTitle: string) {
    return this.project?.views[this.project?.activeViewIndex].panels.find((panel) => {
      if(panel instanceof NotePanel) {
        return panel.noteName === noteTitle;
      }
      return false;
    });
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
}
