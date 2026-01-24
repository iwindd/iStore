"use client";
import {
  SessionProvider as NextAuthSessionProvider,
  SessionProviderProps,
} from "next-auth/react";

const SessionProvider = (
  props: SessionProviderProps & {
    children: React.ReactNode;
  },
) => {
  return (
    <NextAuthSessionProvider {...props} refetchInterval={90}>
      {props.children}
    </NextAuthSessionProvider>
  );
};

export default SessionProvider;
