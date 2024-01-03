import {
  addDoc,
  collection,
  updateDoc,
  doc,
  arrayUnion,
  getDoc,
} from 'firebase/firestore';
import { database } from '../database/connection';
import { Injectable } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { Chat } from '../chat';

@Injectable()
export class SidebarService {
  private chatsRef = collection(database, 'chats');

  constructor(private appService: AppService, private router: Router) {}

  createNewChat(chatName: string, callback: Function) {
    addDoc(this.chatsRef, {
      name: chatName,
      ownerId: this.appService.user.userId,
      messages: [],
      members: [this.appService.user.userId],
    })
      .then((newChat) => {
        updateDoc(doc(database, 'users', this.appService.user.userId), {
          chats: arrayUnion(newChat.id),
        });
      })
      .then(() => {
        callback();
      });
  }

  updateChats() {
    getDoc(doc(database, 'users', this.appService.user.userId)).then(
      (userData) => {
        const chatIds = userData.data()?.['chats'];

        chatIds.forEach((chatId: string) => {
          if (!this.isChatAdded(chatId)) {
            getDoc(doc(database, 'chats', chatId)).then((chatData: any) => {
              const chat = chatData.data();
              const chatToAdd = new Chat(
                chatId,
                chat?.['name'],
                chat?.['ownerId']
              );

              this.appService.user.chats.push(chatToAdd);
            });
          }
        });
      }
    );
  }

  private isChatAdded(chatId: string): boolean {
    return this.appService.user.chats.some((chat: Chat) => chat.id === chatId);
  }
}
