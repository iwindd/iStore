import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";
import {
  addProductToCartBySerial,
  cashoutCart,
  consignmentCart,
} from "./cart.thunks";
import { CartEvent } from "./cart.types";

export const cartListenerMiddleware = createListenerMiddleware();

// Listener for addProductToCartBySerial.rejected
export const cartAddProductToCartBySerialRejectedListener =
  createListenerMiddleware();

cartAddProductToCartBySerialRejectedListener.startListening({
  actionCreator: addProductToCartBySerial.rejected,
  effect: async (action) => {
    let message;
    const error = action.error.message as CartEvent | undefined;

    switch (error) {
      case CartEvent.OUT_OF_STOCK:
        message = "สินค้าหมดสต๊อก";
        break;
      case CartEvent.PRODUCT_NOT_FOUND_IN_CART:
        message = "ไม่พบสินค้าในตะกร้าที่จะอัปเดต";
        break;
      case CartEvent.PRODUCT_NOT_FOUND:
        message = "ไม่พบรหัสสินค้านี้ในระบบ";
        break;
      case CartEvent.STORE_NOT_FOUND:
        message = "ไม่พบข้อมูลร้านค้า กรุณารีเฟรชหน้าจอ";
        break;
      case CartEvent.UNKNOWN_ERROR:
      default:
        message = `เกิดข้อผิดพลาด: ${action.error.message || "Unknown error"}`;
    }

    enqueueSnackbar(message, {
      variant: "error",
      preventDuplicate: true,
      key: "scanner-error",
    });
  },
});

cartListenerMiddleware.startListening({
  matcher: isAnyOf(cashoutCart.rejected, consignmentCart.rejected),
  effect: async (action) => {
    const error = action.error as { message?: string };
    const message =
      error.message || "เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง";

    if (action.payload) {
      enqueueSnackbar(action.payload as string, {
        variant: "error",
        key: "error",
        preventDuplicate: true,
      });
      return;
    }

    enqueueSnackbar(message, {
      variant: "error",
      key: "checkout-error",
      preventDuplicate: true,
    });
  },
});

cartListenerMiddleware.startListening({
  actionCreator: cashoutCart.fulfilled,
  effect: async () => {
    enqueueSnackbar(`ทำรายการคิดเงินสำเร็จแล้ว!`, {
      variant: "success",
    });
  },
});

cartListenerMiddleware.startListening({
  actionCreator: consignmentCart.fulfilled,
  effect: async () => {
    enqueueSnackbar(`ทำรายการฝากขายสำเร็จแล้ว!`, {
      variant: "success",
    });
  },
});
