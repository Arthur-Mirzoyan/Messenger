import { Chat } from './chat';

export class User {
  constructor(
    public userId: string,
    public userName: string,
    private password: string,
    public chats: Chat[],
    public currentChat: Chat | null
  ) {}
}
