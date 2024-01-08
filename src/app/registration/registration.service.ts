import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { database } from '../database/connection';
import { User } from '../user';

export class RegistrationService {
  private usersRef = collection(database, 'users');

  async getUser(username: string, password: string) {
    try {
      const q = password
        ? query(
            this.usersRef,
            where('username', '==', username),
            where('password', '==', password)
          )
        : query(this.usersRef, where('username', '==', username));

      const response = await getDocs(q);
      const result: User[] = [];

      response.forEach((userSnap) => {
        const userData = userSnap.data();
        result.push(
          new User(
            userSnap.id,
            userData?.['name'],
            userData?.['surname'],
            userData?.['username'],
            userData?.['gender'],
            password
          )
        );
      });

      return result;
    } catch (err: any) {
      console.log(err.message);
      return [];
    }
  }

  async createUser(
    name: string,
    surname: string,
    gender: string,
    username: string,
    password: string
  ) {
    await addDoc(this.usersRef, {
      name: name,
      surname: surname,
      gender: gender,
      username: username,
      password: password,
      chats: [],
    });
  }

  async userExists(username: string, password: string = '') {
    const user = await this.getUser(username, password);

    return user.length > 0 ? user[0] : null;
  }
}
