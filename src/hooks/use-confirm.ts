import { ConfirmationDialog } from '@/components/core/dialog/confirmation';
import { ButtonOwnProps } from '@mui/material';
import * as React from 'react';

interface ConfirmController<T> {
  handleOpen: () => void;
  handleClose: () => void;

  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setText: React.Dispatch<React.SetStateAction<string>>;
  setLConfirm: React.Dispatch<React.SetStateAction<string>>;
  setLCancel: React.Dispatch<React.SetStateAction<string>>;
  with: React.Dispatch<React.SetStateAction<any>>;

  props: {
    title: string,
    text: string,
    cancel?: string,
    confirm?: string,
    open: boolean;
    onClose: () => void;
    onConfirm : (...args : any) => Promise<any>;
    data: any;
    confirmProps?: ButtonOwnProps;
  }
}

interface ConfirmDialogProps {
  title: string,
  text: string,
  cancel?: string,
  confirm?: string,
  confirmProps?: ButtonOwnProps,
  onConfirm: (...args : any) => Promise<any>
}

export const Confirmation = ConfirmationDialog

export function useConfirm<T = HTMLElement>(props: ConfirmDialogProps): ConfirmController<T> {
  const [open, setOpen] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>(props.title);
  const [text, setText] = React.useState<string>(props.text);
  const [cancel, setLCancel] = React.useState<string>(props.cancel || "ยกเลิก");
  const [confirm, setLConfirm] = React.useState<string>(props.confirm || "ยืนยัน");
  const [data, setData] = React.useState<any>([]);
  const setData_ = (...args : any) => setData(args)

  const handleOpen = React.useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  return {
    handleClose,
    handleOpen,
    setTitle,
    setText,
    setLCancel, setLConfirm,
    with: setData_,
    props: {title, text, cancel, confirm, open, onClose : handleClose, onConfirm: props.onConfirm, data, confirmProps: props.confirmProps || {}}
  };
}
