import { Component } from '@angular/core';
import { LlmApiService } from '../../services/llmApi/llm-api.service';
import { LLMConfig } from 'src/app/services/llmApi/llm-config.model';

@Component({
  selector: 'app-llm-settings',
  templateUrl: './llm-settings.component.html',
  styleUrls: ['./llm-settings.component.scss']
})
export class LlmSettingsComponent {
  JSON = JSON;
  llms: any[];
  selectedLLM: any;

  editConfig?: string;
  editConfigIndex?: number;

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
            mname: 'GPT-4 Turbo Preview',
            code: ["https://api.openai.com/v1/chat/completions", 'gpt-4-turbo-preview', 'openai'],
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
            code: ["https://api.mistral.ai/v1/chat/completions", 'mistral-medium', 'mistral'],
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
