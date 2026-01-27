"use client";
import { useRoute } from "@/hooks/use-route";
import { ArrowForwardIosTwoTone } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";

const CreatePromotionModal = ({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
}) => {
  const t = useTranslations("PROMOTIONS.create_modal");
  const [promotionType, setPromotionType] = useState<string>("offer");
  const route = useRoute();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (promotionType === "offer") {
      return route.push("projects.store.promotions.create.buyXgetY");
    }
    console.log("Unknown promotion type");
  };

  const onClose = handleClose;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit,
        },
      }}
    >
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 2 }}>
          <Stack flexDirection={"column"} spacing={1}>
            <FormControl>
              <InputLabel id="promotion-type">{t("type_label")}</InputLabel>
              <Select
                value={promotionType}
                labelId="promotion-type"
                label={t("type_label")}
                onChange={(e) => setPromotionType(e.target.value)}
              >
                <MenuItem value="offer">{t("types.buyXgetY")}</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" type="button" onClick={onClose}>
          {t("close")}
        </Button>
        <Button
          variant="contained"
          color="success"
          endIcon={<ArrowForwardIosTwoTone />}
          type="submit"
        >
          {t("submit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePromotionModal;
