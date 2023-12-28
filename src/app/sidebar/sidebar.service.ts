import {
  addDoc,
  collection,
  updateDoc,
  doc,
  arrayUnion,
} from 'firebase/firestore';
import { database } from '../database/connection';
import { Injectable } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Injectable()
export class SidebarService {
  private chatsRef = collection(database, 'chats');

  constructor(private appService: AppService, private router: Router) {}

  createNewChat(chatName: string, callback?: Function) {
    addDoc(this.chatsRef, {
      name: chatName,
      ownerId: this.appService.user.userId,
      messages: [],
    }).then((newChat) => {
      updateDoc(doc(database, 'users', this.appService.user.userId), {
        chats: arrayUnion(newChat.id),
      }).then(() => {
        this.appService.getUser((user: any) => {
          console.log(user);
          if (!user) this.router.navigate(['/login']);
          else {
            this.appService.user = user;
            if (callback) callback();
          }
        });
      });
    });
  }
}
