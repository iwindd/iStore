import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";
import {
  addProductToCartBySerial,
  cashoutCart,
  consignmentCart,
} from "./cart.thunks";

export const cartListenerMiddleware = createListenerMiddleware();

// Listener for addProductToCartBySerial.rejected
export const cartAddProductToCartBySerialRejectedListener =
  createListenerMiddleware();

cartAddProductToCartBySerialRejectedListener.startListening({
  actionCreator: addProductToCartBySerial.rejected,
  effect: async (action) => {
    enqueueSnackbar("CASHIER.cart.messages.unknown", {
      variant: "intlError",
      preventDuplicate: true,
      key: "scanner-error",
    });
  },
});

// Cashout

cartListenerMiddleware.startListening({
  matcher: isAnyOf(cashoutCart.rejected, consignmentCart.rejected),
  effect: async () => {
    enqueueSnackbar("CASHIER.cart.messages.unknown", {
      variant: "intlError",
      key: "checkout-error",
      preventDuplicate: true,
    });
  },
});

cartListenerMiddleware.startListening({
  actionCreator: cashoutCart.fulfilled,
  effect: async () => {
    enqueueSnackbar("CASHIER.cart.messages.cashout_success", {
      variant: "intlSuccess",
    });
  },
});

// Consignment

cartListenerMiddleware.startListening({
  actionCreator: consignmentCart.fulfilled,
  effect: async () => {
    enqueueSnackbar("CASHIER.cart.messages.consignment_success", {
      variant: "intlSuccess",
    });
  },
});
