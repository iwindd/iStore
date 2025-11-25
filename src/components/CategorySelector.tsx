"use client";
import findCategory from "@/actions/category/find";
import SearchCategories, { SearchCategory } from "@/actions/category/search";
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
import { debounce } from "@mui/material/utils";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import React, { useEffect } from "react";

interface SelectorProps {
  onSubmit(Product: SearchCategory | null): void;
  fieldProps?: TextFieldProps;
  defaultValue?: number;
}

const CategorySelector = (props: SelectorProps) => {
  const [value, setValue] = React.useState<SearchCategory | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<readonly SearchCategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { isBackdrop } = useInterface();

  useEffect(() => {
    if (props.defaultValue && props.defaultValue > 0) {
      setIsLoading(true);
      findCategory(props.defaultValue)
        .then((resp) => {
          if (resp.success && resp.data) {
            setValue(resp.data);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [props.defaultValue]);

  const fetch = React.useMemo(
    () =>
      debounce(
        (
          request: { input: string },
          callback: (results?: readonly SearchCategory[]) => void
        ) => {
          SearchCategories(request.input)
            .then((resp) => {
              callback(resp.data);
            })
            .catch(() => {
              callback();
            });
        },
        400
      ),
    []
  );

  React.useEffect(() => {
    let active = true;

    fetch({ input: inputValue }, (results?: readonly SearchCategory[]) => {
      if (active) {
        let newOptions: readonly SearchCategory[] = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        // delete duplicates
        newOptions = newOptions.filter(
          (option, index, self) =>
            index === self.findIndex((t) => t.id === option.id)
        );

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && inputValue) {
      event.preventDefault();
    }
  };

  return (
    <Autocomplete
      id="product-selector"
      sx={{ width: "100%" }}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.label
      }
      disabled={isLoading}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      filterSelectedOptions
      value={value}
      noOptionsText="ไม่พบประเภทสินค้า"
      readOnly={isBackdrop}
      onChange={(_: any, newValue: SearchCategory | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        props.onSubmit(newValue);
      }}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          {...props.fieldProps}
          label="กรุณาเลือกประเภทสินค้า"
          fullWidth
          placeholder={isLoading ? "กรุณารอสักครู่" : "ค้นหาประเภทสินค้า"}
          // Handle key press events here
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
      renderOption={(props_, option) => {
        const { key, ...optionProps } = props_;

        const parts = parse(option.label, match(option.label, inputValue));
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
                <Typography variant="body2" color="text.secondary">
                  {option.id == props.defaultValue ? "(กำลังใช้งาน) " : ""}
                  {option.overstock ? "อณุญาตการค้าง" : "ไม่อณุญาตการค้าง"}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};

export default CategorySelector;
