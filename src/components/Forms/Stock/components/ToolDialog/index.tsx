"use client";
import ImportToolAction from "@/actions/stock/tool";
import StockReceiptImportSelect from "@/components/Select/StockReceiptImportSelect";
import { useInterface } from "@/providers/InterfaceProvider";
import { StockValues } from "@/schema/Stock";
import {
  StockReceiptImportSchema,
  StockReceiptImportType,
  StockReceiptImportValues,
} from "@/schema/StockReceiptImport";
import { zodResolver } from "@hookform/resolvers/zod";
import { PanToolAlt } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React from "react";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import MinStockController from "./components/MinStockController";

interface ToolDialogProps {
  onClose: () => void;
  open: boolean;
  form: UseFormReturn<StockValues>;
}

const ToolDialog = ({
  open,
  onClose,
  form,
}: ToolDialogProps): React.JSX.Element => {
  const t = useTranslations("STOCKS.tool_dialog");
  const { isBackdrop, setBackdrop } = useInterface();
  const params = useParams<{ store: string }>();

  const importToolMutation = useMutation({
    mutationFn: async (data: StockReceiptImportValues) =>
      await ImportToolAction(params.store, data),
    onSuccess: (data) => {
      form.setValue("products", data);
      enqueueSnackbar(t("success"), { variant: "success" });
      onClose();
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar(t("error"), {
        variant: "error",
      });
    },
    onSettled: () => {
      setBackdrop(false);
    },
  });

  const formTool = useForm<StockReceiptImportValues>({
    resolver: zodResolver(StockReceiptImportSchema),
    defaultValues: {
      type: StockReceiptImportType.FromMinStockAlert,
    },
  });

  const toolType = formTool.watch("type");

  return (
    <Dialog
      open={open && !isBackdrop}
      maxWidth="xs"
      onClose={onClose}
      fullWidth
      disableRestoreFocus
    >
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 2 }} spacing={1}>
          <Stack flexDirection={"column"} spacing={1}>
            <Controller
              name="type"
              control={formTool.control}
              render={({ field }) => <StockReceiptImportSelect {...field} />}
            />
          </Stack>
          {toolType === StockReceiptImportType.FromMinStockAlert ||
            (toolType === StockReceiptImportType.FromMinStockValue && (
              <MinStockController formTool={formTool} />
            ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack
          sx={{ width: "100%" }}
          direction={"row"}
          justifyContent={"end"}
          spacing={1}
        >
          <Button color="secondary" onClick={onClose}>
            {t("close")}
          </Button>
          <Button
            color="success"
            variant="contained"
            startIcon={<PanToolAlt />}
            onClick={formTool.handleSubmit((data) =>
              importToolMutation.mutate(data),
            )}
          >
            {t("confirm")}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default ToolDialog;
