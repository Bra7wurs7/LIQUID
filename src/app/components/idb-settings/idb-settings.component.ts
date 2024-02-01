import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-idb-settings',
  templateUrl: './idb-settings.component.html',
  styleUrl: './idb-settings.component.scss'
})
export class IdbSettingsComponent {
  @Input() allProjects!: null | { title: string; lastModified: Date }[];
  @Input() activeProject!: string;
  @Output() projectEventEmitter: EventEmitter<["load" | "delete" | "saveas" | "new", string]> = new EventEmitter();
}
