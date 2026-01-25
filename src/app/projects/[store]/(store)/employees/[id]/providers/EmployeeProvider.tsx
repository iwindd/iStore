"use client";

import { Prisma } from "@prisma/client";
import React, { createContext, useContext, useMemo } from "react";

type StoreEmployeeWithRelations = Prisma.EmployeeGetPayload<{
  include: {
    user: true;
    role: { include: { permissions: true } };
  };
}>;

interface EmployeeContextValue {
  employee: StoreEmployeeWithRelations;
  storeSlug: string;
}

const EmployeeContext = createContext<EmployeeContextValue | null>(null);

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployee must be used within EmployeeProvider");
  }
  return context;
};

interface EmployeeProviderProps {
  employee: StoreEmployeeWithRelations;
  storeSlug: string;
  children: React.ReactNode;
}

export const EmployeeProvider: React.FC<EmployeeProviderProps> = ({
  employee,
  storeSlug,
  children,
}) => {
  const value = useMemo(() => ({ employee, storeSlug }), [employee, storeSlug]);

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};
