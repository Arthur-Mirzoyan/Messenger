import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from '../message';
import { HomeService } from './home.service';
import { User } from '../user';
import { NgClass } from '@angular/common';

@Component({
  selector: 'home-comp',
  standalone: true,
  templateUrl: 'home.component.html',
  styleUrl: 'home.component.scss',
  imports: [FormsModule, NgClass],
  providers: [HomeService],
})
export class HomeComponent {
  public id: string = '';
  public body: string = '';
  public messages: Message[] = [];
  public user: User | null = null;

  @ViewChild('messageContainer')
  private messageContainer!: ElementRef;

  constructor(private homeService: HomeService) {}

  ngOnInit() {
    this.homeService.getUser().then((user) => (this.user = user));
    this.readMessages();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private readMessages() {
    this.homeService.onChange((data: []) => {
      console.log(data);
      this.messages = data
        .reverse()
        .map(
          (item: any) =>
            new Message(item?.id, item?.body, item?.senderId, item?.createdAt)
        );
    });
  }

  write() {
    this.homeService.writeUserData(this.body);
    this.body = '';
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop =
        this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
