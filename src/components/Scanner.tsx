"use client";
import { TextField } from "@mui/material";
import React, { useEffect } from "react";

interface ScannerProps {
  onSubmit(serial: string): void;
}

const Scanner = (props: ScannerProps) => {
  const ref = React.useRef<HTMLInputElement | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (ref.current) {
      const value = ref.current.value;
      console.log(value);
      props.onSubmit(value);
      ref.current.focus();
      ref.current.value = "";
    }
  };

  useEffect(() => {
    if (ref.current) ref.current.focus();
  }, [ref]);

  return (
    <form onSubmit={onSubmit}>
      <TextField autoFocus fullWidth label="รหัสสินค้า" inputRef={ref} />

      <input type="submit" hidden />
    </form>
  );
};

export default Scanner;
