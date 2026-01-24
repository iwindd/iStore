"use client";
import { usePermission } from "@/providers/PermissionProvider";

interface HasStorePermissionProps {
  children: React.ReactNode;
  permission: string | string[];
  some?: boolean;
}

const HasStorePermission = ({
  children,
  permission,
  some = false,
}: HasStorePermissionProps) => {
  const { hasStorePermission } = usePermission();

  return hasStorePermission(permission, some) ? children : null;
};

export default HasStorePermission;
