"use client";
import { createContext, useContext } from "react";

export type BroadcastContextType = {
  id: number;
  event_id: number;
  title: string;
  message: string;
  image_url: string;
  scheduled_at: Date;
  status: string;
};

const BroadcastContext = createContext<BroadcastContextType | null>(null);

export const BroadcastProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: BroadcastContextType;
}) => {
  return (
    <BroadcastContext.Provider value={value}>
      {children}
    </BroadcastContext.Provider>
  );
};

export const useBroadcast = () => {
  const context = useContext(BroadcastContext);
  if (!context) {
    throw new Error("useBroadcast must be used within a BroadcastProvider");
  }
  return context;
};
