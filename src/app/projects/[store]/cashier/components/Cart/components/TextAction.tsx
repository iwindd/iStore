import { Typography } from "@mui/material";

const TextAction = ({
  label,
  ...props
}: {
  label: string;
  onClick?: () => void;
}) => {
  return (
    <button
      {...props}
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
