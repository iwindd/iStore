import { Alert } from "@mui/material";
import { Formats } from "next-intl";
import { CustomContentProps, SnackbarContent } from "notistack";
import React from "react";
import { useTranslations } from "use-intl";

interface IntlErrorSnakebarProps extends CustomContentProps {
  values?: Record<string, string | number | Date>;
  formats?: Formats;
}

const IntlErrorSnakebar = React.forwardRef<
  HTMLDivElement,
  IntlErrorSnakebarProps
>((props, ref) => {
  const { message, values, formats } = props;

  const t = useTranslations();
  const messageParsed =
    typeof message === "string" ? t(message, values, formats) : message;

  return (
    <SnackbarContent ref={ref} role="alert">
      <Alert
        severity="error"
        variant="filled"
        sx={{
          width: "100%",
          height: "100%",
        }}
      >
        {messageParsed}
      </Alert>
    </SnackbarContent>
  );
});

export default IntlErrorSnakebar;
