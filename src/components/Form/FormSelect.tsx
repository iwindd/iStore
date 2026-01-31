"use client";

import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export type FormSelectProps = SelectProps & {
  name: string;
  label: string;
  options: { label: string; value: string | number }[];
  helperText?: string;
  fullWidth?: boolean; // explicit prop for better TS support, though SelectProps has it
};

export const FormSelect = ({
  name,
  label,
  options,
  helperText,
  fullWidth = true,
  margin = "dense",
  ...props
}: FormSelectProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth={fullWidth} error={!!error} margin={margin}>
          <InputLabel id={`${name}-label`}>{label}</InputLabel>
          <Select {...field} labelId={`${name}-label`} label={label} {...props}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {(error?.message || helperText) && (
            <FormHelperText>{error?.message || helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};
