"use client";
import { User } from "@/libs/user";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

interface AuthHook {
  session: Session | null;
  user: User | null;

  setName: (name: string) => void;
}

export function useAuth(): AuthHook {
  const { data: session, update } = useSession();
  const user = session ? new User(session as Session) : null;

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
  };
}
