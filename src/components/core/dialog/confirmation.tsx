import * as React from 'react';
import { Button, ButtonOwnProps, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export interface ConfirmationProps {
  onClose: () => void;
  onConfirm: (...args: any) => void;
  open: boolean;
  title: string,
  text: string,
  cancel?: string,
  confirm?: string,
  confirmProps?: ButtonOwnProps,
  disableAutoClose?: boolean,
  data?: any
}

export function ConfirmationDialog({ onClose, onConfirm, disableAutoClose, open, title, text, cancel, confirm, data, confirmProps }: ConfirmationProps): React.JSX.Element {
  const handleConfirm = () => {
    if (!disableAutoClose) onClose();

    onConfirm(...(!data ? [] : data))
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        disableRestoreFocus
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent><DialogContentText>{text}</DialogContentText></DialogContent>
        <DialogActions>
          <Button size='small' color='secondary' onClick={onClose} >{cancel || "ยกเลิก"}</Button>
          <Button size='small' variant='contained' color='primary' {...confirmProps} autoFocus onClick={handleConfirm} >{confirm || "ยืนยัน"}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}