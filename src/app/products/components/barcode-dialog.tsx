import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { Product } from '@prisma/client'
import React from 'react'

const BarcodeDialog = ({
  product,
  open,
  onClose: handleClose
}:{
  product: Product | null,
  open: boolean,
  onClose: (event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>) => void
}) => {
  return (
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {(product && product.label) ? `${product.label}` : 'บาร์โค้ดของสินค้า'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            TODO:: RENDER BARCODE HERE
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color='secondary' onClick={handleClose} autoFocus>ปิด</Button>
        </DialogActions>
      </Dialog>
  )
}

export default BarcodeDialog