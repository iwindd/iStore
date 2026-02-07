import { CartProduct } from "./cart.types";

export class CartHelper {
  /**
   * Update product quantity and return new total price
   */
  static updateProductQuantity(
    products: CartProduct[],
    cartId: string,
    quantity: number,
    options?: { checkStock?: boolean },
  ): number {
    const product = products.find((p) => p.cartId === cartId);
    if (!product || quantity <= 0 || Number.isNaN(quantity)) {
      return CartHelper.getTotalPrice(products);
    }

    if (options?.checkStock) {
      const stock = product.data?.stock?.quantity ?? product.quantity;

      if (quantity > stock) {
        product.quantity = stock;
        return CartHelper.getTotalPrice(products);
      }
    }

    product.quantity = Math.max(quantity, 1);
    return CartHelper.getTotalPrice(products);
  }

  /**
   * Remove item from list
   */
  static removeItem(products: CartProduct[], cartId: string): CartProduct[] {
    return products.filter((p) => p.cartId !== cartId);
  }

  /**
   * Set product note
   */
  static setProductNote(products: CartProduct[], cartId: string, note: string) {
    const product = products.find((p) => p.cartId === cartId);

    if (!product) return;
    product.note = note.slice(0, 40);
  }

  /**
   * Calculate total price from cart products
   */
  static getTotalPrice(products: CartProduct[]) {
    return products.reduce((acc, item) => {
      return acc + (item.data?.price ?? 0) * item.quantity;
    }, 0);
  }

  /**
   * Find existing product by serial
   */
  static findExistingProductBySerial(products: CartProduct[], serial: string) {
    return products.find(
      (p) => p.serial === serial || p.data?.serial === serial,
    );
  }
}
