import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { database } from '../database/connection';
import { User } from '../user';

export class RegistrationService {
  private usersRef = collection(database, 'users');

  async getUser(userName: string, password: string) {
    try {
      const q = password
        ? query(
            this.usersRef,
            where('userName', '==', userName),
            where('password', '==', password)
          )
        : query(this.usersRef, where('userName', '==', userName));

      const response = await getDocs(q);
      const result: User[] = [];

      response.forEach((user) => {
        result.push(new User(user.id, userName, password));
      });

      return result;
    } catch (err: any) {
      console.log(err.message);
      return [];
    }
  }

  async createUser(name: string, userName: string, password: string) {
    await addDoc(this.usersRef, {
      name: name,
      userName: userName,
      password: password,
      chats: [],
    });
  }

  async userExists(userName: string, password: string = '') {
    const user = await this.getUser(userName, password);

    return user.length > 0 ? user[0] : null;
  }
}
