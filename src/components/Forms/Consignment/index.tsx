"use client";
import { ConsignmentDetail } from "@/actions/consignment/getConsignment";
import CashoutContent from "@/components/dialog/PaymentDialog/components/CashoutContent";
import { useDialog } from "@/hooks/use-dialog";
import AppFooter from "@/layouts/App/Footer";
import { money } from "@/libs/formatter";
import { ConsignmentSchema, ConsignmentValues } from "@/schema/Consignment";
import { CashoutInputValues } from "@/schema/Payment";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveTwoTone } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ConsignmentStatus } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";

type ConsignmentFormProps = {
  consignment: ConsignmentDetail;
  onSubmit: (data: {
    order: CashoutInputValues;
    consignment: ConsignmentValues;
  }) => void;
  isLoading?: boolean;
};

const ConsignmentForm = ({
  consignment,
  onSubmit,
  isLoading,
}: ConsignmentFormProps) => {
  const t = useTranslations("CONSIGNMENTS.form");
  const disabled =
    consignment.status !== ConsignmentStatus.PENDING || isLoading;

  const orderDialog = useDialog();
  const [submitData, setSubmitData] = useState<ConsignmentValues | null>(null);
  const form = useForm<ConsignmentValues>({
    resolver: zodResolver(ConsignmentSchema),
    defaultValues: {
      products: consignment.products.map((p) => ({
        id: p.id,
        product_id: p.product_id,
        quantitySold: p.quantitySold ?? p.quantityOut,
        quantityOut: p.quantityOut,
      })),
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = form;

  const total = useMemo(() => {
    return consignment.products.reduce((acc, item) => {
      return acc + item.product.price * item.quantityOut;
    }, 0);
  }, [consignment.products]);

  const onProductFormSubmit = (data: ConsignmentValues) => {
    setSubmitData(data);
    orderDialog.handleOpen();
  };

  const onCashoutFormSubmit = (
    data: CashoutInputValues,
    form: UseFormReturn<CashoutInputValues>
  ) => {
    if (!submitData) return;
    form.reset();
    orderDialog.handleClose();
    onSubmit({
      order: data,
      consignment: submitData,
    });
  };

  return (
    <>
      <Stack
        id="consignment-form"
        component={"form"}
        spacing={2}
        onSubmit={handleSubmit(onProductFormSubmit)}
      >
        <Card>
          <CardHeader title={t("general_info")} />
          <CardContent>
            <TextField
              margin="dense"
              label={t("note")}
              fullWidth
              multiline
              rows={2}
              value={consignment.note || "-"}
              disabled
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader title={t("product_details")} />
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "50px" }}>
                      {t("headers.index")}
                    </TableCell>
                    <TableCell>{t("headers.product_name")}</TableCell>
                    <TableCell align="right">
                      {t("headers.net_total")}
                    </TableCell>
                    <TableCell align="right">
                      {t("headers.quantity_consigned")}
                    </TableCell>
                    <TableCell align="right">
                      {t("headers.quantity_sold")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {consignment.products.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {item.product.label}
                        </Typography>

                        <Typography variant="caption" color="secondary">
                          {item.product.serial}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {money(item.product.price * item.quantityOut)}
                      </TableCell>
                      <TableCell align="right">{item.quantityOut}</TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          size="small"
                          placeholder={item.quantityOut.toString()}
                          {...register(`products.${index}.quantitySold`, {
                            valueAsNumber: true,
                          })}
                          disabled={disabled}
                          error={!!errors.products?.[index]?.quantitySold}
                          helperText={
                            errors.products?.[index]?.quantitySold?.message
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Stack>
      <AppFooter
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="subtitle1" color="secondary">
          {t("footer.manage")}
        </Typography>
        <Stack direction={"row"} spacing={1}>
          {disabled && consignment.status !== ConsignmentStatus.PENDING ? (
            <Typography variant="body2" color="success.main">
              {t("footer.completed")}
            </Typography>
          ) : (
            <Button
              variant="contained"
              startIcon={<SaveTwoTone />}
              type="submit"
              form="consignment-form"
              disabled={disabled}
            >
              {t("footer.save")}
            </Button>
          )}
        </Stack>
      </AppFooter>
      {consignment.status === ConsignmentStatus.PENDING && !disabled && (
        <CashoutContent
          onSubmit={onCashoutFormSubmit}
          total={total}
          open={orderDialog.open}
          onClose={orderDialog.handleClose}
        />
      )}
    </>
  );
};

export default ConsignmentForm;
