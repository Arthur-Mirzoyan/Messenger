import { NgClass, NgIf } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from '../message';
import { AppService } from '../app.service';
import { ChatService } from './chat.service';
import { ChatInfoComponent } from './chat-info.component';

@Component({
  selector: 'chat-comp',
  standalone: true,
  templateUrl: 'chat.component.html',
  styleUrl: 'chat.component.scss',
  imports: [NgClass, FormsModule, NgIf, ChatInfoComponent],
  providers: [ChatService],
})
export class ChatComponent {
  public id: string = '';
  public body: string = '';
  public messages: Message[] = [];
  public isChatInfoPanelShown: boolean = false;

  @ViewChild('messageContainer', { static: false })
  private messageContainer!: ElementRef;

  constructor(
    protected appService: AppService,
    private chatService: ChatService
  ) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  write() {
    if (this.body.trim() !== '') {
      this.chatService.writeUserData(this.body);
      this.body = '';
    }
  }

  showChatInfoPanel() {
    this.isChatInfoPanelShown = !this.isChatInfoPanelShown;
    this.chatService.getChatMembers();
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop =
        this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
