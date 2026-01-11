"use client";
import { Prisma } from "@prisma/client";
import { createContext, useContext, useMemo, useState } from "react";

export type LineApplicationLayoutValue = Prisma.LineApplicationGetPayload<{}>;

type LineApplicationContextType = {
  application: LineApplicationLayoutValue;
  updateApplication: (data: Partial<LineApplicationLayoutValue>) => void;
};

const LineApplicationContext = createContext<LineApplicationContextType | null>(
  null
);

export const LineApplicationProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: LineApplicationLayoutValue;
}) => {
  const [application, setApplication] =
    useState<LineApplicationLayoutValue>(value);

  const updateApplication = (data: Partial<LineApplicationLayoutValue>) => {
    setApplication({ ...application, ...data });
  };

  const ctxValue = useMemo(
    () => ({ application, updateApplication }),
    [application]
  );

  return (
    <LineApplicationContext.Provider value={ctxValue}>
      {children}
    </LineApplicationContext.Provider>
  );
};

export const useApplication = () => {
  const ctx = useContext(LineApplicationContext);
  if (!ctx)
    throw new Error(
      "useApplication must be used inside LineApplicationProvider"
    );
  return ctx;
};
