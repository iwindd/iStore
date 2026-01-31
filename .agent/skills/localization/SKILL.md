---
name: localization
description: Best practices and rules for Internationalization using next-intl. Use this when adding new UI components or modifying text in the application.
---

# Internationalization Guide (next-intl)

## Core Principles

1. **No Hardcoded Strings**: NEVER hardcode user-facing text or strings in the UI. All text must be rendered using `next-intl`.
2. **Default Locale**: The project currently supports **Thai (th)** only. Treat `th` as the default and fallback locale.

## Implementation Strategy

### Client Components

- Use the `useTranslation` hook for client-side translations.
- **Pattern**:

  ```tsx
  "use client";
  import { useTranslation } from "next-intl";

  export default function MyComponent() {
    const t = useTranslation("HomePage"); // Specify namespace
    return <button>{t("submitButton")}</button>;
  }
  ```
