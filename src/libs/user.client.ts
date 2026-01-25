import { Session } from "next-auth";

type UserClientPayload = Session & {
  store?: {
    id: string;
    employee_id: number;
  };
};

export class UserClient {
  public payload: UserClientPayload;

  constructor(payload: UserClientPayload) {
    this.payload = payload;
  }

  get id() {
    return +this.payload?.user.id || 0;
  }

  get displayName() {
    return this.payload?.user.name || "";
  }

  get firstName() {
    return this.payload?.user.first_name || "";
  }

  get lastName() {
    return this.payload?.user.last_name || "";
  }

  get email() {
    return this.payload?.user.email || "";
  }
}
