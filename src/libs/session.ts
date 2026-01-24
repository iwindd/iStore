import { auth } from "@/auth";
import { Session } from "next-auth";
import { UserServer, UserServerPayload } from "./user.server";

/** @Deprecated use auth instead */
export const getServerSession = async (): Promise<Session | null> => {
  return auth();
};

export const getUser = async (): Promise<UserServer | null> => {
  const session = await getServerSession();
  if (!session) return null;

  const payload: UserServerPayload = {
    ...session,
  };

  return new UserServer(payload);
};
