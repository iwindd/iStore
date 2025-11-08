import { PermissionEnum } from "@/enums/permission";
import { Session } from "next-auth";
import { getRawPermissions } from "./permission";

export class User {
  public session: Session;

  constructor(session: Session) {
    this.session = session;
  }

  get id() {
    return +this.session?.user.id || 0;
  }

  get permissions() {
    return getRawPermissions(this.session?.user.permissions || []);
  }

  get store() {
    return this.session?.user.store;
  }

  get userStoreId() {
    return this.session?.user.userStoreId;
  }

  get displayName() {
    return this.session?.user.name || "";
  }

  get email() {
    return this.session?.user.email || "";
  }

  public onPermission<T = number>(permission: PermissionEnum, returnValue?: T) {
    if (this.hasPermission(permission)) {
      return returnValue || this.userStoreId;
    }

    return undefined;
  }

  public limitPermission<T = number>(
    permission: PermissionEnum,
    returnValue?: T
  ) {
    if (!this.hasPermission(permission)) {
      return returnValue || this.userStoreId;
    }
    return undefined;
  }

  public hasPermission(permission: PermissionEnum): boolean {
    return this.permissions.includes(permission);
  }

  public hasSomePermissions(...permissions: PermissionEnum[]): boolean {
    return permissions.some((permission) =>
      this.permissions.includes(permission)
    );
  }
}
