import { PermissionBit, GroupedPermissionBit } from "@/config/Permission";
import { PermissionEnum, SuperPermissionEnum } from "@/enums/permission";

export const extractPermissionGroups = (permissions: PermissionEnum[]) => {
  const result: PermissionEnum[] = [];

  permissions.map((permission) => {
    if (GroupedPermissionBit[permission]) {
      result.push(...(GroupedPermissionBit[permission] as PermissionEnum[]));
    }
  });

  return result.filter(p => p != SuperPermissionEnum.ALL);
}

export const maskToPermissions = (mask: bigint): PermissionEnum[] => {
  const permissions = Object.entries(PermissionBit)
    .filter(([, bit]) => {
      return (mask & BigInt(bit)) !== BigInt(0);
    })
    .map(([name]) => name) as PermissionEnum[];

  return permissions;
};

export const permissionsToMask = (permissions: PermissionEnum[]): bigint => {
  permissions = extractPermissionGroups(permissions);
  return permissions.reduce((mask, permission) => {
    const bit = PermissionBit[permission as keyof typeof PermissionBit];
    if (bit !== undefined) {
      return mask | BigInt(bit);
    }
    return mask;
  }, 0n);
};

export const hasPermission = (mask: bigint, permission: PermissionEnum): boolean => {
  const bit = PermissionBit[permission as keyof typeof PermissionBit];
  if (bit === undefined) {
    return false;
  }
  return (mask & BigInt(bit)) !== 0n;
};
