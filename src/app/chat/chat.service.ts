import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { database } from '../database/connection';
import { Injectable } from '@angular/core';
import { AppService } from '../app.service';
import { Message } from '../message';

@Injectable()
export class ChatService {
  private messagesRef = collection(database, 'messages');

  constructor(private appService: AppService) {}

  async writeUserData(senderId: string, body: string) {
    const newMessage = await addDoc(this.messagesRef, {
      body: body,
      senderId: senderId,
      createdAt: Date.now(),
    });

    await updateDoc(doc(database, 'chats', this.appService.currentChat.id), {
      messages: arrayUnion(newMessage.id),
    });
  }

  onChange() {
    if (this.appService.currentChat.id) {
      const chatRef = doc(database, 'chats', this.appService.currentChat.id);
      this.appService.snapShotUnsubsribe = onSnapshot(chatRef, (chatData) => {
        let chat = chatData.data();
        let messageIds = chat?.['messages'];
        messageIds.forEach((messageId: string) => {
          let messageRef = doc(database, 'messages', messageId);
          getDoc(messageRef).then((messageData) => {
            let message = messageData.data();
            let newMessage = new Message(
              messageData?.id,
              message?.['body'],
              message?.['senderId'],
              message?.['createdAt']
            );
            if (!this.appService.currentChat.messages.includes(newMessage)) {
              this.appService.currentChat.messages.push(newMessage);
            }
          });
        });
      });
    }
  }

  getAllMessages() {
    const chatRef = doc(database, 'chats', this.appService.currentChat.id);
    getDoc(chatRef).then((chatData) => {
      const messageIds = chatData.data()?.['messages'];
      this.getMessages(messageIds);
    });
  }

  getMessages(messageIds: string[]) {
    messageIds?.forEach((messageId: string) => {
      let messageRef = doc(database, 'messages', messageId);
      getDoc(messageRef).then((messageData) => {
        let message = messageData.data();
        let newMessage = new Message(
          messageData.id,
          message?.['body'],
          message?.['senderId'],
          message?.['createdAt']
        );
        this.appService.currentChat.messages.push(newMessage);
      });
    });
  }
}
