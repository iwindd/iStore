"use client";
import CreateProduct from "@/actions/product/create";
import GetProduct from "@/actions/product/find";
import { ProductDatatableInstance } from "@/actions/product/getProductDatatable";
import recoveryProduct from "@/actions/product/recoveryProduct";
import { ProductPermissionEnum } from "@/enums/permission";
import { useAuth } from "@/hooks/use-auth";
import { useDialog } from "@/hooks/use-dialog";
import { randomEan } from "@/libs/ean";
import { useInterface } from "@/providers/InterfaceProvider";
import { getPath } from "@/router";
import {
  ProductFindSchema,
  ProductFindValues,
  ProductSchema,
  ProductValues,
} from "@/schema/Product";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddTwoTone,
  Rotate90DegreesCcw,
  SaveTwoTone,
  SearchTwoTone,
} from "@mui/icons-material";
import {
  Alert,
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
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface AddDialogProps {
  onClose: () => void;
  open: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SearchDialogProps extends AddDialogProps {
  onSubmit: (product?: ProductDatatableInstance) => void;
}

export interface ProductFormDialogProps extends AddDialogProps {
  product: ProductDatatableInstance | null;
}

function SearchDialog({
  open,
  onClose,
  onSubmit,
  setLoading,
}: Readonly<SearchDialogProps>): React.JSX.Element {
  const t = useTranslations("PRODUCTS.search_dialog");
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

  const searchSubmit: SubmitHandler<ProductFindValues> = async (
    payload: ProductFindValues,
  ) => {
    setLoading(true);

    try {
      const resp = await GetProduct(payload.serial, true);
      if (!resp.success) throw new Error("not_found");
      onSubmit(resp?.data || ({ serial: payload.serial } as Product));
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t("error"), {
        variant: "error",
      });
    } finally {
      reset();
      setLoading(false);
    }
  };

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
      slotProps={{
        paper: {
          component: "form",
          onSubmit: (e: React.FormEvent) => {
            handleSubmit(searchSubmit)(e);
          },
        },
      }}
    >
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 2 }}>
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
        <Button variant="contained" startIcon={<SearchTwoTone />} type="submit">
          {t("search")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function ProductFormDialog({
  open,
  setLoading,
  onClose,
  product,
}: Readonly<ProductFormDialogProps>): React.JSX.Element {
  const t = useTranslations("PRODUCTS.form_dialog");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductValues>({
    resolver: zodResolver(ProductSchema),
  });

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (product) {
      reset({
        serial: product.serial,
        label: product.label,
      });
    }
  }, [product]);

  const submitProduct: SubmitHandler<ProductValues> = async (
    payload: ProductValues,
  ) => {
    try {
      if (product?.deleted_at) {
        const resp = await recoveryProduct(product.id);
        if (!resp.success) throw new Error("error");
        router.push(getPath("products.product", { id: product.id.toString() }));
      } else {
        const resp = await CreateProduct(payload);
        if (!resp.success) throw new Error(resp.message);
        router.push(
          getPath("products.product", { id: resp?.data?.id.toString() }),
        );
      }

      reset();
      await queryClient.refetchQueries({
        queryKey: ["products"],
        type: "active",
      });
      enqueueSnackbar(t("save_success"), { variant: "success" });
      onClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t("save_error"), {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
        onClose();
      }}
      disableAutoFocus
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          component: "form",
          onSubmit: (e: React.FormEvent) => {
            handleSubmit(submitProduct)(e);
          },
        },
      }}
    >
      <DialogTitle>
        {product?.label ? t("edit_title") : t("add_title")}
      </DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 2 }} spacing={1}>
          <TextField
            fullWidth
            label={t("label")}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            disabled={product?.deleted_at != null}
            placeholder={t("placeholder")}
            error={errors["label"] !== undefined}
            helperText={
              errors["label"]?.message ??
              t("serial_helper", { serial: product?.serial ?? "" })
            }
            {...register("label")}
            autoFocus
          />
          {product?.id && product?.deleted_at != null && (
            <Alert color="error">{t("deleted_alert")}</Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveTwoTone />}
          color="success"
          type="submit"
          sx={{
            display:
              product?.id && !user?.hasPermission(ProductPermissionEnum.UPDATE)
                ? "none"
                : "",
          }}
        >
          {product?.deleted_at ? t("recovery") : t("save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const AddController = () => {
  const t = useTranslations("PRODUCTS");
  const [product, setProduct] = useState<Product | null>(null);
  const { setBackdrop, isBackdrop } = useInterface();
  const [isSearch, setIsSearch] = useState<boolean>(true);
  const { user } = useAuth();
  const dialogInfo = useDialog();

  const onOpen = () => {
    setIsSearch(true);
    dialogInfo.handleOpen();
  };

  const onClose = () => {
    setProduct(null);
    dialogInfo.handleClose();
  };

  const onSubmit = (foundProduct?: Product) => {
    setProduct(foundProduct ?? null);
    setIsSearch(false);
  };

  if (!user) return null;
  if (!user.hasPermission(ProductPermissionEnum.CREATE)) return null;

  return (
    <>
      <Button
        startIcon={<AddTwoTone />}
        variant="contained"
        onClick={onOpen}
        size="small"
      >
        {t("add_button")}
      </Button>

      <SearchDialog
        open={dialogInfo.open && !isBackdrop && isSearch}
        onClose={onClose}
        setLoading={setBackdrop}
        onSubmit={onSubmit}
      />
      <ProductFormDialog
        open={dialogInfo.open && !isBackdrop && !isSearch}
        onClose={onClose}
        setLoading={setBackdrop}
        product={product}
      />
    </>
  );
};

export default AddController;
