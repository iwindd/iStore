import { getPermissionInGroup, MAPPING_PERMISSION } from "@/config/Permission";
import { PermissionEnum, SuperPermissionEnum } from "@/enums/permission";

export const getRawPermissions = (
  permissions: PermissionEnum[]
): PermissionEnum[] => {
  const hasGroups = permissions.filter((p) =>
    Object.keys(MAPPING_PERMISSION).includes(p as SuperPermissionEnum)
  ) as SuperPermissionEnum[];
  const rawPermissions: PermissionEnum[] = [...hasGroups];

  hasGroups.map((group) => {
    rawPermissions.push(...getPermissionInGroup(group));
  });

  return rawPermissions;
};
