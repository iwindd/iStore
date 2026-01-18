import { DownloadTwoTone } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";
import Barcode from "react-barcode";

const BarcodeDialog = ({
  product,
  open,
  onClose: handleClose,
}: {
  product: {
    serial: string;
    label: string;
  } | null;
  open: boolean;
  onClose: (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLDivElement>,
  ) => void;
}) => {
  const t = useTranslations("PRODUCTS.barcode_dialog");
  const barcodeRef = React.useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const canvas = barcodeRef.current?.querySelector("canvas");
    if (!canvas) return console.log("No barcode canvas found");

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `${product?.label || "barcode"}.png`;
    link.click();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      disableRestoreFocus
    >
      <DialogTitle>
        {product?.label ? `${product.label}` : t("title")}
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: 1,
        }}
      >
        <div ref={barcodeRef}>
          {product?.serial ? (
            <Barcode value={product.serial} format="EAN13" renderer="canvas" />
          ) : (
            <Typography>{t("no_barcode")}</Typography>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" size="small" onClick={handleClose}>
          {t("close")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          size="small"
          disabled={!product?.serial}
          autoFocus
          startIcon={<DownloadTwoTone />}
        >
          {t("download")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BarcodeDialog;
