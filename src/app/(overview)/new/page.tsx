"use client";

import getZipcodeDetails, {
  ZipcodeDetails,
} from "@/actions/address/getZipcodeDetails";
import { ZipcodeOption } from "@/actions/address/getZipcodes";
import createStore from "@/actions/store/createStore";
import CountrySelector from "@/components/Selector/CountrySelector";
import ZipcodeSelector from "@/components/Selector/ZipcodeSelector";
import App, { Wrapper } from "@/layouts/App";
import AppHeader from "@/layouts/App/Header";
import { getPath } from "@/router";
import { CreateStoreSchema, CreateStoreValues } from "@/schema/Store";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyleOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

// Slug generator function
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9\s-]/g, "")
    .replaceAll(/\s+/g, "-")
    .replaceAll(/-+/g, "-")
    .replaceAll(/(?:^-+)|(?:-+$)/g, "");
}

export default function CreateStorePage() {
  const t = useTranslations("OVERVIEW.createStore");
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedZipcode, setSelectedZipcode] = useState<ZipcodeOption | null>(
    null,
  );
  const [zipcodeDetails, setZipcodeDetails] = useState<ZipcodeDetails | null>(
    null,
  );

  const form = useForm<CreateStoreValues>({
    resolver: zodResolver(CreateStoreSchema),
    defaultValues: {
      projectName: "",
      slug: "",
      storeName: "",
      address: undefined,
    },
  });

  // Watch project name for auto slug generation
  const projectName = form.watch("projectName");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (!isSlugManuallyEdited && projectName) {
      form.setValue("slug", generateSlug(projectName));
    }
  }, [projectName, isSlugManuallyEdited, form]);

  // Load zipcode details when selected
  useEffect(() => {
    if (selectedZipcode) {
      getZipcodeDetails(selectedZipcode.id).then((details) => {
        setZipcodeDetails(details);
        if (details) {
          form.setValue("address", {
            subDistrictId: details.subDistrict.id,
            zipcodeSnapshot: details.code,
          });
        }
      });
    } else {
      setZipcodeDetails(null);
      form.setValue("address", undefined);
    }
  }, [selectedZipcode, form]);

  const mutation = useMutation({
    mutationFn: createStore,
    onSuccess: (result) => {
      if (result.success && result.storeId) {
        enqueueSnackbar(t("action.success"), { variant: "success" });
        queryClient.invalidateQueries({ queryKey: ["stores"] });
        router.push(
          getPath("projects.store.dashboard", { store: result.storeId }),
        );
      } else {
        enqueueSnackbar(result.error || t("action.error"), {
          variant: "error",
        });
      }
    },
    onError: () => {
      enqueueSnackbar(t("action.error"), { variant: "error" });
    },
  });

  const onSubmit = (data: CreateStoreValues) => {
    // Include address line if provided
    if (data.address && zipcodeDetails) {
      const addressLine = form.getValues("address.addressLine");
      data.address.addressLine = addressLine;
    }
    mutation.mutateAsync(data);
  };

  return (
    <Wrapper>
      <AppHeader>
        <AppHeader.Title subtitle={t("subtitle")}>{t("title")}</AppHeader.Title>
      </AppHeader>
      <App.Main>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {/* Card #1: Project Info */}
            <Card variant="outlined">
              <CardHeader title={t("project_info.title")} />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid size={6}>
                    <TextField
                      label={t("project_info.project_name")}
                      fullWidth
                      {...form.register("projectName")}
                      error={!!form.formState.errors.projectName}
                      helperText={
                        form.formState.errors.projectName?.message ||
                        t("project_info.project_name_helper")
                      }
                      disabled={mutation.isPending}
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label={t("project_info.slug")}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <StyleOutlined />
                            </InputAdornment>
                          ),
                        },
                      }}
                      fullWidth
                      {...form.register("slug", {
                        onChange: () => setIsSlugManuallyEdited(true),
                      })}
                      error={!!form.formState.errors.slug}
                      helperText={
                        form.formState.errors.slug?.message ||
                        t("project_info.slug_helper")
                      }
                      disabled={mutation.isPending}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Card #2: Store Info */}
            <Card variant="outlined">
              <CardHeader title={t("store_info.title")} />
              <CardContent>
                <TextField
                  label={t("store_info.store_name")}
                  fullWidth
                  {...form.register("storeName")}
                  error={!!form.formState.errors.storeName}
                  helperText={form.formState.errors.storeName?.message}
                  disabled={mutation.isPending}
                />
              </CardContent>
            </Card>

            {/* Card #3: Store Address (Optional) */}
            <Card variant="outlined">
              <CardHeader title={t("address.title")} />
              <CardContent>
                <Stack spacing={3}>
                  {/* Country - Fixed to Thailand using CountrySelector */}
                  <CountrySelector
                    label={t("address.country")}
                    defaultValue={1} // Thailand
                    disabled
                  />

                  {/* Zipcode Selector */}
                  <ZipcodeSelector
                    label={t("address.zipcode")}
                    disabled={mutation.isPending}
                    onSubmit={(zipcode) => setSelectedZipcode(zipcode)}
                  />

                  {/* Location details (auto-filled) */}
                  {zipcodeDetails && (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                        gap: 2,
                      }}
                    >
                      <TextField
                        label={t("address.province")}
                        value={zipcodeDetails.province.name}
                        disabled
                        fullWidth
                      />
                      <TextField
                        label={t("address.district")}
                        value={zipcodeDetails.district.name}
                        disabled
                        fullWidth
                      />
                      <TextField
                        label={t("address.sub_district")}
                        value={zipcodeDetails.subDistrict.name}
                        disabled
                        fullWidth
                      />
                    </Box>
                  )}

                  {/* Address Line */}
                  <Controller
                    name="address.addressLine"
                    control={form.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("address.address_line")}
                        fullWidth
                        multiline
                        rows={3}
                        disabled={mutation.isPending || !selectedZipcode}
                        placeholder={
                          selectedZipcode
                            ? undefined
                            : "กรุณาเลือกรหัสไปรษณีย์ก่อน"
                        }
                      />
                    )}
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Card #4: Action */}
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    type="submit"
                    loading={mutation.isPending}
                  >
                    {mutation.isPending
                      ? t("action.submitting")
                      : t("action.submit")}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </form>
      </App.Main>
    </Wrapper>
  );
}
