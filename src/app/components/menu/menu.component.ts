import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from '../../models/project';
import { MenuEvent } from 'src/app/models/projectEvent';
import { LlmApiService } from 'src/app/services/llmApi/llm-api.service';
import { scrollIncrementDecrement } from 'src/app/util/functions';
import { ApiConfig } from 'src/app/models/apiConfig';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Input() allProjectsPromise!: Promise<{ title: string; lastModified: Date }[]>;
  @Input() activeProject!: string;
  @Input() allApis!: ApiConfig[]
  @Output() menuEventEmitter: EventEmitter<MenuEvent> = new EventEmitter();
  @Output() saveApisEmitter: EventEmitter<void> = new EventEmitter();

  scrollIncrementDecrement = scrollIncrementDecrement;

  JSON = JSON;
  selectedLLM: any;

  apiRecommendations = ["https://api.openai.com/v1/chat/completions", "https://api.mistral.ai/v1/chat/completions", "http://localhost:11434/api/chat"];
  selectedApiRecommendationIndex: number = -1;

  editConfig?: string;
  editConfigIndex?: number;

  newProjectMenuItems = [
    { label: 'Import archive as directory', icon: 'iconoir iconoir-archive', command: () => this.menuEventEmitter.emit(["/upload", '']) }
  ]

  lastRightClickedProject?: string;
  existingProjectMenuItems = [
    { label: 'Export directory as archive', icon: 'iconoir iconoir-download-square', command: () => this.menuEventEmitter.emit(["/download", this.lastRightClickedProject ?? '']) },
    { label: 'Delete', icon: 'iconoir iconoir-bin-half', command: () => this.menuEventEmitter.emit(["/delete", this.lastRightClickedProject ?? '']) }
  ]

  constructor(public llmApiService: LlmApiService) {}

  saveLLMConfigJSON(config: string, index: number) {
    if (this.editConfigIndex !== undefined) {
      try {
        const conf: ApiConfig = JSON.parse(config);
        this.allApis[this.editConfigIndex].url = conf.url;
        this.allApis[this.editConfigIndex].body = conf.body;
        this.allApis[this.editConfigIndex].headers = conf.headers;
        this.allApis[this.editConfigIndex].params = conf.params;
      } catch { }
      this.saveApisEmitter.emit();
    }
  }

  onEnterVault(vault_title: string) {
    this.menuEventEmitter.emit(['/folder', vault_title])
  }
}
