import { doc, getDoc } from 'firebase/firestore';
import { database } from './database/connection';
import { User } from './user';

export class Message {
  public sender!: User;
  constructor(
    public id: string,
    public body: string,
    public senderId: string,
    public createdAt: number
  ) {
    this.getSender();
  }

  async getSender() {
    const docRef = doc(database, 'users', this.senderId);
    const docSnap = await getDoc(docRef);
    const user = docSnap.data();

    if (user) {
      this.sender = new User(
        this.senderId,
        user['name'],
        user['surname'],
        user['username'],
        user['gender'],
        user['password'],
        user['chats']
      );
    }
  }
}
