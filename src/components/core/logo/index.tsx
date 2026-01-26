import { Stack, StackProps, useTheme } from "@mui/material";
import { ImageProps } from "next/image";

const Logo = ({
  width = 42,
  height = 42,
  slotProps,
  color = "default",
}: {
  width?: number;
  height?: number;
  slotProps?: {
    stack?: StackProps;
    image?: ImageProps;
  };
  color?: "default" | "neutral";
}) => {
  const theme = useTheme();

  const colors = {
    default: {
      main: theme.palette.primary.main,
      light: theme.palette.primary.light,
    },
    neutral: {
      main: theme.palette.neutral[200],
      light: theme.palette.neutral[100],
    },
  };

  return (
    <Stack
      direction={"row"}
      spacing={1}
      justifyContent={"center"}
      alignItems={"center"}
      {...slotProps?.stack}
    >
      <svg
        style={{
          height: height,
          width: width,
        }}
        viewBox="0 0 810 810"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors[color].main} />
            <stop offset="50%%" stopColor={colors[color].light} />
            <stop offset="100%" stopColor={colors[color].main} />
          </linearGradient>
        </defs>

        <circle cx="179" cy="158" r="77" fill="url(#logoGradient)" />

        <rect
          x="102"
          y="253"
          width="155"
          height="476"
          rx="60"
          fill="url(#logoGradient)"
        />

        <rect
          x="327"
          y="81"
          width="155"
          height="648"
          rx="60"
          fill="url(#logoGradient)"
        />

        <rect
          x="553"
          y="81"
          width="155"
          height="648"
          rx="60"
          fill="url(#logoGradient)"
        />
      </svg>
    </Stack>
  );
};

export default Logo;
