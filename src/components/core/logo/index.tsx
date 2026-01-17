import { Stack, StackProps } from "@mui/material";
import Image, { ImageProps } from "next/image";
import iStoreLogo from "./logo.png";

const Logo = ({
  width = 42,
  height = 42,
  slotProps,
}: {
  width?: number;
  height?: number;
  slotProps?: {
    stack?: StackProps;
    image?: ImageProps;
  };
}) => {
  return (
    <Stack
      direction={"row"}
      spacing={1}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        width: "100%",
      }}
      {...slotProps?.stack}
    >
      <Image
        width={width}
        height={height}
        src={iStoreLogo}
        alt="istore"
        {...slotProps?.image}
      ></Image>
    </Stack>
  );
};

export default Logo;
