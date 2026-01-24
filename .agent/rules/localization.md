---
trigger: always_on
---

# Project Constraints: Next.js & next-intl

## 1. Internationalization (Strict)

- **Rule**: NEVER hardcode user-facing text or strings in the UI. All text must be rendered using `next-intl`.
- **Locale**: The project currently supports **Thai (th)** only. Treat `th` as the default and fallback locale.

## 2. Implementation Strategy

### Client Components

- Use the `useTranslation` hook.
- Pattern:

  ```tsx
  "use client";
  import { useTranslation } from "next-intl";

  export default function MyComponent() {
    const t = useTranslation("HomePage"); // Specify namespace
    return <button>{t("submitButton")}</button>;
  }
  ```
