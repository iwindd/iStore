"use client";
import { useAuth } from "@/hooks/use-auth";

interface HasGlobalPermissionProps {
  children: React.ReactNode;
  permission: string | string[];
  skeleton?: React.ReactNode;
  some?: boolean;
}

const HasGlobalPermission = ({
  children,
  permission,
  skeleton,
  some = false,
}: HasGlobalPermissionProps) => {
  const { globalPermissions, isGlobalPermissionLoading } = useAuth();
  const hasPermission =
    typeof permission === "string"
      ? globalPermissions.some((p) => p.name === permission)
      : some
        ? globalPermissions.some((p) => permission.includes(p.name))
        : globalPermissions.every((p) => permission.includes(p.name));

  if (isGlobalPermissionLoading) {
    return skeleton || null;
  }

  return hasPermission ? children : null;
};

export default HasGlobalPermission;
