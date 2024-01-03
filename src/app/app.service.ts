import { Injectable } from '@angular/core';
import { User } from './user';
import { Unsubscribe, doc, getDoc } from 'firebase/firestore';
import { database } from './database/connection';
import { Chat } from './chat';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public user: User = new User('', '', '');
  public currentChat: Chat = new Chat('', '', '');
  public isChatSelected = false;
  public isChatInfoPanelShown = false;
  public snapShotUnsubsribe!: Unsubscribe;

  getUser(userId: string, callback: Function) {
    getDoc(doc(database, 'users', userId))
      .then((userSnap) => {
        const userData = userSnap.data();
        const chatIds = userData?.['chats'];
        const chatDatas: Chat[] = [];

        chatIds.forEach((chatId: string) => {
          this.getChatInfo(chatId, (chat: Chat) => chatDatas.push(chat));
        });

        const user = new User(
          userSnap.id,
          userData?.['userName'],
          userData?.['password'],
          chatDatas
        );

        callback(user);
      })
      .catch((err: any) => {
        callback(null);
      });
  }

  getChatInfo(chatId: string, callback: Function) {
    const chatRef = doc(database, 'chats', chatId);

    getDoc(chatRef).then((chatSnap) => {
      const chatData = chatSnap.data();
      const chat = new Chat(
        chatSnap.id,
        chatData?.['name'],
        chatData?.['ownerId'],
        chatData?.['members']
      );
      callback(chat);
    });
  }
}
