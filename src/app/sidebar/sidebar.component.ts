import { Component, HostListener } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { Chat } from '../chat';
import { FormsModule } from '@angular/forms';
import { SidebarService } from './sidebar.service';
import { ChatService } from '../chat/chat.service';

@Component({
  selector: 'sidebar-comp',
  standalone: true,
  templateUrl: 'sidebar.component.html',
  styleUrl: 'sidebar.component.scss',
  imports: [FormsModule],
  providers: [SidebarService, ChatService],
})
export class SidebarComponent {
  public newChatName: string = '';

  constructor(
    protected appService: AppService,
    private sidebarService: SidebarService,
    private chatService: ChatService,
    private router: Router
  ) {}

  @HostListener('window:beforeunload', ['$event']) unloadHandler() {
    this.appService.snapShotUnsubsribe?.();

    const userJSON = JSON.stringify(this.appService.user);
    localStorage.setItem('###', userJSON);
    this.appService.isChatSelected = false;
  }

  @HostListener('window:load', ['$event']) onloadHandler() {
    const userJSON = localStorage.getItem('###') || '';
    this.router.navigate(['/chats'], {
      queryParams: {
        name: null,
      },
    });
    try {
      localStorage.removeItem('###');
      this.appService.user = JSON.parse(userJSON);
    } catch (err: any) {}
  }

  createChat() {
    this.sidebarService.createNewChat(
      this.newChatName,
      () => (this.newChatName = '')
    );
  }

  moveToChat(chat: Chat) {
    this.appService.snapShotUnsubsribe?.();

    this.appService.currentChat = new Chat(
      chat.id,
      chat.name,
      chat.ownerId,
      chat.memberIds
    );
    
    this.appService.isChatSelected = true;
    this.chatService.onChange();

    this.router.navigate(['/chats'], {
      queryParams: {
        name: chat.name.replace(' ', '-'),
      },
    });
  }
}
