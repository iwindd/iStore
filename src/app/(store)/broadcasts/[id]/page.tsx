"use client";
import { cancelBroadcast } from "@/actions/broadcast/cancelBroadcast";
import { getBroadcast } from "@/actions/broadcast/getBroadcast";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import App, { Wrapper } from "@/layouts/App";
import { date } from "@/libs/formatter";
import { getPath } from "@/router";
import { CancelTwoTone, EditTwoTone } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  ChipProps,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";

const STATUS_CHIP_COLORS: Record<string, ChipProps["color"]> = {
  DRAFT: "default",
  SCHEDULED: "info",
  SENT: "success",
  CANCELLED: "warning",
  FAILED: "error",
};

const BroadcastViewPage = () => {
  const t = useTranslations("BROADCASTS");
  const params = useParams<{ id: string }>();
  const broadcastId = Number.parseInt(params.id);
  const queryClient = useQueryClient();

  const broadcastQuery = useQuery({
    queryKey: ["broadcast", broadcastId],
    queryFn: () => getBroadcast(broadcastId),
    enabled: !Number.isNaN(broadcastId),
  });

  const cancelConfirmation = useConfirm({
    title: t("datatable.confirmations.cancel.title"),
    text: t("datatable.confirmations.cancel.text"),
    confirmProps: {
      color: "warning",
      startIcon: <CancelTwoTone />,
    },
    onConfirm: async () => {
      try {
        await cancelBroadcast(broadcastId);
        cancelConfirmation.handleClose();
        await queryClient.refetchQueries({
          queryKey: ["broadcast", broadcastId],
        });
        await queryClient.refetchQueries({
          queryKey: ["broadcasts"],
        });
        enqueueSnackbar(t("datatable.confirmations.cancel.success"), {
          variant: "success",
        });
      } catch (error) {
        console.error("Error cancelling broadcast:", error);
        enqueueSnackbar(t("datatable.confirmations.cancel.error"), {
          variant: "error",
        });
      }
    },
  });

  if (broadcastQuery.isLoading) {
    return (
      <Wrapper>
        <App.Header>
          <App.Header.Title>{t("view.loading")}</App.Header.Title>
        </App.Header>
      </Wrapper>
    );
  }

  if (!broadcastQuery.data) {
    return (
      <Wrapper>
        <App.Header>
          <App.Header.Title>{t("view.not_found")}</App.Header.Title>
        </App.Header>
      </Wrapper>
    );
  }

  const broadcast = broadcastQuery.data;
  const statusLabel = t(`datatable.status.${broadcast.status}`);
  const statusColor = STATUS_CHIP_COLORS[broadcast.status] || "default";
  const canEdit = ["DRAFT", "SCHEDULED"].includes(broadcast.status);
  const canCancel = ["DRAFT", "SCHEDULED"].includes(broadcast.status);

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("view.title")}</App.Header.Title>
        <App.Header.Actions>
          {canEdit && (
            <Button
              component={Link}
              href={getPath("broadcasts.broadcast.edit", {
                id: broadcast.id.toString(),
              })}
              startIcon={<EditTwoTone />}
              variant="outlined"
              size="small"
            >
              {t("view.edit")}
            </Button>
          )}
          {canCancel && (
            <Button
              startIcon={<CancelTwoTone />}
              variant="outlined"
              color="warning"
              size="small"
              onClick={() => cancelConfirmation.handleOpen()}
            >
              {t("view.cancel")}
            </Button>
          )}
        </App.Header.Actions>
      </App.Header>
      <App.Main>
        <Stack spacing={2}>
          <Card>
            <CardHeader
              title={broadcast.title}
              action={<Chip label={statusLabel} color={statusColor} />}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t("view.sections.content.promotion")}
                  </Typography>
                  <Typography variant="body1">
                    {broadcast.event.note || `Promotion #${broadcast.event.id}`}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t("view.sections.content.promotion_period")}
                  </Typography>
                  <Typography variant="body1">
                    {date(broadcast.event.start_at, {
                      withTime: false,
                      shortMonth: true,
                    })}{" "}
                    -{" "}
                    {date(broadcast.event.end_at, {
                      withTime: false,
                      shortMonth: true,
                    })}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t("view.sections.content.message")}
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {broadcast.message}
                  </Typography>
                </Grid>
                {broadcast.image_url && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("view.sections.content.image")}
                    </Typography>
                    <img
                      src={broadcast.image_url}
                      alt={t("view.sections.content.image_alt")}
                      style={{ maxWidth: "300px", borderRadius: "8px" }}
                    />
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title={t("view.sections.delivery.title")} />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t("view.sections.delivery.scheduled_at")}
                  </Typography>
                  <Typography variant="body1">
                    {date(broadcast.scheduled_at, {
                      withTime: true,
                      shortMonth: true,
                    })}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t("view.sections.delivery.sent_at")}
                  </Typography>
                  <Typography variant="body1">
                    {broadcast.sent_at
                      ? date(broadcast.sent_at, {
                          withTime: true,
                          shortMonth: true,
                        })
                      : "-"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t("view.sections.delivery.creator")}
                  </Typography>
                  <Typography variant="body1">
                    {broadcast.creator?.user.name ||
                      t("datatable.placeholders.not_specified")}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {broadcast.logs && broadcast.logs.length > 0 && (
            <Card>
              <CardHeader title={t("view.sections.history.title")} />
              <Divider />
              <CardContent>
                <Stack spacing={1}>
                  {broadcast.logs.map(
                    (log: {
                      id: number;
                      status: string;
                      created_at: Date;
                      error_message: string | null;
                    }) => (
                      <Stack
                        key={log.id}
                        direction="row"
                        spacing={2}
                        alignItems="center"
                      >
                        <Chip
                          label={log.status}
                          color={log.status === "SUCCESS" ? "success" : "error"}
                          size="small"
                        />
                        <Typography variant="body2">
                          {date(log.created_at, {
                            withTime: true,
                            shortMonth: true,
                          })}
                        </Typography>
                        {log.error_message && (
                          <Typography variant="body2" color="error">
                            {log.error_message}
                          </Typography>
                        )}
                      </Stack>
                    )
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>
      </App.Main>

      <Confirmation {...cancelConfirmation.props} />
    </Wrapper>
  );
};

export default BroadcastViewPage;
