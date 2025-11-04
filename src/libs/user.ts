import { PermissionBit } from "@/config/Permission";
import { PermissionEnum } from "@/enums/permission";
import { Session } from "next-auth";
import { hasPermission, maskToPermissions } from "./permission";

export class User {
  public session: Session;

  public id: number;
  public store: string;
  public userStoreId: number;

  public email: string;
  public displayName: string;

  constructor(session: Session) {
    this.session = session;
    this.store = session?.user.store;
    this.id = +session?.user.id || 0;
    this.userStoreId = +session?.user.userStoreId || 0;
    this.displayName = session?.user.name || "";
    this.email = session?.user.email || "";
  }

  public permissions() {
    const permission = this.session?.user.permission;
    if (!permission) return [];
    const mask = BigInt(permission);

    return maskToPermissions(mask);
  }

  public hasPermission(permission: keyof typeof PermissionBit): boolean {
    if (!this.session?.user.permission) return false;
    const mask = BigInt(this.session?.user.permission || 0);
    return hasPermission(mask, permission as PermissionEnum);
  }

  public hasSomePermissions(
    permissions: (keyof typeof PermissionBit)[]
  ): boolean {
    if (!this.session?.user.permission) return false;
    const mask = BigInt(this.session?.user.permission || 0);
    return permissions.some((permission) =>
      hasPermission(mask, permission as PermissionEnum)
    );
  }
}
