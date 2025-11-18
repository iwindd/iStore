import { auth } from "@/auth";
import { Session } from "next-auth";
import { User } from "./user";

/** @Deprecated use auth instead */
export const getServerSession = async (): Promise<Session | null> => {
  return auth();
};

export const getUser = async (): Promise<User | null> => {
  const session = await getServerSession();
  if (!session) return null;

  return new User(session);
};
