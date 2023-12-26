import {
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
  doc,
  getDoc,
} from 'firebase/firestore';
import { database } from '../database/connection';
import { User } from '../user';

export class HomeService {
  private messagesRef = collection(database, 'messages');
  private userId: string | null = localStorage.getItem('userId');

  async writeUserData(body: string) {
    await addDoc(this.messagesRef, {
      body: body,
      senderId: this.userId,
      createdAt: Date.now(),
    });
  }

  onChange(callback: Function) {
    const q = query(this.messagesRef, orderBy('createdAt', 'desc'));
    onSnapshot(q, (docs) => {
      let response: Object[] = [];
      docs.forEach((doc) => response.push(doc.data()));
      callback(response);
    });
  }

  async getUser() {
    if (this.userId) {
      const docRef = doc(database, 'users', this.userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let user = docSnap.data();
        return new User(user['userName'], user['password'], this.userId);
      }
      else return null;
    }
    return null;
  }
}
