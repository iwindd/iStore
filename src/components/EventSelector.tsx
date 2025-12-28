"use client";
import * as EventActions from "@/actions/broadcast/eventActions";
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
import dayjs from "dayjs";
import React, { useEffect } from "react";

interface SelectorProps {
  onSubmit(event: EventActions.EventSelectorItem | null): void;
  fieldProps?: TextFieldProps;
  defaultValue?: number;
  error?: boolean;
  helperText?: string;
}

const EventSelector = (props: SelectorProps) => {
  const [value, setValue] =
    React.useState<EventActions.EventSelectorItem | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<
    readonly EventActions.EventSelectorItem[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { isBackdrop } = useInterface();

  useEffect(() => {
    if (props.defaultValue && props.defaultValue > 0) {
      setIsLoading(true);
      EventActions.findEvent(props.defaultValue)
        .then((resp) => {
          if (resp) {
            setValue(resp);
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
          callback: (
            results?: readonly EventActions.EventSelectorItem[]
          ) => void
        ) => {
          EventActions.searchEvents(request.input)
            .then((resp) => {
              callback(resp);
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

    fetch(
      { input: inputValue },
      (results?: readonly EventActions.EventSelectorItem[]) => {
        if (active) {
          let newOptions: readonly EventActions.EventSelectorItem[] = [];

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
      }
    );

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
      id="event-selector"
      sx={{ width: "100%" }}
      getOptionLabel={(option) =>
        typeof option === "string"
          ? option
          : option.note || `Promotion #${option.id}`
      }
      disabled={isLoading}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      filterSelectedOptions
      value={value}
      noOptionsText="ไม่พบโปรโมชั่น"
      readOnly={isBackdrop}
      onChange={(
        _: unknown,
        newValue: EventActions.EventSelectorItem | null
      ) => {
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
          label="กรุณาเลือกโปรโมชั่น"
          fullWidth
          placeholder={isLoading ? "กรุณารอสักครู่" : "ค้นหาโปรโมชั่น (Note)"}
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
      renderOption={(props_, option) => {
        const { key, ...optionProps } = props_;

        const label = option.note || `Promotion #${option.id}`;
        const parts = parse(label, match(label, inputValue));
        return (
          <li key={key} {...optionProps}>
            <Grid container sx={{ alignItems: "center" }}>
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
                  {option.id === props.defaultValue ? "(เลือกแล้ว) " : ""}
                  {dayjs(option.start_at).format("DD/MM/YY")} -{" "}
                  {dayjs(option.end_at).format("DD/MM/YY")}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};

export default EventSelector;
