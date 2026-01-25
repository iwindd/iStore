import { getPath } from "@/router";
import { ChatBubbleTwoTone, RssFeedTwoTone } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { LineApplication } from "@prisma/client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

type LineCardDisplayProps = {
  application: LineApplication;
};

const LineCardDisplay = ({ application }: LineCardDisplayProps) => {
  const t = useTranslations("APPLICATIONS");
  const params = useParams<{ store: string }>();

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardActionArea
        component={Link}
        href={getPath("projects.store.applications.line", {
          store: params.store,
          id: application.id.toString(),
        })}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              src={undefined} // You might want a line logo here if available
              sx={{ bgcolor: "#00B900", color: "white", fontWeight: "bold" }}
            >
              L
            </Avatar>
          }
          title={
            <Typography variant="h6" component="div" noWrap>
              {application.name}
            </Typography>
          }
          subheader={`ID: ${application.id}`}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {application.useAsChatbot && (
              <Chip
                icon={<ChatBubbleTwoTone />}
                label={t("labels.chatbot")}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {application.useAsBroadcast && (
              <Chip
                icon={<RssFeedTwoTone />}
                label={t("labels.broadcast")}
                size="small"
                color="secondary"
                variant="outlined"
              />
            )}
            {!application.useAsChatbot && !application.useAsBroadcast && (
              <Typography variant="body2" color="text.secondary">
                {t("labels.not_active")}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default LineCardDisplay;
