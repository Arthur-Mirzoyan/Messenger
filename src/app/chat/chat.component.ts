import { NgClass, NgIf } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from '../message';
import { AppService } from '../app.service';
import { ChatService } from './chat.service';
import { Chat } from '../chat';

@Component({
  selector: 'chat-comp',
  standalone: true,
  templateUrl: 'chat.component.html',
  styleUrl: 'chat.component.scss',
  imports: [NgClass, FormsModule, NgIf],
  providers: [ChatService],
})
export class ChatComponent {
  public id: string = '';
  public body: string = '';
  public messages: Message[] = [];

  @ViewChild('messageContainer')
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
      this.chatService.writeUserData(
        this.appService.user.userId,
        this.body.trim()
      );
      this.body = '';
    }
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop =
        this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
