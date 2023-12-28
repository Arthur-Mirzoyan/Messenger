import { Message } from './message';

export class Chat {
  constructor(
    public id: string,
    public name: string,
    public ownerId: string,
    public messages: Message[]
  ) {}
}
