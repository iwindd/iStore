import { Typography } from "@mui/material";

const TextAction = ({ label }: { label: string }) => {
  return (
    <button
      style={{
        padding: 0,
        background: "transparent",
        border: 0,
        outline: "none",
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        noWrap
        sx={{
          "&:hover": {
            textDecoration: "underline",
            cursor: "pointer",
          },
        }}
      >
        {label}
      </Typography>
    </button>
  );
};

export default TextAction;
