import { TypographyVariantsOptions } from "@mui/material";
import { Sarabun } from "next/font/google";

const sarabun = Sarabun({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const typography = {
  fontFamily: sarabun.style.fontFamily,
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
} satisfies TypographyVariantsOptions;
