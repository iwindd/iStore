"use client";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { useInterface } from "@/providers/InterfaceProvider";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { useQuery } from "@tanstack/react-query";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";

export interface BaseSelectorProps<T> {
  label?: string;
  placeholder?: string;
  noOptionsText?: string;
  fieldProps?: Omit<
    TextFieldProps,
    | "label"
    | "fullWidth"
    | "placeholder"
    | "error"
    | "helperText"
    | "onKeyDown"
    | "slotProps"
  >;
  defaultValue?: number;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  canCreate?: boolean;
  onSubmit?: (Product: T | null) => void;
}

export interface BuildSelectorProps<T> extends BaseSelectorProps<T> {
  id: string;
  fetchItem(id: number): Promise<T | null>;
  searchItems(query: string): Promise<readonly T[]>;
  getItemLabel(item: T | string): string;
  getItemKey(item: T): string | number;
  renderCustomOption?: (item: T) => React.ReactNode;
  onCreate?: (label: string) => Promise<T | null>;
}

const BaseSelector = <T,>(props: BuildSelectorProps<T>) => {
  const t = useTranslations("COMPONENTS.selector");
  const [value, setValue] = React.useState<T | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<readonly T[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { isBackdrop } = useInterface();
  const debouncedInput = useDebouncedValue(inputValue, 400);

  const { data: defaultItem, isLoading: defaultItemLoading } = useQuery({
    queryKey: [`${props.id}-fetch-item`, props.defaultValue],
    queryFn: () => props.fetchItem(props.defaultValue!),
    enabled: !!props.defaultValue || props.defaultValue == 0,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  useEffect(() => {
    if (defaultItem) {
      setValue(defaultItem);
    }
  }, [defaultItem, defaultItemLoading]);

  const { data: results } = useQuery({
    queryKey: [`${props.id}-search-items`, debouncedInput],
    queryFn: () => props.searchItems(debouncedInput),
    enabled: !props.disabled,
  });

  React.useEffect(() => {
    setOptions((prev) => {
      let newOptions: readonly T[] = [];

      if (value) {
        newOptions = [value];
      }

      if (results) {
        newOptions = [...newOptions, ...prev, ...results];
      }

      // delete duplicates
      const seen = new Set<string | number>();
      newOptions = newOptions.filter((option) => {
        const key = props.getItemKey(option);
        const duplicate = seen.has(key);
        seen.add(key);
        return !duplicate;
      });
      return newOptions;
    });
  }, [value, results, props.getItemKey]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && inputValue) {
      event.preventDefault();
    }
  };

  return (
    <Autocomplete
      id={props.id}
      sx={{ width: "100%" }}
      getOptionLabel={(option) => {
        if (option._is_create_option) {
          return option._create_label;
        }
        return props.getItemLabel(option);
      }}
      disabled={isLoading || defaultItemLoading || props.disabled}
      filterOptions={(options, params) => {
        const filtered = createFilterOptions<T>()(options, params);

        const { inputValue } = params;
        const exists = options.some(
          (option) => props.getItemLabel(option) === inputValue,
        );

        if (inputValue !== "" && !exists && props.canCreate) {
          // Add a temporary option for creation
          // We need to cast it to T to satisfy the type system,
          // but we'll handle it specially in onChange
          filtered.push({
            _create_label: inputValue,
            _is_create_option: true,
          } as any);
        }

        return filtered;
      }}
      options={options}
      autoComplete
      filterSelectedOptions
      value={value}
      noOptionsText={props.noOptionsText || t("no_options")}
      readOnly={isBackdrop}
      onChange={(_: any, newValue: any | null) => {
        if (newValue?._is_create_option) {
          if (props.onCreate) {
            setIsLoading(true);
            props.onCreate(newValue._create_label).then((createdItem) => {
              setIsLoading(false);
              if (createdItem) {
                setOptions([createdItem, ...options]);
                setValue(createdItem);
                props?.onSubmit?.(createdItem);
              }
            });
          }
        } else {
          setOptions(newValue ? [newValue, ...options] : options);
          setValue(newValue);
          props?.onSubmit?.(newValue);
        }
      }}
      onInputChange={(_, newInputValue, reason) => {
        if (reason === "input") {
          setInputValue(newInputValue);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          {...props.fieldProps}
          label={props.label}
          fullWidth
          placeholder={
            isLoading || defaultItemLoading
              ? t("searching")
              : props.placeholder || `${t("search")}${props.label}`
          }
          error={props.error}
          helperText={props.helperText}
          onKeyDown={handleKeyDown}
          slotProps={{
            input:
              isLoading || defaultItemLoading
                ? {
                    startAdornment: (
                      <InputAdornment position="end" sx={{ mr: 1 }}>
                        <CircularProgress size={20} />
                      </InputAdornment>
                    ),
                  }
                : { ...params.InputProps },
          }}
        />
      )}
      renderOption={(props_, option: any) => {
        const { key, ...optionProps } = props_;
        const itemKey = option._is_create_option
          ? `create-${option._create_label}`
          : props.getItemKey(option);

        if (option._is_create_option) {
          return (
            <li key={itemKey} {...optionProps}>
              <Grid container sx={{ alignItems: "center", width: "100%" }}>
                <Typography color="primary">
                  {t("create_new", { label: option._create_label })}
                </Typography>
              </Grid>
            </li>
          );
        }

        const label = props.getItemLabel(option);
        const parts = parse(label, match(label, inputValue));
        return (
          <li key={itemKey} {...optionProps}>
            <Grid container sx={{ alignItems: "center", width: "100%" }}>
              <Grid sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}>
                {parts.map((part, index) => (
                  <Box
                    key={`${itemKey}-${index}`}
                    component="span"
                    sx={{ fontWeight: part.highlight ? "bold" : "regular" }}
                  >
                    {part.text}
                  </Box>
                ))}
                {props.renderCustomOption && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="div"
                  >
                    {props.renderCustomOption(option)}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};

export default BaseSelector;
