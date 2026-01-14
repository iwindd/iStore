import { PayloadAction } from "@reduxjs/toolkit";
import { CartProduct } from "./cartReducer";

export class CartHelper {
  static setQuantity(
    products: CartProduct[],
    {
      payload: { id, quantity },
    }: PayloadAction<{ id: number; quantity: number }>,
    options?: { checkStock?: boolean }
  ) {
    const product = products.find((p) => p.id === id);
    if (!product || quantity <= 0 || Number.isNaN(quantity)) return;

    if (options?.checkStock) {
      const stock = product.data?.stock?.quantity ?? product.quantity;

      if (quantity > stock) {
        product.quantity = stock;
        return;
      }
    }

    product.quantity = Math.max(quantity, 1);
  }

  static setNote(
    products: CartProduct[],
    { payload: { id, note } }: PayloadAction<{ id: number; note: string }>
  ) {
    const product = products.find((p) => p.id === id);

    if (!product) return;
    product.note = note.slice(0, 40);
  }
}
