import findProductById from "@/actions/product/findById";
import useFormValidate from "@/hooks/useFormValidate";
import { useInterface } from "@/providers/InterfaceProvider";
import { AddProductDialogValues } from "@/schema/Promotion/AddProductToOffer";
import {
  AddPromotionOfferSchema,
  AddPromotionOfferValues,
  UpdatePromotionOfferSchema,
} from "@/schema/Promotion/Offer";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddTwoTone } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import z from "zod";
import AddProductDialog from "./components/AddProductDialog";
import ProductTable, { ProductTableRow } from "./components/ProductTable";

enum PromotionStatus {
  SCHEDULED = "scheduled",
  IMMEDIATE = "immediate",
}

export interface FormBuyXGetYProps {
  isLoading?: boolean;
  disabled?: boolean;
  onSubmit: (data: AddPromotionOfferValues) => void;
  buyXgetY?: {
    note?: string;
    needProducts: ProductTableRow[];
    offerProducts: ProductTableRow[];
    start_at: Date;
    end_at: Date;
  };
}

const FormBuyXGetY = ({ isLoading, ...props }: FormBuyXGetYProps) => {
  const t = useTranslations("PROMOTIONS.buyXgetY");
  const startAt = dayjs(props.buyXgetY?.start_at);
  const endAt = dayjs(props.buyXgetY?.end_at);
  const isInProgress = dayjs().isBetween(startAt, endAt);
  const isStarted = isInProgress || dayjs().isAfter(startAt);
  const isEnded = dayjs().isAfter(endAt);

  const [modalNeedOpen, setModalNeedOpen] = useState(false);
  const [modalOfferOpen, setModalOfferOpen] = useState(false);
  const [needProducts, setNeedProducts] = useState<ProductTableRow[]>(
    props.buyXgetY?.needProducts || []
  );
  const [offerProducts, setOfferProducts] = useState<ProductTableRow[]>(
    props.buyXgetY?.offerProducts || []
  );
  const [status, setStatus] = useState<PromotionStatus>(
    props.buyXgetY ? PromotionStatus.SCHEDULED : PromotionStatus.IMMEDIATE
  );
  const { setBackdrop } = useInterface();
  const schema = props.buyXgetY
    ? UpdatePromotionOfferSchema
    : AddPromotionOfferSchema;

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
  } = useFormValidate<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      note: props.buyXgetY?.note || "",
      needProducts: props.buyXgetY?.needProducts || [],
      offerProducts: props.buyXgetY?.offerProducts || [],
      start_at: props.buyXgetY?.start_at || dayjs().toDate(),
      end_at: props.buyXgetY?.end_at || dayjs().add(7, "day").toDate(),
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

      enqueueSnackbar(t("add_product_dialog.success"), {
        variant: "success",
      });
      setModalNeedOpen(false);
      setModalOfferOpen(false);
    } catch (error) {
      console.error("error adding product to promotion offer: ", error);
      enqueueSnackbar(t("add_product_dialog.error"), {
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
  }, [needProducts, offerProducts, setValue]);

  useEffect(() => {
    if (status === PromotionStatus.IMMEDIATE) {
      const now = new Date();
      setValue("start_at", now);
    }
  }, [status, setValue]);

  const disabled = isLoading || props.disabled;

  return (
    <>
      <Stack
        spacing={2}
        component={"form"}
        onSubmit={handleSubmit(props.onSubmit)}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <Card>
              <CardHeader
                title={t("cards.need_products.title")}
                action={
                  <Button
                    startIcon={<AddTwoTone />}
                    size="small"
                    variant="outlined"
                    onClick={() => setModalNeedOpen(true)}
                    disabled={disabled || isStarted}
                  >
                    {t("cards.need_products.add")}
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
                      disabled={disabled || isStarted}
                    />
                    <FormHelperText>
                      {errors.needProducts?.message ||
                        (isStarted && t("cards.need_products.started_helper"))}
                    </FormHelperText>
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <Card>
              <CardHeader
                title={t("cards.offer_products.title")}
                action={
                  <Button
                    startIcon={<AddTwoTone />}
                    size="small"
                    variant="outlined"
                    onClick={() => setModalOfferOpen(true)}
                    disabled={disabled || isStarted}
                  >
                    {t("cards.offer_products.add")}
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
                      disabled={disabled || isStarted}
                    />
                    <FormHelperText>
                      {errors.offerProducts?.message ||
                        (isStarted && t("cards.offer_products.started_helper"))}
                    </FormHelperText>
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Card>
          <CardHeader title={t("cards.note.title")} />
          <Divider />
          <CardContent>
            <Stack spacing={2}>
              <TextField
                label={t("cards.note.label")}
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                disabled={disabled}
                error={errors.note != undefined}
                helperText={errors.note?.message}
                {...register("note")}
              />
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title={t("cards.others.title")} />
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
                  <InputLabel id="status">
                    {t("cards.others.status")}
                  </InputLabel>
                  <Select
                    labelId="status"
                    label={t("cards.others.status")}
                    value={status}
                    disabled={disabled || isStarted}
                    onChange={(e) =>
                      setStatus(e.target.value as PromotionStatus)
                    }
                  >
                    <MenuItem value="scheduled">
                      {t("cards.others.status_options.scheduled")}
                    </MenuItem>
                    <MenuItem value="immediate">
                      {t("cards.others.status_options.immediate")}
                    </MenuItem>
                  </Select>
                </FormControl>
                {status === PromotionStatus.SCHEDULED && (
                  <FormControl error={!!errors.start_at}>
                    <DatePicker
                      name="start"
                      format="DD/MM/YYYY"
                      label={t("cards.others.start_date")}
                      value={dayjs(getValues().start_at)}
                      disabled={disabled || isStarted}
                      onChange={(date) =>
                        setValue("start_at", new Date(date as any))
                      }
                      disablePast={!props.buyXgetY}
                    />
                    <FormHelperText>
                      {errors.start_at?.message ||
                        (isStarted &&
                          t("cards.others.started_start_date_helper"))}
                    </FormHelperText>
                  </FormControl>
                )}
                <FormControl error={!!errors.end_at}>
                  <DatePicker
                    name="end"
                    format="DD/MM/YYYY"
                    label={t("cards.others.end_date")}
                    minDate={dayjs(getValues().start_at).add(1, "day")}
                    value={dayjs(getValues().end_at)}
                    disabled={disabled || isEnded}
                    onChange={(date) =>
                      setValue("end_at", new Date(date as any))
                    }
                    disablePast={!props.buyXgetY}
                  />
                  <FormHelperText>
                    {errors.end_at?.message ||
                      (isEnded && t("cards.others.ended_end_date_helper"))}
                  </FormHelperText>
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
                  {t("submit")}
                </Button>
              </div>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <AddProductDialog
        title={t("add_product_dialog.title_need")}
        onSubmit={onAddProductNeed}
        open={modalNeedOpen}
        onClose={() => setModalNeedOpen(false)}
      />
      <AddProductDialog
        title={t("add_product_dialog.title_offer")}
        onSubmit={onAddProductOffer}
        open={modalOfferOpen}
        onClose={() => setModalOfferOpen(false)}
      />
    </>
  );
};

export default FormBuyXGetY;
