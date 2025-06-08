"use client";
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
import React, { useEffect } from "react";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import { debounce } from "@mui/material/utils";
import { useInterface } from "@/providers/InterfaceProvider";
import SearchCategories, { SearchCategory } from "@/actions/category/search";
import findCategory from "@/actions/category/find";

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
        .then(resp => {
          if (resp.success && resp.data) {
            setValue(resp.data);
          }
        })
        .finally(() => {
          setIsLoading(false);
        })
    }
  }, [props.defaultValue])

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
          InputProps={isLoading ? ({
            startAdornment: (
              <InputAdornment position="end" sx={{ mr: 1 }}>
                <CircularProgress size={20} />
              </InputAdornment>
            ),
          }): {...params.InputProps}}
          onKeyDown={handleKeyDown} // Handle key press events here
        />
      )}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;

        const parts = parse(option.label, match(option.label, inputValue));
        return (
          <li key={key} {...optionProps}>
            <Grid container sx={{ alignItems: "center" }}>
              <Grid
                item
                sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
              >
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
                  {option.overstock ? "อณุญาตการเบิก" : "ไม่อณุญาตการเบิก" } 
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
