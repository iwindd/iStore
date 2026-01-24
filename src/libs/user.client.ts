import { PermissionEnum } from "@/enums/permission";
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

  get store() {
    return this.payload?.store?.id;
  }

  get userStoreId() {
    return this.payload?.store?.employee_id;
  }

  get employeeId() {
    return this.userStoreId;
  }

  get displayName() {
    return this.payload?.user.name || "";
  }

  get email() {
    return this.payload?.user.email || "";
  }

  public limitPermission<T = number>(
    permission: PermissionEnum,
    returnValue?: T,
  ) {
    if (!this.hasPermission(permission)) {
      return returnValue ?? this.employeeId;
    }

    return undefined;
  }

  public hasPermission(permission: PermissionEnum): boolean {
    return false;
  }

  public hasSomePermissions(...permissions: PermissionEnum[]): boolean {
    return false;
  }
}
