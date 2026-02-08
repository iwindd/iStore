import { Box, Button, Stack, Switch, Typography } from "@mui/material";
import { JSX } from "react";

interface SettingCartProps {
  title: string;
  icon: JSX.Element;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const SettingCart = ({
  title,
  icon,
  checked,
  onChange,
  disabled = false,
}: SettingCartProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <Box>
      <Button
        onClick={() => onChange(!checked)}
        variant="text"
        color="secondary"
        disableRipple
        disabled={disabled}
        sx={{
          width: "100%",
          height: "100%",
          gap: 1,
          display: "flex",
          flexDirection: "column",
          p: 2,
          textAlign: "left",
          borderRadius: 2,
          border: "1px solid var(--mui-palette-divider)",
          backgroundColor: checked ? `var(--mui-palette-action-hover)` : "",
        }}
      >
        <Stack
          direction="row"
          justifyContent={"space-between"}
          alignItems="center"
          spacing={2}
          width={"100%"}
        >
          {icon}
          <Switch
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
          />
        </Stack>
        <Stack sx={{ width: "100%" }}>
          <Typography variant="subtitle2" mt={1}>
            {title}
          </Typography>
        </Stack>
      </Button>
    </Box>
  );
};

export default SettingCart;
