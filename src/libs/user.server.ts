import { Session } from "next-auth";

export type UserServerPayload = Session;

export class UserServer {
  public payload: UserServerPayload;

  constructor(payload: UserServerPayload) {
    this.payload = payload;
  }

  get id() {
    return +this.payload?.user.id || 0;
  }
}
