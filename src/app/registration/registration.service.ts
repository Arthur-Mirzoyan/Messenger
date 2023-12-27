import { collection, query, where, getDocs } from 'firebase/firestore';
import { database } from '../database/connection';
import { User } from '../user';

export class RegistrationService {
  private usersRef = collection(database, 'users');

  async getUser(userName: string, password: string) {
    try {
      const q = query(
        this.usersRef,
        where('userName', '==', userName),
        where('password', '==', password)
      );

      const response = await getDocs(q);
      const result: User[] = [];

      response.forEach((user) => {
        result.push(new User(user.id, userName, password, []));
      });

      return result;
    } catch (err: any) {
      console.log(err.message);
      return [];
    }
  }
}
