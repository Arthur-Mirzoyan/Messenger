import { Injectable } from '@angular/core';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class SidebarService {
  constructor(private chatService: ChatService) {}

  createNewChat(chatName: string, callback: Function) {
    this.chatService.createNewChat(chatName, callback);
  }

  refreshChats() {
    this.chatService.updateChats();
  }

  deleteChat(chatId: string) {
    this.chatService.deleteChat(chatId);
  }
}
