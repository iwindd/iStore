"use client";
import { Box } from "@mui/material";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

type BackgroundImageProps = ImageProps & {
  height?: number | string;
};

const BackgroundImage = ({
  src,
  children,
  height = 300,
  ...props
}: BackgroundImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        height,
        width: "100%",
      }}
    >
      <Image
        src={src}
        fill
        onLoad={() => setLoaded(true)}
        placeholder="blur"
        style={{
          objectFit: "cover",
          transition: "all 0.6s ease",
          filter: loaded ? "blur(0px)" : "blur(24px)",
          transform: loaded ? "scale(1)" : "scale(1.05)",
        }}
        {...props}
      />

      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.2)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          height: "100%",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default BackgroundImage;
