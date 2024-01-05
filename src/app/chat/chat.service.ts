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
  deleteDoc,
  arrayRemove,
} from 'firebase/firestore';
import { database } from '../database/connection';
import { Injectable } from '@angular/core';
import { AppService } from '../app.service';
import { Message } from '../message';
import { User } from '../user';
import { Chat } from '../chat';

@Injectable()
export class ChatService {
  private usersCollectionReference = collection(database, 'users');
  private chatsCollectionReference = collection(database, 'chats');
  private messagesCollectionReference = collection(database, 'messages');

  constructor(private appService: AppService) {}

  readChatMessages() {
    if (this.appService.currentChat.id) {
      const chatRef = doc(database, 'chats', this.appService.currentChat.id);
      this.appService.snapShotUnsubsribe = onSnapshot(chatRef, (chatData) => {
        let chat = chatData.data();
        let messageIds = chat?.['messages'];

        messageIds?.forEach((messageId: string) => {
          let messageRef = doc(database, 'messages', messageId);

          getDoc(messageRef).then((messageData) => {
            let message = messageData.data();

            if (
              !this.isMessageAlreadyAddedToCurrentChatMessages(messageData.id)
            ) {
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
    if (!this.appService.currentChat.getMembers.length) {
      this.appService.currentChat.memberIds.forEach((memberId: string) => {
        const memberRef = doc(database, 'users', memberId);
        getDoc(memberRef).then((memberData) => {
          const member = memberData.data();
          const newMember = new User(
            memberId,
            member?.['userName'],
            member?.['name']
          );
          this.appService.currentChat.addUser(newMember);
        });
      });
    }
  }

  updateChats() {
    getDoc(doc(database, 'users', this.appService.user.userId)).then(
      (userData) => {
        const chatIds = userData.data()?.['chats'];

        chatIds.forEach((chatId: string) => {
          if (!this.isChatAddedToUserChats(chatId)) {
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

  createNewChat(chatName: string, callback: Function) {
    addDoc(this.chatsCollectionReference, {
      name: chatName,
      ownerId: this.appService.user.userId,
      messages: [],
      members: [this.appService.user.userId],
    }).then((newChat) => {
      updateDoc(doc(database, 'users', this.appService.user.userId), {
        chats: arrayUnion(newChat.id),
      }).then(() => {
        callback();
      });
    });
  }

  deleteChat(chatId: string) {
    const isConfirmed = this.appService.isBrowser
      ? window.confirm('Delete Chat?')
      : true;

    if (isConfirmed) {
      const chatToDeleteRef = doc(database, 'chats', chatId);
      getDoc(chatToDeleteRef)
        .then((chatSnap) => {
          const chatData = chatSnap.data();
          const chatMessageIdsToDelete = chatData?.['messages'];
          const chatMemberIdsToDelete = chatData?.['members'];

          chatMessageIdsToDelete.forEach((messageId: string) =>
            deleteDoc(doc(database, 'messages', messageId))
          );

          chatMemberIdsToDelete.forEach((memberId: string) =>
            updateDoc(doc(database, 'users', memberId), {
              chats: arrayRemove(chatId),
            })
          );
        })
        .then(() => {
          deleteDoc(chatToDeleteRef).then(() => {
            if (this.appService.isBrowser) location.reload();
          });
        });
    }
  }

  deleteSingleMessageFromChat(messageId: string) {
    getDoc(doc(database, 'messages', messageId)).then((messageSnap) => {
      const messageData = messageSnap.data();

      updateDoc(doc(database, 'chats', messageData?.['chatId']), {
        messages: arrayRemove(messageId),
      });
    });
  }

  removeMemberFromChat(memberId: string, chatId: string) {
    updateDoc(doc(database, 'users', memberId), {
      chats: arrayRemove(chatId),
    });
    updateDoc(doc(database, 'chats', chatId), {
      members: arrayRemove(memberId),
    });
  }

  async addMessage(body: string) {
    const messageToAdd = await addDoc(this.messagesCollectionReference, {
      body: body.trim(),
      senderId: this.appService.user.userId,
      createdAt: Date.now(),
    });

    await updateDoc(doc(database, 'chats', this.appService.currentChat.id), {
      messages: arrayUnion(messageToAdd.id),
    });
  }

  async addChatMember(userName: string, callBack: Function) {
    const q = query(
      this.usersCollectionReference,
      where('userName', '==', userName)
    );
    const response = await getDocs(q);

    response.forEach((user) => {
      const chatRef = doc(database, 'chats', this.appService.currentChat.id);
      updateDoc(chatRef, {
        members: arrayUnion(user.id),
      })
        .then(() => {
          updateDoc(user.ref, {
            chats: arrayUnion(this.appService.currentChat.id),
          }).then(() => {
            let newUSer = new User(user.id, userName, user.data()?.['name']);
            callBack(newUSer);
          });
        })
        .catch(() => {
          callBack(null);
        });
    });
  }

  private isChatAddedToUserChats(chatId: string) {
    return this.appService.user.chats.some((chat: Chat) => chat.id === chatId);
  }

  private isMessageAlreadyAddedToCurrentChatMessages(messageIdtoCheck: string) {
    const result = this.appService.currentChat.messages.some(
      (message) => message.id === messageIdtoCheck
    );
    return result;
  }
}
