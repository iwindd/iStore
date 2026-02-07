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
  OUT_OF_STOCK = "OUT_OF_STOCK",
  PRODUCT_NOT_FOUND_IN_CART = "PRODUCT_NOT_FOUND_IN_CART",
  PRODUCT_NOT_FOUND = "PRODUCT_NOT_FOUND",
  STORE_NOT_FOUND = "STORE_NOT_FOUND",
  SCAN_VALIDATION_FAILED = "SCAN_VALIDATION_FAILED",
  CASHOUT_ERROR = "CASHOUT_ERROR",
  CASHOUT_SUCCESS = "CASHOUT_SUCCESS",
  CONSIGNMENT_ERROR = "CONSIGNMENT_ERROR",
  CONSIGNMENT_SUCCESS = "CONSIGNMENT_SUCCESS",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface CartState {
  products: CartProduct[];
  preOrderProducts: CartProduct[];
  total: number;
  totalPreOrder: number;
  checkoutMode: CheckoutMode;
  scanner: string;
}
