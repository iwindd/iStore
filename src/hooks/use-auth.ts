"use client";
import { UserClient } from "@/libs/user.client";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

interface AuthHook {
  session: Session | null;
  user: UserClient | null;

  setName: (firstname: string, lastname: string) => void;
}

export function useAuth(): AuthHook {
  const { data: session, update } = useSession();
  const user = session ? new UserClient(session) : null;

  const setName = (firstname: string, lastname: string) => {
    if (!session || !user) return;
    update({
      ...session,
      user: {
        ...session.user,
        first_name: firstname,
        last_name: lastname,
        name: `${firstname} ${lastname}`,
      },
    });
  };

  return {
    session: session,
    user: user,
    setName: setName,
  };
}
