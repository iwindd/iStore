---
name: form-best-practices
description: Best practices for implementing forms using Zod, React Hook Form, and Material UI. Contains the specification for the localized, reusable Form components.
---

# Form Implementation Guidelines

## Overview

This project uses **React Hook Form** for form state management, **Zod** for schema validation, and **Material UI (MUI)** for the user interface.

We have established a reusable set of form components in `src/components/Form` to standardize the implementation and boilerplate reduction.

## Core Rules

1.  **Schema Validation**: Always define a Zod schema for your form.
2.  **Type Safety**: Infer Types directly from the Zod schema (`z.infer`).
3.  **Localization**:
    - Use `next-intl` (`useTranslations`) for labels and placeholders.
    - For validation messages, either use translation codes (e.g., `required_field`) and translate them in the component, or pass the `t` function to your schema creator.
4.  **Components**: Use the reusable wrappers (`Form`, `FormInput`, `FormSelect`) located in `src/components/Form`.

## Usage Pattern

### 1. Define Schema

Create a schema file (e.g., `schema.ts`) or define it in your component file (if unique).

```typescript
import { z } from "zod";

// Example of schema creator to inject translations
export const createSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t("invalid_email")),
    password: z.string().min(8, t("password_min_length")),
    role: z.enum(["USER", "ADMIN"], {
      errorMap: () => ({ message: t("required_role") }),
    }),
  });

export type FormData = z.infer<ReturnType<typeof createSchema>>;
```

### 2. Implement Component

Use the `Form` wrapper and input components.

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Form, FormInput, FormSelect } from "@/components/Form"; // Uses implicit index
import { createSchema, FormData } from "./schema";
import { Button } from "@mui/material";

export default function RegisterForm() {
  const t = useTranslations("RegisterForm");
  const schema = createSchema(t);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      role: "USER",
    },
  });

  const onSubmit = async (data: FormData) => {
    // Call Server Action
    console.log(data);
  };

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <FormInput name="email" label={t("email")} />

      <FormInput name="password" label={t("password")} type="password" />

      <FormSelect
        name="role"
        label={t("role")}
        options={[
          { label: t("user"), value: "USER" },
          { label: t("admin"), value: "ADMIN" },
        ]}
      />

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {t("submit")}
      </Button>
    </Form>
  );
}
```

## Available Components

Located in `src/components/Form`:

- **`Form`**: The provider and container. Accepts `form` (from `useForm`) and `onSubmit`. Wrapper around MUI `<Box component="form">`.
- **`FormInput`**: Wrapper for `TextField`. Handles error messages automatically.
- **`FormSelect`**: Wrapper for `Select` with `FormControl` and `InputLabel`.

## Best Practices

- **Server Actions**: Call server actions inside `onSubmit`. Wrap them with `try/catch` and use `form.setError` for server-side validation errors.
- **Reset**: Use `form.reset()` after successful submission if needed.
- **Validation**: Validation should run on standard events (onChange/onBlur) provided by default in `react-hook-form`.
