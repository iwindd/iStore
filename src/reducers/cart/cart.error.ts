import { AsyncThunkConfig, GetThunkAPI } from "@reduxjs/toolkit";
import { cartSlice } from "./cart.slice";
import { CartEvent } from "./cart.types";

export class CartError extends Error {
  readonly code: CartEvent;
  readonly meta?: Record<string, string | number | Date>;

  constructor(
    code: CartEvent,
    dispatch: GetThunkAPI<AsyncThunkConfig>["dispatch"],
    meta?: Record<string, string | number | Date>,
  ) {
    super(code);
    this.name = "CartError";
    this.code = code;
    this.meta = meta;

    dispatch(
      cartSlice.actions.enqueueSnackbar({
        message: code,
        variant: "intlError",
        key: "scanner-error",
        values: meta,
        formats: {},
      }),
    );
  }
}
