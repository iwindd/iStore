"use client";
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
import { debounce } from "@mui/material/utils";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import React, { useEffect } from "react";

export interface BaseSelectorProps<T> {
  onSubmit(item: T | null): void;
  fetchItem(id: number): Promise<T | null>;
  searchItems(query: string): Promise<readonly T[]>;
  getItemLabel(item: T | string): string;
  getItemKey(item: T): string | number;
  renderCustomOption?: (item: T) => React.ReactNode;
  label: string;
  placeholder?: string;
  id: string;
  noOptionsText?: string;
  defaultValue?: number;
  fieldProps?: TextFieldProps;
  error?: boolean;
  helperText?: string;
  canCreate?: boolean;
  onCreate?: (label: string) => Promise<T | null>;
}

const BaseSelector = <T,>(props: BaseSelectorProps<T>) => {
  const [value, setValue] = React.useState<T | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<readonly T[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { isBackdrop } = useInterface();

  useEffect(() => {
    if (props.defaultValue && props.defaultValue > 0) {
      setIsLoading(true);
      props
        .fetchItem(props.defaultValue)
        .then((resp) => {
          if (resp) {
            setValue(resp);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [props.defaultValue, props.fetchItem]);

  const fetch = React.useMemo(
    () =>
      debounce(
        (
          request: { input: string },
          callback: (results?: readonly T[]) => void
        ) => {
          props
            .searchItems(request.input)
            .then((resp) => {
              callback(resp);
            })
            .catch(() => {
              callback();
            });
        },
        400
      ),
    [props.searchItems]
  );

  React.useEffect(() => {
    let active = true;

    fetch({ input: inputValue }, (results?: readonly T[]) => {
      if (active) {
        let newOptions: readonly T[] = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        // delete duplicates
        // Note: This relies on getItemKey returning a unique identifier
        const seen = new Set();
        newOptions = newOptions.filter((option) => {
          const key = props.getItemKey(option);
          const duplicate = seen.has(key);
          seen.add(key);
          return !duplicate;
        });

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch, props.getItemKey]);

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
      disabled={isLoading}
      filterOptions={(options, params) => {
        const filtered = createFilterOptions<T>()(options, params);

        const { inputValue } = params;
        const exists = options.some(
          (option) => props.getItemLabel(option) === inputValue
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
      noOptionsText={props.noOptionsText || "ไม่พบข้อมูล"}
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
                props.onSubmit(createdItem);
              }
            });
          }
        } else {
          setOptions(newValue ? [newValue, ...options] : options);
          setValue(newValue);
          props.onSubmit(newValue);
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
            isLoading
              ? "กรุณารอสักครู่"
              : props.placeholder || `ค้นหา${props.label}`
          }
          error={props.error}
          helperText={props.helperText}
          onKeyDown={handleKeyDown}
          slotProps={{
            input: isLoading
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

        if (option._is_create_option) {
          return (
            <li key={key} {...optionProps}>
              <Grid container sx={{ alignItems: "center", width: "100%" }}>
                <Typography color="primary">
                  สร้าง "{option._create_label}" ใหม่
                </Typography>
              </Grid>
            </li>
          );
        }

        const label = props.getItemLabel(option);
        const parts = parse(label, match(label, inputValue));

        return (
          <li key={key} {...optionProps}>
            <Grid container sx={{ alignItems: "center", width: "100%" }}>
              <Grid sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}>
                {parts.map((part, index) => (
                  <Box
                    key={index}
                    component="span"
                    sx={{ fontWeight: part.highlight ? "bold" : "regular" }}
                  >
                    {part.text}
                  </Box>
                ))}
                {props.renderCustomOption && (
                  <Typography variant="body2" color="text.secondary">
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
