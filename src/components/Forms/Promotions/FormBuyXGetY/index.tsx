"use client";
import {
  AddPromotionOfferSchema,
  AddPromotionOfferValues,
  UpdatePromotionOfferSchema,
} from "@/schema/Promotion/Offer";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  Stack,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import ProductArrayField from "./components/ProductArrayField";

export interface ProductTableRow {
  product: { id: number; serial: string; label: string };
  quantity: number;
}

export interface FormBuyXGetYProps {
  isLoading?: boolean;
  disabled?: boolean;
  onSubmit: (data: AddPromotionOfferValues) => void;
  buyXgetY?: {
    name?: string | null;
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
  const isInProgress = dayjs().isBetween(startAt, endAt) && !!props.buyXgetY;
  const isStarted =
    isInProgress || (dayjs().isAfter(startAt) && !!props.buyXgetY);
  const isEnded = dayjs().isAfter(endAt) && !!props.buyXgetY;

  const [startAtValue, setStartAtValue] = useState<Date>(
    props.buyXgetY?.start_at || dayjs().toDate(),
  );
  const [endAtValue, setEndAtValue] = useState<Date>(
    props.buyXgetY?.end_at || dayjs().add(7, "day").toDate(),
  );

  const schema = props.buyXgetY
    ? UpdatePromotionOfferSchema
    : AddPromotionOfferSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: (props.buyXgetY as any)?.name || "",
      note: props.buyXgetY?.note || "",
      needProducts: props.buyXgetY?.needProducts.map((p) => ({
        product_id: p.product.id,
        quantity: p.quantity,
      })) || [{ product_id: 0, quantity: 1 }],
      offerProducts: props.buyXgetY?.offerProducts.map((p) => ({
        product_id: p.product.id,
        quantity: p.quantity,
      })) || [{ product_id: 0, quantity: 1 }],
      start_at: startAtValue,
      end_at: endAtValue,
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
  } = form;

  useEffect(() => {
    setValue("start_at", startAtValue);
    setValue("end_at", endAtValue);
  }, [startAtValue, endAtValue, setValue]);

  const disabled = isLoading || props.disabled;

  return (
    <FormProvider {...form}>
      <Stack
        spacing={2}
        component={"form"}
        onSubmit={handleSubmit(props.onSubmit)}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <Card>
              <CardHeader title={t("cards.need_products.title")} />
              <CardContent sx={{ p: 0 }}>
                <FormControl error={!!errors.needProducts} fullWidth>
                  <ProductArrayField
                    name="needProducts"
                    control={control}
                    errors={errors}
                    disabled={disabled || isStarted}
                  />
                  <FormHelperText>
                    {(errors.needProducts as any)?.message ||
                      (isStarted && t("cards.need_products.started_helper"))}
                  </FormHelperText>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <Card>
              <CardHeader title={t("cards.offer_products.title")} />
              <CardContent sx={{ p: 0 }}>
                <FormControl error={!!errors.offerProducts} fullWidth>
                  <ProductArrayField
                    name="offerProducts"
                    control={control}
                    errors={errors}
                    disabled={disabled || isStarted}
                  />
                  <FormHelperText>
                    {(errors.offerProducts as any)?.message ||
                      (isStarted && t("cards.offer_products.started_helper"))}
                  </FormHelperText>
                </FormControl>
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
                label={t("cards.name.label")}
                variant="outlined"
                fullWidth
                disabled={disabled}
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register("name")}
              />
              <TextField
                label={t("cards.note.label")}
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                disabled={disabled}
                error={!!errors.note}
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
                <FormControl error={!!errors.start_at}>
                  <DatePicker
                    name="start"
                    format="DD/MM/YYYY"
                    label={t("cards.others.start_date")}
                    value={dayjs(startAtValue)}
                    onChange={(date) => setStartAtValue(new Date(date as any))}
                    disabled={disabled || isStarted}
                    disablePast={!props.buyXgetY}
                  />
                  <FormHelperText>
                    {errors.start_at?.message ||
                      (isStarted &&
                        t("cards.others.started_start_date_helper"))}
                  </FormHelperText>
                </FormControl>
                <FormControl error={!!errors.end_at}>
                  <DatePicker
                    name="end"
                    format="DD/MM/YYYY"
                    label={t("cards.others.end_date")}
                    minDate={dayjs(startAtValue).add(1, "day")}
                    value={dayjs(endAtValue)}
                    onChange={(date) => setEndAtValue(new Date(date as any))}
                    disabled={disabled || isEnded}
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
    </FormProvider>
  );
};

export default FormBuyXGetY;
