import {
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { database } from '../database/connection';
import { Injectable } from '@angular/core';

@Injectable()
export class ChatService {
  private messagesRef = collection(database, 'messages');

  async writeUserData(senderId: string, body: string) {
    await addDoc(this.messagesRef, {
      body: body,
      senderId: senderId,
      createdAt: Date.now(),
    });
  }

  onChange(callback: Function) {
    const q = query(this.messagesRef, orderBy('createdAt'));
    onSnapshot(q, (docs) => {
      let response: Object[] = [];
      docs.forEach((doc) => response.push(doc.data()));
      callback(response);
    });
  }
}
