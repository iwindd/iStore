"use client";
import createStock from "@/actions/stock/createStock";
import Selector from "@/components/Selector";
import STOCK_CONFIG from "@/config/Stock";
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
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import ToolDialog from "./components/ToolDialog";

const StockForm = () => {
  const toolDialog = useDialog();
  const ref = useRef<HTMLFormElement>(null);
  const form = useForm<StockValues>({
    resolver: zodResolver(StockSchema),
    defaultValues: {
      note: "",
      products: [
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

  const createStockMutation = useMutation({
    mutationFn: async (data: StockValues) => createStock(data),
    onMutate: () => {
      console.log("mutate");
    },
    onSuccess: () => {
      console.log("success");
    },
    onError: (error) => {},
    onSettled: () => {
      console.log("settled");
    },
  });

  const onSubmit = (data: StockValues) => {
    createStockMutation.mutate(data);
  };

  return (
    <Stack
      id="stock-form"
      component={"form"}
      onSubmit={(e) => {
        e.preventDefault();
        const submitter = (e.nativeEvent as SubmitEvent)
          .submitter as HTMLButtonElement;

        setValue("update", submitter?.name == "saveAndUpdate");

        return handleSubmit(onSubmit)(e);
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
                  <TableCell>เครื่องมือ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Selector
                          defaultValue={product.product_id}
                          fieldProps={{
                            fullWidth: true,
                            error: !!errors.products?.[index]?.product_id,
                            helperText:
                              errors.products?.[index]?.product_id?.message,
                          }}
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
                          error={!!errors.products?.[index]?.delta}
                          helperText={errors.products?.[index]?.delta?.message}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => remove(index)}
                          disabled={products.length === 1}
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
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>
                    {products.length <
                    STOCK_CONFIG.MAX_STOCK_PRODUCT_PER_STOCK ? (
                      <Button
                        variant="dashed"
                        color="secondary"
                        fullWidth
                        onClick={() => append({ product_id: 0, delta: 0 })}
                      >
                        เพิ่มสินค้า
                      </Button>
                    ) : (
                      <Typography
                        variant="body2"
                        align="center"
                        color="secondary"
                      >
                        สูงสุด {STOCK_CONFIG.MAX_STOCK_PRODUCT_PER_STOCK} รายการ
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
  );
};

export const StockFormActions = () => {
  return (
    <>
      <Typography variant="subtitle1" color="secondary">
        จัดการสต๊อก
      </Typography>
      <Stack direction={"row"} spacing={1}>
        <Button
          variant="outlined"
          color="secondary"
          type="submit"
          form="stock-form"
          name="draft"
        >
          บันทึกแบบร่าง
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveTwoTone />}
          type="submit"
          form="stock-form"
          name="saveAndUpdate"
        >
          บันทึกและจัดการสต๊อก
        </Button>
      </Stack>
    </>
  );
};

export default StockForm;
