export class Message {
  constructor(
    public id: string,
    public body: string,
    public senderId: string,
    public createdAt: number
  ) {}
}
