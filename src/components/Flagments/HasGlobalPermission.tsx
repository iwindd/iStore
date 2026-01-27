"use client";
import { usePermission } from "@/providers/PermissionProvider";

interface HasGlobalPermissionProps {
  children: React.ReactNode;
  permission: string | string[];
  some?: boolean;
}

const HasGlobalPermission = ({
  children,
  permission,
  some = false,
}: HasGlobalPermissionProps) => {
  if (Array.isArray(permission) && permission.length <= 0) {
    return children;
  }

  const { hasGlobalPermission } = usePermission();

  return hasGlobalPermission(permission, some) ? children : null;
};

export default HasGlobalPermission;
