"use client";
import { FindProductByIdResult } from "@/actions/product/findById";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartHelper } from "./cart.helpers";
import {
  addProductToCartBySerial,
  cashoutCart,
  consignmentCart,
} from "./cart.thunks";
import {
  CartProduct,
  CartProductLoading,
  CartState,
  CheckoutMode,
} from "./cart.types";

export const initialCartState: CartState = {
  products: [],
  preOrderProducts: [],
  total: 0,
  totalPreOrder: 0,
  checkoutMode: CheckoutMode.CASHOUT,
  scanner: "",
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    clearProductCart: (state) => {
      state.products = [];
      state.preOrderProducts = [];
      state.total = 0;
      state.totalPreOrder = 0;
    },
    addProductOptimistically: (
      state,
      action: PayloadAction<{
        cartId: string;
        serial: string;
        quantity: number;
        isLoading: true;
        productId?: never;
        data?: never;
      }>,
    ) => {
      // Add product to cart with loading state immediately
      state.products.push(action.payload);
    },
    incrementProductQuantityAndSetLoading: (
      state,
      action: PayloadAction<{ cartId: string }>,
    ) => {
      const product = state.products.find(
        (p) => p.cartId === action.payload.cartId,
      );
      if (!product) return;

      product.quantity += 1;
      // Construct new loading state (removing data)
      const { cartId, quantity, serial, note } = product;

      const _data = (() => {
        if ("data" in product && product.data) return product.data;
        if ("_data" in product && product._data) return product._data;
        return undefined;
      })();

      const newProduct: CartProductLoading = {
        cartId,
        quantity,
        serial,
        note,
        _data,
        isLoading: true,
      };
      const index = state.products.findIndex(
        (p) => p.cartId === action.payload.cartId,
      );
      if (index !== -1) {
        state.products[index] = newProduct;
      }
    },
    incrementProductPreOrderQuantityAndSetLoading: (
      state,
      action: PayloadAction<{ cartId: string }>,
    ) => {
      const product = state.preOrderProducts.find(
        (p) => p.cartId === action.payload.cartId,
      );
      if (!product) return;

      product.quantity += 1;
      // Construct new loading state (removing data)
      const { cartId, quantity, serial, note } = product;
      const newProduct: CartProduct = {
        cartId,
        quantity,
        serial,
        note,
        isLoading: true,
      };
      const index = state.preOrderProducts.findIndex(
        (p) => p.cartId === action.payload.cartId,
      );
      if (index !== -1) {
        state.preOrderProducts[index] = newProduct;
      }
    },
    setProductLoading: (
      state,
      action: PayloadAction<{ cartId: string; isLoading: boolean }>,
    ) => {
      if (action.payload.isLoading) {
        const index = state.products.findIndex(
          (p) => p.cartId === action.payload.cartId,
        );
        if (index !== -1) {
          const p = state.products[index];
          state.products[index] = {
            cartId: p.cartId,
            quantity: p.quantity,
            serial: p.serial,
            note: p.note,
            isLoading: true,
          };
        }
      } else {
        console.warn("setProductLoading(false) called without data. Ignored.");
      }
    },
    updateProductData: (
      state,
      action: PayloadAction<{
        cartId: string;
        productId: number;
        data: FindProductByIdResult;
      }>,
    ) => {
      const index = state.products.findIndex(
        (p) => p.cartId === action.payload.cartId,
      );
      if (index !== -1) {
        const current = state.products[index];
        state.products[index] = {
          cartId: current.cartId,
          quantity: current.quantity,
          note: current.note,
          serial: action.payload.data.serial,
          isLoading: false,
          productId: action.payload.productId,
          data: action.payload.data,
        };

        if ("_data" in current) delete current._data;
      }
      state.total = CartHelper.getTotalPrice(state.products);
    },
    updateProductPreOrderData: (
      state,
      action: PayloadAction<{
        cartId: string;
        productId: number;
        data: FindProductByIdResult;
      }>,
    ) => {
      const index = state.preOrderProducts.findIndex(
        (p) => p.cartId === action.payload.cartId,
      );
      if (index !== -1) {
        const current = state.preOrderProducts[index];
        state.preOrderProducts[index] = {
          cartId: current.cartId,
          quantity: current.quantity,
          note: current.note,
          serial: action.payload.data.serial,
          isLoading: false,
          productId: action.payload.productId,
          data: action.payload.data,
        };
      }
      state.totalPreOrder = CartHelper.getTotalPrice(state.preOrderProducts);
    },
    removeProductFromCart: (state, action: PayloadAction<string>) => {
      state.products = CartHelper.removeItem(state.products, action.payload);
      state.total = CartHelper.getTotalPrice(state.products);
    },
    removePreOrderProductFromCart: (state, action: PayloadAction<string>) => {
      state.preOrderProducts = CartHelper.removeItem(
        state.preOrderProducts,
        action.payload,
      );
      state.totalPreOrder = CartHelper.getTotalPrice(state.preOrderProducts);
    },
    setProductQuantity: (
      state,
      action: PayloadAction<{ cartId: string; quantity: number }>,
    ) => {
      state.total = CartHelper.updateProductQuantity(
        state.products,
        action.payload.cartId,
        action.payload.quantity,
        {
          checkStock: true,
        },
      );
    },
    setProductPreOrderQuantity: (
      state,
      action: PayloadAction<{ cartId: string; quantity: number }>,
    ) => {
      state.totalPreOrder = CartHelper.updateProductQuantity(
        state.preOrderProducts,
        action.payload.cartId,
        action.payload.quantity,
      );
    },
    setProductNote: (
      state,
      action: PayloadAction<{ cartId: string; note: string }>,
    ) =>
      CartHelper.setProductNote(
        state.products,
        action.payload.cartId,
        action.payload.note,
      ),
    setProductPreOrderNote: (
      state,
      action: PayloadAction<{ cartId: string; note: string }>,
    ) =>
      CartHelper.setProductNote(
        state.preOrderProducts,
        action.payload.cartId,
        action.payload.note,
      ),
    preOrderProduct: (
      state,
      action: PayloadAction<{
        cartId: string;
        quantity: number;
      }>,
    ) => {
      let quantity = Number(action.payload.quantity);
      if (quantity <= 0) return;
      const product = state.products.find(
        (p) => p.cartId === action.payload.cartId,
      );

      // Guard: Must exist and NOT be loading
      if (!product || product.isLoading) return;

      if (Number.isNaN(quantity)) quantity = product?.quantity;
      const existingPreOrderProduct = state.preOrderProducts.find(
        (p) => p.cartId === action.payload.cartId,
      );

      if (existingPreOrderProduct) {
        existingPreOrderProduct.quantity = quantity;
        state.totalPreOrder = CartHelper.getTotalPrice(state.preOrderProducts);
        return;
      }

      state.preOrderProducts.push({
        ...product,
        quantity: quantity,
        note: "",
      });
      state.totalPreOrder = CartHelper.getTotalPrice(state.preOrderProducts);
    },
    setCheckoutMode: (state, action: PayloadAction<CheckoutMode>) => {
      state.checkoutMode = action.payload;
    },
    setScanner: (state, action: PayloadAction<string>) => {
      state.scanner = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addProductToCartBySerial.fulfilled, (state) => {
      state.total = CartHelper.getTotalPrice(state.products);
    });
    builder.addCase(cashoutCart.fulfilled, (state) => {
      state.products = [];
      state.preOrderProducts = [];
      state.total = 0;
      state.totalPreOrder = 0;
    });
    builder.addCase(consignmentCart.fulfilled, (state) => {
      state.products = [];
      state.preOrderProducts = [];
      state.total = 0;
      state.totalPreOrder = 0;
      state.checkoutMode = CheckoutMode.CASHOUT;
    });
  },
});

export const {
  clearProductCart,
  removeProductFromCart,
  removePreOrderProductFromCart,
  setProductQuantity,
  setProductNote,
  setProductPreOrderNote,
  setProductPreOrderQuantity,
  preOrderProduct,
  setCheckoutMode,
  setScanner,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
