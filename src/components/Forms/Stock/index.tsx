"use client";
import { StockLayoutValue } from "@/app/(products)/stocks/[id]/layout";
import ProductSelector from "@/components/Selector/ProductSelector";
import STOCK_CONFIG from "@/config/Stock";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { useDialog } from "@/hooks/use-dialog";
import { StockSchema, StockValues } from "@/schema/Stock";
import { zodResolver } from "@hookform/resolvers/zod";
import { Delete, PanToolAltTwoTone, SaveTwoTone } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { StockReceiptStatus } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import ToolDialog from "./components/ToolDialog";

type StockFormProps = {
  stock?: StockLayoutValue;
  onSubmit: (data: StockValues) => void;
  isLoading?: boolean;
  disabled?: boolean;
};

const StockForm = ({
  stock,
  onSubmit,
  isLoading,
  ...props
}: StockFormProps) => {
  const t = useTranslations("STOCKS.form");
  const disabled =
    props.disabled || (stock && stock?.status !== StockReceiptStatus.DRAFT);
  const toolDialog = useDialog();
  const ref = useRef<HTMLFormElement>(null);
  const form = useForm<StockValues>({
    resolver: zodResolver(StockSchema),
    defaultValues: {
      note: stock?.note || "",
      products: stock?.stock_recept_products.map((product) => ({
        product_id: product.product_id,
        delta: product.quantity,
      })) || [
        {
          product_id: 0,
          delta: 0,
        },
      ],
      update: false,
    },
  });

  const {
    register,
    formState: { errors },
    setValue,
    control,
    handleSubmit,
  } = form;

  const {
    fields: products,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "products",
    rules: {
      maxLength: STOCK_CONFIG.MAX_STOCK_PRODUCT_PER_STOCK,
      minLength: 1,
    },
  });

  const submitConfirmation = useConfirm({
    title: t("confirmation.title"),
    text: t("confirmation.text"),
    confirmProps: {
      color: "success",
      startIcon: <SaveTwoTone />,
    },
    onConfirm: async (values: StockValues) => {
      onSubmit(values);
    },
  });

  const submitWrapper = async (data: StockValues) => {
    if (data.update) {
      submitConfirmation.with(data);
      submitConfirmation.handleOpen();

      return;
    }

    onSubmit(data);
  };

  return (
    <>
      <Stack
        id="stock-form"
        component={"form"}
        onSubmit={(e) => {
          e.preventDefault();
          const submitter = (e.nativeEvent as SubmitEvent)
            .submitter as HTMLButtonElement;

          setValue("update", submitter?.name == "saveAndUpdate");

          return handleSubmit(submitWrapper)(e);
        }}
        ref={ref}
        spacing={2}
      >
        <Card>
          <CardHeader title={t("general_info")} />
          <CardContent>
            <TextField
              autoFocus
              margin="dense"
              label={t("note")}
              fullWidth
              multiline
              rows={2}
              {...register("note")}
              error={!!errors.note}
              helperText={errors.note?.message}
              disabled={isLoading || disabled}
            />
          </CardContent>
        </Card>
        <Card sx={{ pb: 0 }}>
          <CardHeader
            title={t("product_details")}
            action={
              <Button
                startIcon={<PanToolAltTwoTone />}
                variant="text"
                color="secondary"
                onClick={toolDialog.handleOpen}
                size="small"
                disabled={isLoading || disabled}
              >
                {t("tools")}
              </Button>
            }
          />
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "50px" }}>
                      {t("headers.index")}
                    </TableCell>
                    <TableCell sx={{ width: "50%" }}>
                      {t("headers.label")}
                    </TableCell>
                    <TableCell>{t("headers.delta")}</TableCell>
                    <TableCell
                      sx={{
                        display:
                          stock?.status === StockReceiptStatus.DRAFT
                            ? undefined
                            : "none",
                      }}
                    >
                      {t("headers.actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.length > 0 ? (
                    products.map((product, index) => (
                      <TableRow key={product.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <ProductSelector
                            defaultValue={product.product_id}
                            error={!!errors.products?.[index]?.product_id}
                            helperText={
                              errors.products?.[index]?.product_id?.message
                            }
                            disabled={disabled || isLoading}
                            onSubmit={(product) => {
                              setValue(
                                `products.${index}.product_id`,
                                product?.id as number,
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            type="number"
                            {...register(`products.${index}.delta`, {
                              valueAsNumber: true,
                            })}
                            disabled={isLoading || disabled}
                            error={!!errors.products?.[index]?.delta}
                            helperText={
                              errors.products?.[index]?.delta?.message
                            }
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            display:
                              stock?.status === StockReceiptStatus.DRAFT
                                ? undefined
                                : "none",
                          }}
                        >
                          <IconButton
                            onClick={() => remove(index)}
                            disabled={
                              products.length === 1 || isLoading || disabled
                            }
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Typography
                          variant="body2"
                          align="center"
                          color="secondary"
                        >
                          {t("empty")}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter
                  sx={{
                    display:
                      !stock || stock?.status === StockReceiptStatus.DRAFT
                        ? undefined
                        : "none",
                  }}
                >
                  <TableRow>
                    <TableCell colSpan={4}>
                      {products.length <
                      STOCK_CONFIG.MAX_STOCK_PRODUCT_PER_STOCK ? (
                        <Button
                          variant="dashed"
                          color="secondary"
                          fullWidth
                          onClick={() => append({ product_id: 0, delta: 0 })}
                          disabled={isLoading || disabled}
                        >
                          {t("add_product")}
                        </Button>
                      ) : (
                        <Typography
                          variant="body2"
                          align="center"
                          color="secondary"
                        >
                          {t("max_limit", {
                            max: STOCK_CONFIG.MAX_STOCK_PRODUCT_PER_STOCK,
                          })}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent
            component={Stack}
            justifyContent={"space-between"}
            direction={"row"}
          >
            <Typography variant="subtitle1" color="secondary">
              {t("footer_title")}
            </Typography>
            <Stack direction={"row"} spacing={1}>
              {isLoading ||
              (stock && stock?.status !== StockReceiptStatus.DRAFT) ? (
                <Typography variant="body2" color="secondary">
                  {stock?.status === StockReceiptStatus.DRAFT
                    ? t("status_saving")
                    : t("status_completed")}
                </Typography>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    color="secondary"
                    type="submit"
                    form="stock-form"
                    name="draft"
                    disabled={disabled}
                    loading={isLoading}
                  >
                    {t("save_draft")}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveTwoTone />}
                    type="submit"
                    form="stock-form"
                    name="saveAndUpdate"
                    disabled={disabled}
                    loading={isLoading}
                  >
                    {t("save_and_manage")}
                  </Button>
                </>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Confirmation {...submitConfirmation.props} />
      <ToolDialog
        open={toolDialog.open}
        onClose={toolDialog.handleClose}
        form={form}
      />
    </>
  );
};

export default StockForm;
