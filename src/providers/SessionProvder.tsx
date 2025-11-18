"use client";
import {
  SessionProvider as NextAuthSessionProvider,
  SessionProviderProps,
} from "next-auth/react";

const SessionProvider = (
  props: SessionProviderProps & {
    children: React.ReactNode;
  }
) => {
  return (
    <NextAuthSessionProvider {...props}>
      {props.children}
    </NextAuthSessionProvider>
  );
};

export default SessionProvider;
