import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Conversation, Msg } from '../../models/conversation.model';
import { scrollIncrementDecrement } from '../../util/functions'
import { LlmApiService } from '../../services/llmApi/llm-api.service';

@Component({
  selector: 'app-conversation-viewer',
  templateUrl: './conversation-viewer.component.html',
  styleUrl: './conversation-viewer.component.scss'
})
export class ConversationViewerComponent {
  constructor(private llmApiService: LlmApiService) { }

  @Input() conversations!: Conversation[];
  @Output() conversationTouchedEmitter: EventEmitter<boolean> = new EventEmitter();

  scrollIncrementDecrement = scrollIncrementDecrement;
  llmConfigs = this.llmApiService.llmConfigs;

  activeConversation: number = 0;
  activeMessage: number = 0;
  selectedLLMIndex: number = 0;

  deleteMessages(deleteSystem: boolean = false) {
    if (deleteSystem) {
      this.conversations[this.activeConversation].messages = [];
    } else {
      this.conversations[this.activeConversation].messages = this.conversations[this.activeConversation].messages.filter((msg) => msg.role === 'system')
    }
    this.activeMessage = 0;
    this.onTouchConversations();
  }

  addEmptyMessage(messages: Msg[]) {
    messages.push({
      active: true,
      role: 'user',
      content: ''
    })
    this.onTouchConversations();
  }

  promptConversation() {
    const message: Msg = { role: 'assistant', content: '', active: true }
    this.llmApiService.sendLLMPrompt(this.conversations[this.activeConversation], this.llmApiService.llmConfigs[this.selectedLLMIndex]).then((o) => {
      o?.subscribe((a) => {
        for (const v of a) {
          if (v && v.choices) {
            const newContent = v.choices[0]?.delta?.content;
            const finishReason = v.choices[0]?.finish_reason;
            if (newContent !== undefined) {
              message.content += newContent;
            }
            if (finishReason) {
              localStorage.setItem('conversations', JSON.stringify(this.conversations));
            }
          }
        }
      })
    })
    this.conversations[this.activeConversation].messages.push(message)
    this.onTouchConversations();
    this.activeMessage = this.conversations[this.activeConversation].messages.length - 1;
  }

  onTouchConversations() {
    // Remove all empty conversations that aren't the last conversation
    let removedConversation = true;
    while (removedConversation) {
      removedConversation = false;
      const index = this.conversations.findIndex((conv) => conv.messages.length === 0)
      if (index !== -1 && index !== this.conversations.length - 1) {
        this.conversations.splice(index, 1)
        removedConversation = true;
      } else {
        removedConversation = false;
      }
    }
    // Add new empty conversation if the last conversation is no longer empty
    if (this.conversations[this.conversations.length - 1].messages.length > 0) {
      this.conversations.push(new Conversation())
    }

    localStorage.setItem('conversations', JSON.stringify(this.conversations));
  }
}
