"use client";

import { Prisma } from "@prisma/client";
import React, { createContext, useContext, useMemo } from "react";

type StoreRoleWithRelations = Prisma.StoreRoleGetPayload<{
  include: { permissions: true; creator: { include: { user: true } } };
}>;

interface RoleContextValue {
  role: StoreRoleWithRelations;
  storeSlug: string;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within RoleProvider");
  }
  return context;
};

interface RoleProviderProps {
  role: StoreRoleWithRelations;
  storeSlug: string;
  children: React.ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({
  role,
  storeSlug,
  children,
}) => {
  const value = useMemo(() => ({ role, storeSlug }), [role, storeSlug]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};
