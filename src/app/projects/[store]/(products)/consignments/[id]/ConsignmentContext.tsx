"use client";
import { ConsignmentDetail } from "@/actions/consignment/getConsignment";
import { createContext, useContext, useMemo } from "react";

type ConsignmentContextType = {
  consignment: ConsignmentDetail;
};

const ConsignmentContext = createContext<ConsignmentContextType | null>(null);

export const ConsignmentProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ConsignmentDetail;
}) => {
  const ctxValue = useMemo(() => ({ consignment: value }), [value]);

  return (
    <ConsignmentContext.Provider value={ctxValue}>
      {children}
    </ConsignmentContext.Provider>
  );
};

export const useConsignment = () => {
  const ctx = useContext(ConsignmentContext);
  if (!ctx)
    throw new Error("useConsignment must be used inside ConsignmentProvider");
  return ctx;
};
