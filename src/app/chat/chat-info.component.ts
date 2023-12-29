import { Component, ElementRef, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';

@Component({
  selector: 'chat-info-comp',
  standalone: true,
  templateUrl: 'chat-info.component.html',
  styleUrl: 'chat-info.component.scss',
  imports: [FormsModule],
  providers: [ChatService],
})
export class ChatInfoComponent {
  public newMemberUserName: string = '';

  @ViewChild('addMemberDialog', { static: false }) addMemberDialog!: ElementRef;

  constructor(public appService: AppService, public chatService: ChatService) {}

  openAddMemberDialog() {
    this.addMemberDialog.nativeElement.showModal();
  }

  closeAddMemberDialog() {
    this.newMemberUserName = '';
    this.addMemberDialog.nativeElement.close();
  }

  addMember() {
    this.chatService.addChatMember(
      this.newMemberUserName,
      (isAdded: boolean) => {
        this.newMemberUserName = '';
        if (isAdded) this.closeAddMemberDialog();
        else alert('User not found');
      }
    );
  }
}
