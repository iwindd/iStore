"use client";

import { TextField, TextFieldProps } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export type FormInputProps = TextFieldProps & {
  name: string;
};

export const FormInput = ({ name, helperText, ...props }: FormInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...props}
          error={!!error}
          // Assuming the error message is already localized from the schema
          helperText={error?.message || helperText}
        />
      )}
    />
  );
};
