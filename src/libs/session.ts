
import { authOptions } from '@/auth';
import { Session, getServerSession as getServerSessionInstance } from 'next-auth';
import { User } from './user';

export const getServerSession = async (): Promise<Session | null> => {
  return await getServerSessionInstance(authOptions)
}

export const getUser = async (): Promise<User | null> => {
  const session = await getServerSession();
  if (!session) return null;

  return new User(session);
}