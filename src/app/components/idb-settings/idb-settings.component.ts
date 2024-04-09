import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Vault } from '../../models/vault.model';
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
    { label: 'Import archive', icon: 'iconoir iconoir-archive', command: () => this.projectEventEmitter.emit(["upload", '']) }
  ]

  lastClickedProject?: string;
  existingProjectMenuItems = [
    { label: 'Export archive', icon: 'iconoir iconoir-download-square', command: () => this.projectEventEmitter.emit(["download", this.lastClickedProject ?? '']) },
    { label: 'Delete', icon: 'iconoir iconoir-bin-half', command: () => this.projectEventEmitter.emit(["delete", this.lastClickedProject ?? '']) }
  ]
}
