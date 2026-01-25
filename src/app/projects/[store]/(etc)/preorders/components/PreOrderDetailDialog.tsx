"use client";
import getPreOrderDetail from "@/actions/preorder/getPreOrderDetail";
import updatePreOrderStatus from "@/actions/preorder/updatePreOrderStatus";
import PreOrderStatusChip from "@/components/Chips/PreOrderStatusChip";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import * as ff from "@/libs/formatter";
import { CheckCircleTwoTone, CloseTwoTone } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { PreOrderStatus } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useSnackbar } from "notistack";

interface PreOrderDetailDialogProps {
  id: number;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PreOrderDetailDialog = ({
  id,
  open,
  onClose,
  onSuccess,
}: PreOrderDetailDialogProps) => {
  const t = useTranslations("PREORDERS.dialog");
  const { enqueueSnackbar } = useSnackbar();
  const { store } = useParams<{ store: string }>();
  const queryClient = useQueryClient();

  const { data: preorder } = useQuery({
    queryKey: ["getPreOrderDetail", store, id],
    queryFn: () => getPreOrderDetail(store, id),
    enabled: open && !!id,
  });

  const updatePreOrderStatusMutation = useMutation({
    mutationFn: (status: PreOrderStatus) =>
      updatePreOrderStatus(store, id, status),
    onSuccess: (status) => {
      switch (status) {
        case PreOrderStatus.RETURNED:
          enqueueSnackbar(t("messages.returned_success"), {
            variant: "success",
          });
          break;
        case PreOrderStatus.CANCELLED:
          enqueueSnackbar(t("messages.cancelled_success"), {
            variant: "success",
          });
          break;
        default:
          break;
      }
      onSuccess();
      queryClient.invalidateQueries({
        queryKey: ["getPreOrderDetail", store, id],
      });
      queryClient.invalidateQueries({
        queryKey: ["preorders"],
      });
    },
    onError: (error: any) => {
      console.error(error);
      enqueueSnackbar(t("messages.error"), {
        variant: "error",
      });
    },
  });

  const confirmCancel = useConfirm({
    title: t("messages.cancel_confirm_title"),
    text: t("messages.cancel_confirm_text"),
    onConfirm: async () =>
      updatePreOrderStatusMutation.mutate(PreOrderStatus.CANCELLED),
  });

  if (!preorder) {
    return null;
  }

  const isPending = preorder.status === PreOrderStatus.PENDING;
  const isReturned = preorder.status === PreOrderStatus.RETURNED;
  const isCancelled = preorder.status === PreOrderStatus.CANCELLED;

  const isOutOfStock =
    (preorder?.product.stock?.quantity || 0) < preorder.count;

  const getReturnButtonLabel = () => {
    if (updatePreOrderStatusMutation.isPending) return t("buttons.saving");
    if (isOutOfStock) return t("buttons.insufficient_stock");
    return t("buttons.mark_returned");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6" component="div" sx={{ flex: 1 }}>
            {t("title", { id: preorder.id })}
          </Typography>
          <PreOrderStatusChip status={preorder.status} size="medium" />
          <IconButton onClick={onClose} size="small">
            <CloseTwoTone />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="overline" color="text.secondary">
              {t("sections.product")}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              {t("labels.product_name")}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {preorder.product.label}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              {t("labels.serial")}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {preorder.product.serial || "-"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {t("labels.count")}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {t("labels.items_unit", { count: preorder.count })}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {t("labels.price_per_unit")}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {ff.money(preorder.product.price)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {t("labels.total")}
            </Typography>
            <Typography variant="body1" fontWeight={600} color="success.main">
              {ff.money(preorder.total)}
            </Typography>
          </Grid>

          <Grid size={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="overline" color="text.secondary">
              {t("sections.order")}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              {t("labels.order_id")}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              #{preorder.order.id}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              {t("labels.order_date")}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {ff.date(preorder.order.created_at)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              {t("labels.creator")}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {preorder.order.creator?.user
                ? `${preorder.order.creator.user.first_name} ${preorder.order.creator.user.last_name}`
                : t("labels.not_specified")}
            </Typography>
          </Grid>

          {isReturned && preorder.returned_at && (
            <>
              <Grid size={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="overline" color="text.secondary">
                  {t("sections.return")}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  {t("labels.return_date")}
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {ff.date(preorder.returned_at)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  {t("labels.returner")}
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {preorder.returned_by?.user?.first_name +
                    " " +
                    preorder.returned_by?.user?.last_name ||
                    t("labels.not_specified")}
                </Typography>
              </Grid>
            </>
          )}

          {isCancelled && preorder.cancelled_at && (
            <>
              <Grid size={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="overline" color="text.secondary">
                  {t("sections.cancel")}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  {t("labels.cancel_date")}
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {ff.date(preorder.cancelled_at)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  {t("labels.canceller")}
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {preorder.cancelled_by?.user?.first_name +
                    " " +
                    preorder.cancelled_by?.user?.last_name ||
                    t("labels.not_specified")}
                </Typography>
              </Grid>
            </>
          )}

          {preorder.note && (
            <Grid size={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {t("labels.note")}
              </Typography>
              <Box
                sx={{
                  mt: 1,
                  p: 2,
                  bgcolor: "background.default",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2">{preorder.note}</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          {t("buttons.close")}
        </Button>
        {isPending && (
          <Stack direction="row" spacing={1}>
            <Button
              onClick={confirmCancel.handleOpen}
              variant="outlined"
              color="error"
              disabled={updatePreOrderStatusMutation.isPending}
              startIcon={<CloseTwoTone />}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              onClick={() =>
                updatePreOrderStatusMutation.mutate(PreOrderStatus.RETURNED)
              }
              variant="contained"
              color={isOutOfStock ? "error" : "success"}
              disabled={updatePreOrderStatusMutation.isPending || isOutOfStock}
              startIcon={<CheckCircleTwoTone />}
            >
              {getReturnButtonLabel()}
            </Button>
          </Stack>
        )}
      </DialogActions>
      <Confirmation {...confirmCancel.props} />
    </Dialog>
  );
};

export default PreOrderDetailDialog;
