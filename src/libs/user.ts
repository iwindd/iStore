import { PermissionBit, PermissionEnum } from '@/enums/permission';
import { Session } from 'next-auth';
import { hasPermission, maskToPermissions } from './permission';

export class User{
  public session: Session;
  public store: number;

  constructor(session: Session) {
    this.session = session;
    this.store = +session?.user.store;
  }

  public permissions()  {
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
}