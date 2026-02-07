import { Alert } from "@mui/material";
import { Formats } from "next-intl";
import { CustomContentProps, SnackbarContent } from "notistack";
import React from "react";
import { useTranslations } from "use-intl";

interface IntlSuccessSnakebarProps extends CustomContentProps {
  values?: Record<string, string | number | Date>;
  formats?: Formats;
}

const IntlSuccessSnakebar = React.forwardRef<
  HTMLDivElement,
  IntlSuccessSnakebarProps
>((props, ref) => {
  const { message, values, formats } = props;

  const t = useTranslations();
  const messageParsed =
    typeof message === "string" ? t(message, values, formats) : message;

  return (
    <SnackbarContent ref={ref} role="alert">
      <Alert
        severity="success"
        variant="filled"
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: "#43a047",
          color: "#fff",
        }}
      >
        {messageParsed}
      </Alert>
    </SnackbarContent>
  );
});

export default IntlSuccessSnakebar;
