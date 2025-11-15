import generatePromotionOfferInfo from "@/actions/ai/generatePromotionOffer";
import findProductById from "@/actions/product/findById";
import useFormValidate from "@/hooks/useFormValidate";
import { useInterface } from "@/providers/InterfaceProvider";
import { AddProductDialogValues } from "@/schema/Promotion/AddProductToOffer";
import {
  AddPromotionOfferSchema,
  AddPromotionOfferValues,
} from "@/schema/Promotion/Offer";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddTwoTone, AutoAwesomeTwoTone } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { DatePicker } from "@mui/x-date-pickers";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import AddProductDialog from "./components/AddProductDialog";
import ProductTable, { ProductTableRow } from "./components/ProductTable";

enum PromotionStatus {
  SCHEDULED = "scheduled",
  IMMEDIATE = "immediate",
}

interface FormBuyXGetYProps {
  isLoading?: boolean;
  disabled?: boolean;
  onSubmit: (data: AddPromotionOfferValues) => void;
}

const FormBuyXGetY = ({ isLoading, ...props }: FormBuyXGetYProps) => {
  const [modalNeedOpen, setModalNeedOpen] = useState(false);
  const [modalOfferOpen, setModalOfferOpen] = useState(false);
  const [needProducts, setNeedProducts] = useState<ProductTableRow[]>([]);
  const [offerProducts, setOfferProducts] = useState<ProductTableRow[]>([]);
  const [status, setStatus] = useState<PromotionStatus>(
    PromotionStatus.SCHEDULED
  );
  const { setBackdrop } = useInterface();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
  } = useFormValidate<AddPromotionOfferValues>({
    resolver: zodResolver(AddPromotionOfferSchema),
    defaultValues: {
      title: "",
      description: "",
      needProducts: [],
      offerProducts: [],
      start_at: dayjs().toDate(),
      end_at: dayjs().add(7, "day").toDate(),
    },
  });

  const aiGeneratePromotionOfferInfo = useMutation({
    mutationFn: async () => {
      return await generatePromotionOfferInfo(
        needProducts.map((p) => {
          return { label: p.product.label, quantity: p.quantity };
        }),
        offerProducts.map((p) => {
          return { label: p.product.label, quantity: p.quantity };
        })
      );
    },
    onSuccess: (data) => {
      setValue("title", data.title);
      setValue("description", data.description);
    },
    onError: (error) => {
      console.log("error generating promotion offer info", error);
    },
  });

  const onAddHandler = async (
    data: AddProductDialogValues,
    type: "need" | "offer"
  ) => {
    try {
      const { success, data: product } = await findProductById(data.product_id);
      if (!success || !product) throw new Error("product_not_found");

      const onAddProduct = (prev: ProductTableRow[]) => {
        const existingIndex = prev.findIndex(
          (p) => p.product.id === product.id
        );
        if (existingIndex === -1) {
          return [
            ...prev,
            {
              product: product,
              quantity: data.quantity,
            },
          ];
        } else {
          const updated = [...prev];
          updated[existingIndex].quantity += data.quantity;
          return updated;
        }
      };

      if (type === "need") {
        setNeedProducts(onAddProduct);
      } else {
        setOfferProducts(onAddProduct);
      }

      enqueueSnackbar("เพิ่มรายการสินค้าเรียบร้อยแล้ว!", {
        variant: "success",
      });
      setModalNeedOpen(false);
      setModalOfferOpen(false);
    } catch (error) {
      console.error("error adding product to promotion offer: ", error);
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
        variant: "error",
      });
    } finally {
      setBackdrop(false);
    }
  };

  const onAddProductNeed = (data: AddProductDialogValues) =>
    onAddHandler(data, "need");
  const onAddProductOffer = (data: AddProductDialogValues) =>
    onAddHandler(data, "offer");

  useEffect(() => {
    setValue(
      "needProducts",
      needProducts.map((p) => ({
        product_id: p.product.id,
        quantity: p.quantity,
      }))
    );
    setValue(
      "offerProducts",
      offerProducts.map((p) => ({
        product_id: p.product.id,
        quantity: p.quantity,
      }))
    );
  }, [needProducts, offerProducts]);

  useEffect(() => {
    if (status === PromotionStatus.IMMEDIATE) {
      const now = new Date();
      setValue("start_at", now);
    }
  }, [status]);

  const disabled = isLoading || props.disabled;

  return (
    <>
      <Stack
        spacing={2}
        component={"form"}
        onSubmit={handleSubmit(props.onSubmit)}
      >
        <Grid container spacing={2}>
          <Grid sm={12} md={6} lg={6}>
            <Card>
              <CardHeader
                title="สินค้าที่ต้องการ"
                action={
                  <Button
                    startIcon={<AddTwoTone />}
                    size="small"
                    variant="outlined"
                    onClick={() => setModalNeedOpen(true)}
                    disabled={disabled}
                  >
                    เพิ่ม
                  </Button>
                }
              />
              <Divider />
              <CardContent>
                <Stack spacing={2}>
                  <FormControl error={!!errors.needProducts}>
                    <ProductTable
                      products={needProducts}
                      setProducts={setNeedProducts}
                    />
                    <FormHelperText>
                      {errors.needProducts?.message}
                    </FormHelperText>
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid sm={12} md={6} lg={6}>
            <Card>
              <CardHeader
                title="ข้อเสนอ (ของที่จะได้)"
                action={
                  <Button
                    startIcon={<AddTwoTone />}
                    size="small"
                    variant="outlined"
                    onClick={() => setModalOfferOpen(true)}
                    disabled={disabled}
                  >
                    เพิ่ม
                  </Button>
                }
              />
              <Divider />
              <CardContent>
                <Stack spacing={2}>
                  <FormControl error={!!errors.offerProducts}>
                    <ProductTable
                      products={offerProducts}
                      setProducts={setOfferProducts}
                    />
                    <FormHelperText>
                      {errors.offerProducts?.message}
                    </FormHelperText>
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Card>
          <CardHeader
            title="ข้อมูลข้อเสนอ"
            action={
              <Tooltip title="สร้างรายละเอียดข้อเสนออัตโนมัติ">
                <IconButton
                  color="primary"
                  disabled={
                    needProducts.length === 0 ||
                    offerProducts.length === 0 ||
                    aiGeneratePromotionOfferInfo.isPending ||
                    disabled
                  }
                  onClick={() => aiGeneratePromotionOfferInfo.mutate()}
                >
                  <AutoAwesomeTwoTone />
                </IconButton>
              </Tooltip>
            }
          />
          <Divider />
          <CardContent>
            <Stack spacing={2}>
              <TextField
                label="ชื่อข้อเสนอ"
                variant="outlined"
                fullWidth
                disabled={disabled || aiGeneratePromotionOfferInfo.isPending}
                {...register("title")}
              />
              <TextField
                label="รายละเอียดข้อเสนอ"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                disabled={disabled || aiGeneratePromotionOfferInfo.isPending}
                error={errors.description != undefined}
                helperText={errors.description?.message}
                {...register("description")}
              />
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="อื่นๆ" />
          <Divider />
          <CardContent>
            <Stack
              spacing={2}
              justifyContent={"space-between"}
              alignItems={"flex-end"}
              direction={"row"}
            >
              <Stack spacing={2} direction={"row"}>
                <FormControl>
                  <InputLabel id="status">สถานะ</InputLabel>
                  <Select
                    labelId="status"
                    label="สถานะ"
                    value={status}
                    disabled={disabled}
                    onChange={(e) =>
                      setStatus(e.target.value as PromotionStatus)
                    }
                  >
                    <MenuItem value="scheduled">กำหนดเวลาเผยแพร่</MenuItem>
                    <MenuItem value="immediate">เผยแพร่ทันที</MenuItem>
                  </Select>
                </FormControl>
                {status === PromotionStatus.SCHEDULED && (
                  <FormControl error={!!errors.start_at}>
                    <DatePicker
                      name="start"
                      format="DD/MM/YYYY"
                      label="วันเริ่มต้น"
                      value={dayjs(getValues().start_at)}
                      disabled={disabled}
                      onChange={(date) =>
                        setValue("start_at", new Date(date as any))
                      }
                      disablePast
                    />
                    <FormHelperText>{errors.start_at?.message}</FormHelperText>
                  </FormControl>
                )}
                <FormControl error={!!errors.end_at}>
                  <DatePicker
                    name="end"
                    format="DD/MM/YYYY"
                    label="สิ้นสุด"
                    minDate={dayjs(getValues().start_at).add(1, "day")}
                    value={dayjs(getValues().end_at)}
                    disabled={disabled}
                    onChange={(date) =>
                      setValue("end_at", new Date(date as any))
                    }
                    disablePast
                  />
                  <FormHelperText>{errors.end_at?.message}</FormHelperText>
                </FormControl>
              </Stack>
              <div>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  type="submit"
                  disabled={disabled}
                >
                  บันทึกข้อเสนอ
                </Button>
              </div>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <AddProductDialog
        title="เพิ่มสินค้าที่ต้องการ"
        onSubmit={onAddProductNeed}
        open={modalNeedOpen}
        onClose={() => setModalNeedOpen(false)}
      />
      <AddProductDialog
        title="เพิ่มสินค้าข้อเสนอ"
        onSubmit={onAddProductOffer}
        open={modalOfferOpen}
        onClose={() => setModalOfferOpen(false)}
      />
    </>
  );
};

export default FormBuyXGetY;
