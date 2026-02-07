import { RootState } from "@/libs/store";
import { createSelector } from "@reduxjs/toolkit";
import { CartState } from "./cart.types";

// Base selector
export const selectCartState = (state: RootState): CartState => state.cart;

// Memoized selectors
export const selectCartTotal = createSelector(
  [selectCartState],
  (cart) => cart.total,
);

export const selectTotalPreOrder = createSelector(
  [selectCartState],
  (cart) => cart.totalPreOrder,
);

export const selectProductList = createSelector(
  [selectCartState],
  (cart) => cart.products,
);

export const selectResolvedProducts = createSelector(
  [selectProductList],
  (products) => products.filter((p) => !p.isLoading),
);

export const selectLoadingProducts = createSelector(
  [selectProductList],
  (products) => products.filter((p) => p.isLoading),
);

export const selectPreOrderProducts = createSelector(
  [selectCartState],
  (cart) => cart.preOrderProducts,
);

export const selectCartItemCount = createSelector(
  [selectProductList, selectPreOrderProducts],
  (products, preOrderProducts) =>
    products.reduce((acc, p) => acc + p.quantity, 0) +
    preOrderProducts.reduce((acc, p) => acc + p.quantity, 0),
);

export const selectCheckoutMode = createSelector(
  [selectCartState],
  (cart) => cart.checkoutMode,
);

export const selectScannerInput = createSelector(
  [selectCartState],
  (cart) => cart.scanner,
);
