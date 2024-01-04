import { Component, HostListener } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { Chat } from '../chat';
import { FormsModule } from '@angular/forms';
import { SidebarService } from './sidebar.service';
import { ChatService } from '../chat/chat.service';
import { ColorService } from '../colors.service';

@Component({
  selector: 'sidebar-comp',
  standalone: true,
  templateUrl: 'sidebar.component.html',
  styleUrl: 'sidebar.component.scss',
  imports: [FormsModule],
  providers: [SidebarService, ChatService, ColorService],
})
export class SidebarComponent {
  public newChatName: string = '';

  constructor(
    protected appService: AppService,
    protected colorService: ColorService,
    private sidebarService: SidebarService,
    private chatService: ChatService,
    private router: Router
  ) {}

  @HostListener('window:beforeunload', ['$event']) unloadHandler() {
    this.appService.snapShotUnsubsribe?.();

    const userJSON = JSON.stringify(this.appService.user);
    if (this.appService.isBrowser) {
      localStorage.setItem('###', userJSON);
      sessionStorage.setItem(
        'currentColorMode',
        this.colorService.getCurrentMode
      );
    }
    this.appService.isChatSelected = false;
  }

  @HostListener('window:load', ['$event']) onloadHandler() {
    const userJSON = this.appService.isBrowser
      ? localStorage.getItem('###') || ''
      : '';

    this.colorService.updateColorMode();
    this.router.navigate(['/chats'], {
      queryParams: {
        name: null,
      },
    });
    try {
      if (this.appService.isBrowser) localStorage.removeItem('###');
      this.appService.user = JSON.parse(userJSON);
    } catch (err: any) {}
  }

  updateChats() {
    this.sidebarService.updateChats();
  }

  logOut() {
    if (this.appService.isBrowser) localStorage.clear();
    this.appService.isChatSelected = false;
    this.router.navigate(['/login']);
  }

  createChat() {
    if (this.newChatName.trim() !== '') {
      this.sidebarService.createNewChat(this.newChatName.trim(), () => {
        this.newChatName = '';
        this.updateChats();
      });
    }
  }

  moveToChat(chat: Chat) {
    this.appService.snapShotUnsubsribe?.();
    this.appService.isChatInfoPanelShown = false;

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

  colorModeChange() {
    this.colorService.changeColorMode();
  }
}
