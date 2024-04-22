import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Conversation, Msg } from '../../models/conversation';
import { scrollIncrementDecrement } from '../../util/functions'
import { LlmApiService } from '../../services/llmApi/llm-api.service';

@Component({
  selector: 'app-conversation-viewer',
  templateUrl: './conversation-viewer.component.html',
  styleUrl: './conversation-viewer.component.scss'
})
export class ConversationViewerComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
    this.addMessageEmitter.subscribe((message) => {
      this.activeMessage = this.conversation.messages.length - 1;
    })
  }

  @Input() conversation!: Conversation;
  @Input() addMessageEmitter!: EventEmitter<Msg>;
  @Output() messageEventEmitter: EventEmitter<[string, Msg | undefined]> = new EventEmitter();

  messageContextMenuItems = [
    {
      label: 'Save as article', icon: 'iconoir iconoir-page-plus-in', command: () => {
        this.messageEventEmitter.emit(['save', this.conversation.messages[this.rightClickedMessage]])
      }
    },
    {
      separator: true
    },
    {
      label: 'Toggle Visibility', icon: 'iconoir iconoir-eye-solid', command: () => {
        this.conversation.messages[this.rightClickedMessage].active = !this.conversation.messages[this.rightClickedMessage].active
        //this.onTouchConversations()
      }
    },
    {
      label: 'Delete', icon: 'iconoir iconoir-chat-bubble-xmark', command: () => {
        this.conversation.messages.splice(this.rightClickedMessage, 1)
        this.activeMessage = this.rightClickedMessage > this.activeMessage ? this.activeMessage : this.activeMessage - 1
        this.messageEventEmitter.emit(['added/removed', undefined])
        //this.onTouchConversations()
      }
    },
  ];
  rightClickedMessage: number = -1;
  rightClickedConversation: number = -1;

  scrollIncrementDecrement = scrollIncrementDecrement;

  activeMessage: number = 0;

  addEmptyMessage(messages: Msg[], addToStart: boolean) {
    const newMessage: Msg = {
      active: true,
      role: 'system',
      content: ''
    }
    if (addToStart) {
      messages.unshift(newMessage)
      this.activeMessage = 0;
    } else {
      messages.push(newMessage)
      this.activeMessage = this.conversation.messages.length - 1
    }
    this.messageEventEmitter.emit(['added/removed', newMessage])
  }
}
