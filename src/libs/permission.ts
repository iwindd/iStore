import { PermissionBit, PermissionEnum } from "@/enums/permission";

export const maskToPermissions = (mask: bigint): PermissionEnum[] => {
  return Object.entries(PermissionBit)
    .filter(([, bit]) => {
      return mask && Number(bit) !== 0;
    })
    .map(([name]) => name) as PermissionEnum[];
};

export const permissionsToMask = (permissions: PermissionEnum[]): bigint => {
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
