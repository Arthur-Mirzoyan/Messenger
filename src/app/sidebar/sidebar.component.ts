import { Component, HostListener, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { Chat } from '../chat';
import { FormsModule } from '@angular/forms';
import { SidebarService } from './sidebar.service';
import { ChatService } from '../chat/chat.service';
import { ColorService } from '../colors.service';
import { UserUpdateComponent } from './user-update.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'sidebar-comp',
  standalone: true,
  templateUrl: 'sidebar.component.html',
  styleUrl: 'sidebar.component.scss',
  imports: [FormsModule, UserUpdateComponent, NgIf],
  providers: [SidebarService, ChatService, ColorService],
})
export class SidebarComponent {
  public newChatName: string = '';
  public isUserUpdateDialogShown: boolean = false;

  constructor(
    protected appService: AppService,
    protected colorService: ColorService,
    private sidebarService: SidebarService,
    private chatService: ChatService,
    private router: Router
  ) {}

  @HostListener('window:beforeunload') unloadHandler() {
    this.appService.snapShotUnsubsribe?.();
    const userJSON = JSON.stringify(this.appService.user);
    this.appService.isChatSelected = false;

    if (this.appService.isBrowser) {
      localStorage.setItem('###', userJSON);
      sessionStorage.setItem(
        'currentColorMode',
        this.colorService.getCurrentMode
      );
    }
  }

  @HostListener('window:load') onloadHandler() {
    this.colorService.updateColorMode();
    this.router.navigate(['/chats'], {
      queryParams: {
        name: null,
      },
    });

    try {
      if (this.appService.isBrowser) {
        const userJSON = localStorage.getItem('###') || '';
        localStorage.removeItem('###');
        this.appService.user = JSON.parse(userJSON);
      }
    } catch (err: any) {}
  }

  @ViewChild('userUpdateDialog', { static: false }) userUpdateDialog:
    | UserUpdateComponent
    | undefined;

  openUserUpdateDialog() {
    this.isUserUpdateDialogShown = true;
    setTimeout(() => this.userUpdateDialog?.open());
  }

  closeUserUpdateDialog() {
    this.isUserUpdateDialogShown = false;
  }

  updateChats() {
    this.sidebarService.refreshChats();
  }

  deleteChat(chatId: string) {
    this.sidebarService.deleteChat(chatId);
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
    this.chatService.readChatMessages();

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
