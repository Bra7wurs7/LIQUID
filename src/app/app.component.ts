import { Component, OnInit } from '@angular/core';
import { MenuItem, TreeNode } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'GAS';
  mainMenu: TreeNode[];
  secondarMenu: TreeNode[];
  constructor() {
    this.mainMenu = [
      {
        label: 'Notes',
        styleClass: 'notes',
        icon: 'pi pi-fw pi-book',
        children: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-plus',
            children: [
              {
                label: 'Note',
                icon: 'pi pi-fw pi-book'
              },
              {
                label: 'Folder',
                icon: 'pi pi-fw pi-folder'
              }
            ]
          }
        ]
      },
      {
        label: 'Categories',
        styleClass: 'categories',
        icon: 'pi pi-fw pi-tag',
        children: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-plus',
          }
        ]
      },
      {
        label: 'Chronicle',
        styleClass: 'chronicle',
        icon: 'pi pi-fw pi-calendar',
        children: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-plus',
            children: [
              {
                label: 'Calendar',
                icon: 'pi pi-fw pi-calendar'
              },
              {
                label: 'Timeline',
                icon: 'pi pi-fw pi-align-right'
              }
            ]
          }
        ]
      },
      {
        label: 'Atlas',
        styleClass: 'atlas',
        icon: 'pi pi-fw pi-map',
        children: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-plus',
          }
        ]
      },
      {
        label: 'Generators',
        styleClass: 'generators',
        icon: 'pi pi-fw pi-cog',
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
      },
      {
        label: 'Resources',
        styleClass: 'resources',
        icon: 'pi pi-fw pi-cloud',
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
      },
    ]
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
  }
}
