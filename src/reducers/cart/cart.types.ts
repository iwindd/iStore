import { FindProductByIdResult } from "@/actions/product/findById";

// invariant:
// status === "resolved" => productId && product must exist

interface CartProductBase {
  cartId: string;
  quantity: number;
  note?: string;
  serial: string;
}

export interface CartProductLoading extends CartProductBase {
  isLoading: true;
  productId?: never;
  data?: never;
  _data?: FindProductByIdResult; // old data when refreshing
}

export interface CartProductLoaded extends CartProductBase {
  isLoading: false;
  productId: number;
  data: FindProductByIdResult;
}

export type CartProduct = CartProductLoading | CartProductLoaded;

export enum CheckoutMode {
  CASHOUT = "cashout",
  CONSIGNMENT = "consignment",
}

export enum CartEvent {
  OUT_OF_STOCK = "out_of_stock",
  PRODUCT_NOT_FOUND = "product_not_found",
  STORE_NOT_FOUND = "store_not_found",
  UNKNOWN_ERROR = "unknown",
}

export interface CartState {
  products: CartProduct[];
  preOrderProducts: CartProduct[];
  total: number;
  totalPreOrder: number;
  checkoutMode: CheckoutMode;
  scanner: string;
}
