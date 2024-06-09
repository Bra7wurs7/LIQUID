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
      this.onTouchConversations();
    })
  }

  @Input() conversation!: Conversation;
  @Input() conversations: Conversation[] = [];
  @Input() addMessageEmitter!: EventEmitter<Msg>;
  @Output() messageEventEmitter: EventEmitter<[string, Msg | undefined]> = new EventEmitter();
  body: any = {};

  activeConversationIndex: number = 0;

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
        this.onTouchConversations()
      }
    },
  ];
  rightClickedMessage: number = -1;
  rightClickedConversationIndex: number = -1;

  scrollIncrementDecrement = scrollIncrementDecrement;

  activeMessage: number = 0;


  conversationContextMenuItems = [
    {
      label: 'Clear', icon: 'iconoir iconoir-erase', command: () => {
        this.deleteMessages(false, this.rightClickedConversationIndex)
      }
    },
    {
      label: 'Delete', icon: 'iconoir iconoir-bin-half', command: () => {
        this.deleteMessages(true, this.rightClickedConversationIndex)
      }
    },
  ];

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
    this.onTouchConversations();
  }

  deleteMessages(deleteSystem: boolean = false, conversationIndex: number) {
    if (deleteSystem) {
      this.conversations[conversationIndex].messages = [];
    } else {
      this.conversations[conversationIndex].messages = this.conversations[conversationIndex].messages.filter((msg) => msg.role === 'system')
    }

    this.onTouchConversations();
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
