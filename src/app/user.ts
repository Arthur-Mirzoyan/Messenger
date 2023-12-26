export class User {
  constructor(
    public userName: string,
    private password: string,
    private userId: string
  ) {}

  get id() {
    return this.userId;
  }
}
