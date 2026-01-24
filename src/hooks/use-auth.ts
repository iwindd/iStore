"use client";
import { UserClient } from "@/libs/user.client";
import { usePermission } from "@/providers/PermissionProvider";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

interface AuthHook {
  session: Session | null;
  user: UserClient | null;

  setName: (name: string) => void;
  globalPermissions: { id: number; name: string }[];
  isGlobalPermissionLoading: boolean;
  storePermissions: { id: number; name: string }[];
  isStorePermissionLoading: boolean;
}

export function useAuth(): AuthHook {
  const { data: session, update } = useSession();
  const permission = usePermission();
  const user = session ? new UserClient(session) : null;

  const setName = (name: string) => {
    if (!session || !user) return;
    update({
      ...session,
      user: {
        ...session.user,
        name: name,
      },
    });
  };

  return {
    session: session,
    user: user,
    setName: setName,
    ...permission,
  };
}
