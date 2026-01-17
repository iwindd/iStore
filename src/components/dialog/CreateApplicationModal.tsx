"use client";
import { getPath } from "@/router";
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
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateApplicationModal = ({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
}) => {
  const t = useTranslations("APPLICATIONS.create_modal");
  const [applicationType, setApplicationType] = useState<string>("line");
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (applicationType === "line") {
      router.push(getPath("applications.line.create"));
    } else {
      console.log("Unknown application type");
    }
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
              <InputLabel id="application-type">{t("type_label")}</InputLabel>
              <Select
                value={applicationType}
                labelId="application-type"
                label={t("type_label")}
                onChange={(e) => setApplicationType(e.target.value)}
              >
                <MenuItem value="line">Line</MenuItem>
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

export default CreateApplicationModal;
