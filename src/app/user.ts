import { Chat } from './chat';

export class User {
  constructor(
    public userId: string,
    public userName: string,
    public name: string,
    private password: string = '',
    public chats: Chat[] = []
  ) {}
}
