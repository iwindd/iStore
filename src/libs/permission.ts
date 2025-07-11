import { PermissionBit, GroupedPermissionBit } from "@/config/Permission";
import { PermissionEnum, ProductPermissionEnum, SuperPermissionEnum } from "@/enums/permission";

export const extractPermissionGroups = (permissions: PermissionEnum[]) => {
  const result: PermissionEnum[] = [];

  permissions.map((permission) => {
    if (GroupedPermissionBit[permission]) {
      result.push(...(GroupedPermissionBit[permission] as PermissionEnum[]));
    }else{
      result.push(permission);
    }
  });

  return result.filter(p =>  GroupedPermissionBit[p] === undefined && PermissionBit[p as keyof typeof PermissionBit] !== undefined);
}

export const getPermissionsWithGroups = (permissions: PermissionEnum[]): PermissionEnum[] => {
  const keyOfGroups = Object.keys(GroupedPermissionBit) as SuperPermissionEnum[];
  const hasGroups : PermissionEnum[] = [];

  keyOfGroups.map((group) => {
    const groupPermissions = GroupedPermissionBit[group] as PermissionEnum[];
    if (groupPermissions.every(p => permissions.includes(p))) {
      hasGroups.push(group);
    }
  })

  return [...permissions.filter(p => !GroupedPermissionBit[p]), ...hasGroups];
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
  console.warn("Converting permissions to mask:", permissions);
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
