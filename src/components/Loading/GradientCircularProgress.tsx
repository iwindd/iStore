"use client";
import { CircularProgress, useTheme } from "@mui/material";
import React from "react";

const GradientCircularProgress = () => {
  const theme = useTheme();
  return (
    <React.Fragment>
      <svg width={100} height={100}>
        <defs>
          <linearGradient
            id="gradient-curcular-progress-loading"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={theme.palette.primary.main} />
            <stop offset="100%" stopColor={theme.palette.info.main} />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        sx={{
          "svg circle": {
            stroke: "url(#gradient-curcular-progress-loading)",
          },
        }}
        size={50}
      />
    </React.Fragment>
  );
};

export default GradientCircularProgress;
