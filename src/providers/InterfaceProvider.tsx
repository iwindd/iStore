"use client";
import { Backdrop, CircularProgress } from "@mui/material";
import { SnackbarProvider } from "notistack";
import React, { createContext, ReactNode, useContext } from "react";

interface BackdropInterface {
  setBackdrop: React.Dispatch<React.SetStateAction<boolean>>;
  isBackdrop: boolean;
}

interface InterfaceData extends BackdropInterface {}

const InterfaceContext = createContext<InterfaceData | undefined>(undefined);

export function useInterface() {
  const context = useContext(InterfaceContext);
  if (context === undefined) {
    throw new Error("useInterface must be used within a InterfaceProvider");
  }
  return context;
}

export function InterfaceProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [isBackdrop, setIsBackdrop] = React.useState<boolean>(false);

  /* TODO:: BACKDROP WILL REMOVE SOON */
  const memo = React.useMemo(
    () => ({
      setBackdrop: setIsBackdrop,
      isBackdrop: isBackdrop,
    }),
    [isBackdrop],
  );

  return (
    <InterfaceContext.Provider value={memo}>
      <SnackbarProvider
        maxSnack={2}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        autoHideDuration={3000}
      >
        {children}
      </SnackbarProvider>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </InterfaceContext.Provider>
  );
}

export default InterfaceContext;
