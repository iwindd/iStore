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
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import ProductArrayField from "./components/ProductArrayField";

enum PromotionStatus {
  SCHEDULED = "scheduled",
  IMMEDIATE = "immediate",
}

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
  const isInProgress = dayjs().isBetween(startAt, endAt);
  const isStarted = isInProgress || dayjs().isAfter(startAt);
  const isEnded = dayjs().isAfter(endAt);

  const [status, setStatus] = useState<PromotionStatus>(
    props.buyXgetY ? PromotionStatus.SCHEDULED : PromotionStatus.IMMEDIATE,
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
      start_at: props.buyXgetY?.start_at || dayjs().toDate(),
      end_at: props.buyXgetY?.end_at || dayjs().add(7, "day").toDate(),
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
    control,
  } = form;

  useEffect(() => {
    if (status === PromotionStatus.IMMEDIATE) {
      const now = new Date();
      setValue("start_at", now);
    }
  }, [status, setValue]);

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
    </FormProvider>
  );
};

export default FormBuyXGetY;
