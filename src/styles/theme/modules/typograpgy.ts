import { TypographyVariantsOptions } from "@mui/material";
import { Bai_Jamjuree, Barlow } from "next/font/google";

const barlow = Barlow({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow",
});

const jamjuree = Bai_Jamjuree({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jamjuree",
});

declare module "@mui/material/styles" {
  interface TypographyVariants {
    sidebarCollapsed: React.CSSProperties;
  }

  // allow configuration using `createTheme()`
  interface TypographyVariantsOptions {
    sidebarCollapsed?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    sidebarCollapsed: true;
  }
}

export const typography = {
  fontFamily: `${barlow.style.fontFamily}, ${jamjuree.style.fontFamily}, sans-serif`,
  body1: { fontSize: "1rem", fontWeight: 400 },
  body2: { fontSize: "0.875rem", fontWeight: 400 },
  button: { fontWeight: 500 },
  caption: { fontSize: "0.75rem", fontWeight: 400 },
  subtitle1: { fontSize: "1rem", fontWeight: 500 },
  subtitle2: { fontSize: "0.875rem", fontWeight: 500 },
  overline: {
    fontSize: "0.75rem",
    fontWeight: 500,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  h1: { fontSize: "3.5rem", fontWeight: 500 },
  h2: { fontSize: "3rem", fontWeight: 500 },
  h3: { fontSize: "2.25rem", fontWeight: 500 },
  h4: { fontSize: "2rem", fontWeight: 500 },
  h5: { fontSize: "1.5rem", fontWeight: 500 },
  h6: { fontSize: "1.125rem", fontWeight: 500 },
  sidebarCollapsed: {
    fontSize: "0.625rem",
    fontWeight: 500,
    lineHeight: "16px",
  },
} satisfies TypographyVariantsOptions;
