import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Product } from "@prisma/client";
import Barcode from "react-barcode";
import React from "react";
import { DownloadTwoTone } from "@mui/icons-material";

const BarcodeDialog = ({
  product,
  open,
  onClose: handleClose,
}: {
  product: Product | null;
  open: boolean;
  onClose: (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLDivElement>
  ) => void;
}) => {
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
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth disableRestoreFocus>
      <DialogTitle>{product && product.label ? `${product.label}` : "บาร์โค้ดของสินค้า"}</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: 1,
        }}
      >
        <div ref={barcodeRef}>
          {product && product.serial ? (
            <Barcode 
              value={product?.serial} 
              format="EAN13" 
              renderer="canvas"
            />
          ) : (
            <Typography>ไม่มีข้อมูลบาร์โค้ดสำหรับสินค้านี้</Typography>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" size="small" onClick={handleClose}>ปิด</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          size="small"
          disabled={!product || !product.serial}
          autoFocus
          startIcon={<DownloadTwoTone/>}
        >
          ดาวน์โหลด
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BarcodeDialog;
