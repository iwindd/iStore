"use client";

import createStore from "@/actions/store/createStore";
import { StoreSchema, StoreValues } from "@/schema/Store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { useForm } from "react-hook-form";

interface CreateStoreDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateStoreDialog({
  open,
  onClose,
}: Readonly<CreateStoreDialogProps>) {
  const queryClient = useQueryClient();
  const t = useTranslations("OVERVIEW.create_card.dialog");

  const form = useForm<StoreValues>({
    resolver: zodResolver(StoreSchema),
    defaultValues: {
      name: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createStore,
    onSuccess: (result) => {
      onClose();
      enqueueSnackbar(t("success"), { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
    onError: (error) => {
      enqueueSnackbar(t("error"), {
        variant: "error",
      });
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={form.handleSubmit((data) => mutation.mutateAsync(data))}>
        <DialogTitle>{t("title")}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t("subtitle")}
            </Typography>
            <TextField
              label={t("name_label")}
              variant="outlined"
              fullWidth
              {...form.register("name")}
              disabled={mutation.isPending}
              error={!!form.formState.errors.name}
              helperText={form.formState.errors.name?.message}
              autoFocus
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={onClose}
            disabled={mutation.isPending}
            color="inherit"
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            loading={mutation.isPending}
          >
            {t("submit")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
