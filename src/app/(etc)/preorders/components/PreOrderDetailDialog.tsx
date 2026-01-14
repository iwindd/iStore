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
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

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
  const { enqueueSnackbar } = useSnackbar();
  const [preorder, setPreorder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && id) {
      fetchPreOrder();
    }
  }, [id, open]);

  const fetchPreOrder = async () => {
    try {
      const data = await getPreOrderDetail(id);
      setPreorder(data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("ไม่สามารถโหลดข้อมูลได้", { variant: "error" });
    }
  };

  const handleMarkAsReturned = async () => {
    try {
      setLoading(true);
      await updatePreOrderStatus(id, PreOrderStatus.RETURNED);
      enqueueSnackbar("อัปเดตสถานะเรียบร้อย", { variant: "success" });
      onSuccess();
    } catch (error: any) {
      console.error(error);
      enqueueSnackbar(error.message || "เกิดข้อผิดพลาดในการอัปเดตสถานะ", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmCancel = useConfirm({
    title: "ยืนยันการยกเลิก",
    text: "คุณแน่ใจหรือไม่ว่าต้องการยกเลิกพรีออเดอร์นี้?",
    onConfirm: async () => {
      try {
        setLoading(true);
        await updatePreOrderStatus(id, PreOrderStatus.CANCELLED);
        enqueueSnackbar("ยกเลิกพรีออเดอร์เรียบร้อย", { variant: "success" });
        onSuccess();
      } catch (error: any) {
        console.error(error);
        enqueueSnackbar(
          error.message || "เกิดข้อผิดพลาดในการยกเลิกพรีออเดอร์",
          {
            variant: "error",
          }
        );
      } finally {
        setLoading(false);
      }
    },
  });

  if (!preorder) {
    return null;
  }

  const isPending = preorder.status === PreOrderStatus.PENDING;
  const isReturned = preorder.status === PreOrderStatus.RETURNED;
  const isCancelled = preorder.status === PreOrderStatus.CANCELLED;

  const isOutOfStock = preorder.product.stock?.quantity < preorder.count;

  const getReturnButtonLabel = () => {
    if (loading) return "กำลังบันทึก...";
    if (isOutOfStock) return "สต๊อกสินค้าไม่เพียงพอ";
    return "ส่งคืนเรียบร้อยแล้ว";
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6" component="div" sx={{ flex: 1 }}>
            รายละเอียดพรีออเดอร์ #{preorder.id}
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
              ข้อมูลสินค้า
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              ชื่อสินค้า
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {preorder.product.label}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              รหัสสินค้า
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {preorder.product.serial || "-"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" color="text.secondary">
              จำนวน
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {preorder.count} ชิ้น
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" color="text.secondary">
              ราคาต่อหน่วย
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {ff.money(preorder.product.price)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" color="text.secondary">
              ยอดรวม
            </Typography>
            <Typography variant="body1" fontWeight={600} color="success.main">
              {ff.money(preorder.total)}
            </Typography>
          </Grid>

          <Grid size={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="overline" color="text.secondary">
              ข้อมูลออเดอร์
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              เลขที่ออเดอร์
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              #{preorder.order.id}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              วันที่ทำรายการ
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {ff.date(preorder.order.created_at)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              ผู้ทำรายการ
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {preorder.order.creator?.user?.name || "ไม่ระบุ"}
            </Typography>
          </Grid>

          {isReturned && preorder.returned_at && (
            <>
              <Grid size={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="overline" color="text.secondary">
                  ข้อมูลการส่งคืน
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  วันที่ส่งคืน
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {ff.date(preorder.returned_at)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  ผู้ส่งคืน
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {preorder.returned_by?.user?.name || "ไม่ระบุ"}
                </Typography>
              </Grid>
            </>
          )}

          {isCancelled && preorder.cancelled_at && (
            <>
              <Grid size={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="overline" color="text.secondary">
                  ข้อมูลการยกเลิก
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  วันที่ยกเลิก
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {ff.date(preorder.cancelled_at)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  ผู้ยกเลิก
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {preorder.cancelled_by?.user?.name || "ไม่ระบุ"}
                </Typography>
              </Grid>
            </>
          )}

          {preorder.note && (
            <Grid size={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary">
                หมายเหตุ
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
          ปิด
        </Button>
        {isPending && (
          <Stack direction="row" spacing={1}>
            <Button
              onClick={confirmCancel.handleOpen}
              variant="outlined"
              color="error"
              disabled={loading}
              startIcon={<CloseTwoTone />}
            >
              ยกเลิกพรีออเดอร์
            </Button>
            <Button
              onClick={handleMarkAsReturned}
              variant="contained"
              color={isOutOfStock ? "error" : "success"}
              disabled={loading || isOutOfStock}
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
