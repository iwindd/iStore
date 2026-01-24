"use client";
import findProductToCreate from "@/actions/product/findProductToCreate";
import { randomEan } from "@/libs/ean";
import { ProductFindSchema, ProductFindValues } from "@/schema/Product";
import { zodResolver } from "@hookform/resolvers/zod";
import { Rotate90DegreesCcw, SearchTwoTone } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useSnackbar } from "notistack";
import React from "react";
import { useForm } from "react-hook-form";
import { SearchDialogProps } from "./types";

const SearchDialog = ({
  open,
  onClose,
  onSubmit,
}: Readonly<SearchDialogProps>): React.JSX.Element => {
  const t = useTranslations("PRODUCTS.search_dialog");
  const params = useParams<{ store: string }>();
  const [isRandomSerial, setIsRandomSerial] = React.useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<ProductFindValues>({
    resolver: zodResolver(ProductFindSchema),
  });

  const { enqueueSnackbar } = useSnackbar();

  const findProductMutation = useMutation({
    mutationFn: async (payload: ProductFindValues) => {
      const resp = await findProductToCreate(params.store, payload.serial);
      if (!resp.success) throw new Error("not_found");
      return resp?.data;
    },
    onSuccess: (data) => {
      const product = data || {
        serial: watch("serial"),
      };

      onSubmit(product as any);
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar(t("error"), {
        variant: "error",
      });
    },
  });

  const random = () => {
    const randomSerial = randomEan();
    setValue("serial", randomSerial);
    setIsRandomSerial(randomSerial);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      disableRestoreFocus
      disableEscapeKeyDown
    >
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogContent>
        <Stack
          sx={{ mt: 2 }}
          id="form-search-dialog"
          component="form"
          onSubmit={handleSubmit((data) => findProductMutation.mutate(data))}
        >
          <TextField
            label={t("serial")}
            {...register("serial")}
            autoFocus
            placeholder={t("placeholder")}
            error={errors["serial"] != undefined}
            helperText={
              errors["serial"]?.message ||
              (isRandomSerial == watch("serial") && t("random_helper"))
            }
            disabled={findProductMutation.isPending}
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={t("random_tooltip")}>
                      <IconButton onClick={random}>
                        <Rotate90DegreesCcw />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              },

              inputLabel: { shrink: true },
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleClose}>
          {t("cancel")}
        </Button>
        <Button
          variant="contained"
          startIcon={<SearchTwoTone />}
          type="submit"
          form="form-search-dialog"
          loading={findProductMutation.isPending}
        >
          {t("search")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SearchDialog;
