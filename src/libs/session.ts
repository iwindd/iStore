import { auth } from "@/auth";
import { Session } from "next-auth";
import { headers } from "next/headers";
import { User } from "./user";

/** @Deprecated use auth instead */
export const getServerSession = async (): Promise<Session | null> => {
  return auth();
};

export const getStoreId = async (): Promise<number | null> => {
  const headersList = await headers();
  const storeIdHeader = headersList.get("x-store-id");
  const storeId = storeIdHeader ? Number(storeIdHeader) : null;
  return storeId && !Number.isNaN(storeId) ? storeId : null;
};

export const getUser = async (): Promise<User | null> => {
  const session = await getServerSession();
  if (!session) return null;

  const storeId = await getStoreId();
  if (storeId) {
    (session.user as unknown as { store?: number }).store = storeId;
  }

  return new User(session);
};
