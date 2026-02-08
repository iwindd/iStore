import { Box, Button, Stack, Switch, Typography } from "@mui/material";
import { JSX, useState } from "react";

interface SettingCartProps {
  title: string;
  icon: JSX.Element;
}

const SettingCart = ({ title, icon }: SettingCartProps) => {
  const [state, setState] = useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState(event.target.checked);
  };

  return (
    <Box>
      <Button
        onClick={() => setState(!state)}
        variant="text"
        color="secondary"
        disableRipple
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
          backgroundColor: state ? `var(--mui-palette-action-hover)` : "",
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
          <Switch checked={state} onChange={handleChange} />
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
