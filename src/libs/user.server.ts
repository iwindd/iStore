import { PermissionEnum } from "@/enums/permission";
import { Session } from "next-auth";

export type UserServerPayload = Session & {
  store?: {
    id: string;
    employee_id: number;
  };
};

export class UserServer {
  public payload: UserServerPayload;

  constructor(payload: UserServerPayload) {
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

  /**
   * @description limit permission
   * @param permission
   * @param returnValue
   * @returns
   */
  public limitPermission<T = any>(
    permission: PermissionEnum,
    returnValue?: T,
  ): T | number | undefined {
    if (!this.hasPermission(permission)) {
      if (returnValue) return returnValue;
      return this.employeeId;
    }

    return undefined;
  }

  public hasPermission(permission: PermissionEnum): boolean {
    return false;
  }
}
