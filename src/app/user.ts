import { Chat } from './chat';

export class User {
  constructor(
    public id: string,
    public name: string,
    public surname: string,
    public username: string,
    public gender: string = '',
    private password: string = '',
    public chats: Chat[] = []
  ) {}
}
