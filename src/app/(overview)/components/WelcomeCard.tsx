"use client";
import BackgroundImage from "@/components/Images/BackgroundImage";
import { useAuth } from "@/hooks/use-auth";
import { getPath } from "@/router";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import bg from "./images/welcome-bg.png";
import illustration from "./images/welcome-illustration.png";

const WelcomeCard = () => {
  const { session } = useAuth();
  const t = useTranslations("OVERVIEW");

  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 2,
        width: "100%",
        boxShadow: "none",
      }}
    >
      <BackgroundImage src={bg} alt="">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          sx={{
            position: "relative",
            zIndex: 2,
            p: { xs: 3, md: 5 },
            color: "common.white",
          }}
        >
          {/* Left Content */}
          <Stack spacing={3} sx={{ maxWidth: "480px", width: "100%" }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                {t("welcome_card.welcome_back")}
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{ textShadow: "0px 0px 20px rgba(0,0,0,0.5)" }}
              >
                {session?.user?.name || "User"}
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
              {t("welcome_card.description")}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              sx={{
                width: "fit-content",
                textTransform: "none",
                fontWeight: "bold",
              }}
              LinkComponent={Link}
              href={getPath("projects")}
            >
              {t("welcome_card.go_now")}
            </Button>
          </Stack>

          {/* Right Illustration */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "relative",
              width: 300,
              height: 240,
            }}
          >
            <Image
              src={illustration}
              alt="Welcome Illustration"
              fill
              style={{ objectFit: "contain" }}
              priority
              placeholder="blur"
            />
          </Box>
        </Stack>
      </BackgroundImage>
    </Card>
  );
};

export default WelcomeCard;
