import { Component } from '@angular/core';
import { LlmApiService } from '../../services/llmApi/llm-api.service';

@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss']
})
export class SettingsMenuComponent {
  constructor(public llmApiService: LlmApiService) {
  }
}
