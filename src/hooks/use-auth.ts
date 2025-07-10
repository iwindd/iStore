'use client';
import { User } from "@/libs/user";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

interface AuthHook {
  session: Session | null;
  user: User | null;
}

export function useAuth(): AuthHook {
  const {data : session} = useSession();
  const user = session ? (new User(session as Session)) : null;

  return {
    session: session,
    user: user,
  }
}
