import { Message } from './message';
import { User } from './user';

export class Chat {
  constructor(
    public id: string,
    public name: string,
    public ownerId: string,
    public memberIds: string[] = [],
    public messages: Message[] = [],
    private members: User[] = []
  ) {}

  addUser(user: User) {
    this.members.push(user);
  }

  get getMembers(): User[] {
    return this.members;
  }
}
