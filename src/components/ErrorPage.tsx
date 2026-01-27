"use client";

import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";

interface ErrorPageProps {
  code: string;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
  href?: string;
}

const ErrorPage = ({
  code,
  title,
  description,
  buttonText,
  onButtonClick,
  href = "/",
}: ErrorPageProps) => {
  return (
    <Container maxWidth="md">
      <Stack
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        spacing={4}
        textAlign="center"
      >
        <Stack spacing={2} alignItems="center">
          <Typography variant="h4" fontWeight={700}>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth="sm">
            {description}
          </Typography>
        </Stack>

        <Box position="relative" sx={{ width: "100%", height: 300 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: "12rem",
              fontWeight: 900,
              color: "primary.main",
              opacity: 0.1,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 0,
            }}
          >
            {code}
          </Typography>
        </Box>

        {onButtonClick ? (
          <Button
            onClick={onButtonClick}
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
            }}
            startIcon={<ArrowBack />}
          >
            {buttonText}
          </Button>
        ) : (
          <Button
            component={Link}
            href={href}
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
            }}
            startIcon={<ArrowBack />}
          >
            {buttonText}
          </Button>
        )}
      </Stack>
    </Container>
  );
};

export default ErrorPage;
