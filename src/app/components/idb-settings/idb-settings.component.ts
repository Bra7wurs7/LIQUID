import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from '../../models/project.model';
import { ProjectEvent } from 'src/app/models/projectEvent.model';

@Component({
  selector: 'app-idb-settings',
  templateUrl: './idb-settings.component.html',
  styleUrl: './idb-settings.component.scss'
})
export class IdbSettingsComponent {
  @Input() allProjects!: null | { title: string; lastModified: Date }[];
  @Input() activeProject!: string;
  @Output() projectEventEmitter: EventEmitter<ProjectEvent> = new EventEmitter();

  newProjectMenuItems = [
    { label: 'Import from .zip', icon: 'pi pi-fw pi-upload', command: () => this.projectEventEmitter.emit(["upload", '']) }
  ]

  lastClickedProject?: string;
  existingProjectMenuItems = [
    { label: 'Export as .zip', icon: 'pi pi-fw pi-download', command: () => this.projectEventEmitter.emit(["download", this.lastClickedProject ?? '']) },
    { label: 'Delete', icon: 'pi pi-fw pi-trash', command: () => this.projectEventEmitter.emit(["delete", this.lastClickedProject ?? '']) }
  ]
}
