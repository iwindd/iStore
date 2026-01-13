"use client";
import { StockLayoutValue } from "@/app/(products)/stocks/[id]/layout";
import ProductSelector from "@/components/Selector/ProductSelector";
import STOCK_CONFIG from "@/config/Stock";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { useDialog } from "@/hooks/use-dialog";
import AppFooter from "@/layouts/App/Footer";
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
    title: "แจ้งเตือน",
    text: "คุณต้องการจัดการสต๊อกนี้หรือไม่?",
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
          <CardHeader title="ข้อมูลทั่วไป" />
          <CardContent>
            <TextField
              autoFocus
              margin="dense"
              label="หมายเหตุ"
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
            title="รายละเอียดสินค้า"
            action={
              <Button
                startIcon={<PanToolAltTwoTone />}
                variant="text"
                color="secondary"
                onClick={toolDialog.handleOpen}
                size="small"
                disabled={isLoading || disabled}
              >
                เครื่องมือ
              </Button>
            }
          />
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "50px" }}>#</TableCell>
                    <TableCell sx={{ width: "50%" }}>ชื่อสินค้า</TableCell>
                    <TableCell>จำนวน</TableCell>
                    <TableCell
                      sx={{
                        display:
                          stock?.status === StockReceiptStatus.DRAFT
                            ? undefined
                            : "none",
                      }}
                    >
                      เครื่องมือ
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
                                product?.id as number
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
                          ยังไม่มีสินค้า
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
                          เพิ่มสินค้า
                        </Button>
                      ) : (
                        <Typography
                          variant="body2"
                          align="center"
                          color="secondary"
                        >
                          สูงสุด {STOCK_CONFIG.MAX_STOCK_PRODUCT_PER_STOCK}{" "}
                          รายการ
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <ToolDialog
          open={toolDialog.open}
          onClose={toolDialog.handleClose}
          form={form}
        />
      </Stack>
      <AppFooter
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="subtitle1" color="secondary">
          จัดการสต๊อก
        </Typography>
        <Stack direction={"row"} spacing={1}>
          {isLoading ||
          (stock && stock?.status !== StockReceiptStatus.DRAFT) ? (
            <Typography variant="body2" color="secondary">
              {stock?.status === StockReceiptStatus.DRAFT
                ? "กำลังบันทึก..."
                : `เสร็จสิ้นแล้ว`}
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
              >
                บันทึกแบบร่าง
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveTwoTone />}
                type="submit"
                form="stock-form"
                name="saveAndUpdate"
                disabled={disabled}
              >
                บันทึกและจัดการสต๊อก
              </Button>
            </>
          )}
        </Stack>
      </AppFooter>
      <Confirmation {...submitConfirmation.props} />
    </>
  );
};

export default StockForm;
