"use client";
import { Checkbox, FormControlLabel, Stack, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { ImportControllerProps, ImportType } from "../type";

const MinStockController = ({ setPayload }: ImportControllerProps) => {
  const [isCheck, setIsCheck] = React.useState<boolean>(true);
  const [value, setValue] = React.useState<string>();

  const onCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheck(event.target.checked);
  };

  useEffect(() => {
    setPayload({
      type: ImportType.FromMinStock,
      product_min_stock: isCheck,
      value: +(value || 10),
    });
  }, [isCheck, value, setPayload]);

  return (
    <Stack>
      <TextField
        type="number"
        label="จำนวนขั้นต่ำ"
        value={isCheck ? "" : value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isCheck}
        variant="standard"
      />
      <FormControlLabel
        control={<Checkbox defaultChecked onChange={onCheckChange} />}
        label="ใช้สต๊อกขั้นต่ำของสินค้า"
      />
    </Stack>
  );
};

export default MinStockController;
