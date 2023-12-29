import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { database } from '../database/connection';
import { Injectable } from '@angular/core';
import { AppService } from '../app.service';
import { Message } from '../message';
import { User } from '../user';

@Injectable()
export class ChatService {
  private messagesRef = collection(database, 'messages');
  private usersRef = collection(database, 'users');

  constructor(private appService: AppService) {}

  async writeUserData(body: string) {
    const newMessage = await addDoc(this.messagesRef, {
      body: body.trim(),
      senderId: this.appService.user.userId,
      createdAt: Date.now(),
    });

    await updateDoc(doc(database, 'chats', this.appService.currentChat.id), {
      messages: arrayUnion(newMessage.id),
    });
  }

  onChange() {
    if (this.appService.currentChat.id) {
      console.log(this.appService.currentChat);
      const chatRef = doc(database, 'chats', this.appService.currentChat.id);

      this.appService.snapShotUnsubsribe = onSnapshot(chatRef, (chatData) => {
        let chat = chatData.data();
        let messageIds = chat?.['messages'];

        messageIds.forEach((messageId: string) => {
          let messageRef = doc(database, 'messages', messageId);

          getDoc(messageRef).then((messageData) => {
            let message = messageData.data();

            if (!this.isMessageAlreadyAdded(messageData.id)) {
              let newMessage = new Message(
                messageData.id,
                message?.['body'],
                message?.['senderId'],
                message?.['createdAt']
              );

              this.appService.currentChat.messages.push(newMessage);
            }
          });
        });
      });
    }
  }

  getChatMembers() {
    this.appService.currentChat.memberIds.forEach((memberId: string) => {
      const memberRef = doc(database, 'users', memberId);
      getDoc(memberRef).then((memberData) => {
        const member = memberData.data();
        const newMember = new User(memberId, member?.['userName']);
        this.appService.currentChat.addUser(newMember);
      });
    });
  }

  async addChatMember(userName: string, callBack: Function) {
    const q = query(this.usersRef, where('userName', '==', userName));
    const response = await getDocs(q);

    response.forEach((user) => {
      const chatRef = doc(database, 'chats', this.appService.currentChat.id);
      updateDoc(chatRef, {
        members: arrayUnion(user.id),
      })
        .then(() => {
          updateDoc(user.ref, {
            chats: arrayUnion(this.appService.currentChat.id),
          }).then(() => callBack(true));
        })
        .catch(() => {
          callBack(false);
        });
    });
  }

  private isMessageAlreadyAdded(messageIdtoCheck: string): boolean {
    const result = this.appService.currentChat.messages.some(
      (message) => message.id === messageIdtoCheck
    );
    return result;
  }

  /* ------------- */

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
