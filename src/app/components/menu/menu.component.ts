import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from '../../models/project.model';
import { ProjectEvent } from 'src/app/models/projectEvent.model';
import { LLMConfig } from 'src/app/services/llmApi/llm-config.model';
import { LlmApiService } from 'src/app/services/llmApi/llm-api.service';

@Component({
  selector: 'app-idb-settings',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Input() allProjects!: null | { title: string; lastModified: Date }[];
  @Input() activeProject!: string;
  @Output() projectEventEmitter: EventEmitter<ProjectEvent> = new EventEmitter();

  JSON = JSON;
  llms: any[];
  selectedLLM: any;

  editConfig?: string;
  editConfigIndex?: number;

  newProjectMenuItems = [
    { label: 'Import archive', icon: 'iconoir iconoir-archive', command: () => this.projectEventEmitter.emit(["upload", '']) }
  ]

  lastClickedProject?: string;
  existingProjectMenuItems = [
    { label: 'Export archive', icon: 'iconoir iconoir-download-square', command: () => this.projectEventEmitter.emit(["download", this.lastClickedProject ?? '']) },
    { label: 'Delete', icon: 'iconoir iconoir-bin-half', command: () => this.projectEventEmitter.emit(["delete", this.lastClickedProject ?? '']) }
  ]

  foobs = [1,2,3];

  constructor(public llmApiService: LlmApiService) {
    this.llms = [
      {
        name: 'custom.domain',
        code: ["https://api.some-domain.ai/v1/chat/completions", '', 'custom'],
        models: [
          {
            mname: 'Custom Model',
            code: ["https://api.some-domain.com/v1/chat/completions", 'custom-model', 'custom'],
          },
        ]
      },
      {
        name: 'openai.com',
        code: ["https://api.openai.com/v1/chat/completions", '', 'openai'],
        models: [
          {
            mname: 'GPT-3.5 Turbo',
            code: ["https://api.openai.com/v1/chat/completions", 'gpt-3.5-turbo', 'openai'],
          },
          {
            mname: 'GPT-4',
            code: ["https://api.openai.com/v1/chat/completions", 'gpt-4', 'openai'],
          },
          {
            mname: 'GPT-4 Turbo',
            code: ["https://api.openai.com/v1/chat/completions", 'gpt-4-turbo', 'openai'],
          },
        ]
      },
      {
        name: 'mistral.ai',
        code: ["https://api.mistral.ai/v1/chat/completions", '', 'mistral'],
        models: [
          {
            mname: 'Mistral Tiny',
            code: ["https://api.mistral.ai/v1/chat/completions", 'mistral-tiny', 'mistral'],
          },
          {
            mname: 'Mistral Small',
            code: ["https://api.mistral.ai/v1/chat/completions", 'mistral-small', 'mistral'],
          },
          {
            mname: 'Mistral Medium',
            code: ["https://api.mistral.ai/v1/chat/completions", 'mistral-medium-latest', 'mistral'],
          },
          {
            mname: 'Mistral Large',
            code: ["https://api.mistral.ai/v1/chat/completions", 'mistral-large-latest', 'mistral'],
          },
        ]
      }
    ];
  }

  saveLLMConfigJSON(config: string, index: number) {
    if (this.editConfigIndex !== undefined) {
      try {
        const conf: LLMConfig = JSON.parse(config);
        this.llmApiService.llmConfigs[index] = conf;
        this.llmApiService.saveLLMConfigs();
      } catch { }
    }
  }
}
