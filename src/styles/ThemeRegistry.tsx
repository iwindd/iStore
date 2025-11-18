"use client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import * as React from "react";
import { createTheme } from "./theme";
import NextAppDirEmotionCacheProvider from "./theme/modules/EmotionCache";

export default function ThemeRegistry({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = createTheme();

  return (
    <NextAppDirEmotionCacheProvider options={{ key: "istore" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
