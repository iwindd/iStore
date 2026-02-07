import { FindProductByIdResult } from "@/actions/product/findById";
import findProductBySerial from "@/actions/product/findBySerial";
import { requestCache } from "@/libs/requestCache";
import { RootState } from "@/libs/store";
import { validationQueue } from "@/libs/validationQueue";
import { AsyncThunkConfig, GetThunkAPI } from "@reduxjs/toolkit";
import { CartError } from "./cart.error";
import { selectProductList } from "./cart.selectors";
import { cartSlice } from "./cart.slice";
import { CartEvent, CartProduct } from "./cart.types";

export interface ScanResult {
  tempId: string;
  data?: FindProductByIdResult;
  isUpdate: boolean;
}

const getProductDeduplicate = async (
  storeSlug: string,
  serial: string,
  dispatch: GetThunkAPI<AsyncThunkConfig>["dispatch"],
) => {
  try {
    const product = await requestCache.deduplicate(
      `serial-${storeSlug}-${serial}`,
      () => findProductBySerial(storeSlug, serial),
    );
    return product;
  } catch (error: any) {
    if ("message" in error && error.message === "product_not_found") {
      throw new CartError(CartEvent.PRODUCT_NOT_FOUND, dispatch, {
        serial,
      });
    }

    throw new CartError(CartEvent.UNKNOWN_ERROR, dispatch, {
      serial,
    });
  }
};

export const handleExistingProductScan = async (
  serial: string,
  {
    thunkAPI,
    existingProduct,
    storeSlug,
  }: {
    thunkAPI: GetThunkAPI<AsyncThunkConfig>;
    existingProduct: CartProduct;
    storeSlug: string;
  },
): Promise<ScanResult> => {
  const dispatch = thunkAPI.dispatch;

  // Product already exists - increment quantity optimistically
  dispatch(
    cartSlice.actions.incrementProductQuantityAndSetLoading({
      cartId: existingProduct.cartId,
    }),
  );

  return new Promise<ScanResult>((resolve, reject) => {
    // Debounce validation to avoid excessive API calls during rapid scanning
    validationQueue.schedule(
      `validate-${serial}-${storeSlug}`,
      async () => {
        try {
          const state = thunkAPI.getState() as RootState;
          const dispatch = thunkAPI.dispatch;
          const { currentProject: project } = state.project;
          const storeSlug = project?.slug;
          const cartId = existingProduct.cartId;

          if (!storeSlug) throw new Error(CartEvent.STORE_NOT_FOUND);

          // 1. Re-select product from state to get LATEST quantity (accumulated from rapid scans)
          const products = selectProductList(state);
          const currentProduct = products.find((p) => p.cartId === cartId);

          // 2. Handle removal race condition
          if (!currentProduct) {
            // Product was removed while validation was pending (e.g. by handleNewProductScan rollback or user action)
            // We can simply abort validation.
            return;
          }

          // deduplicate fetch requests
          const product = await getProductDeduplicate(
            storeSlug,
            serial,
            dispatch,
          );
          // update product data
          dispatch(
            cartSlice.actions.updateProductData({
              cartId: currentProduct.cartId,
              productId: product.id,
              data: product,
            }),
          );

          // validate stock using the FRESH quantity from state
          const productStock = product.stock?.quantity ?? 0;
          if (productStock < currentProduct.quantity) {
            // set product quantity to stock quantity
            dispatch(
              cartSlice.actions.setProductQuantity({
                cartId: currentProduct.cartId,
                quantity: productStock,
              }),
            );

            throw new CartError(CartEvent.OUT_OF_STOCK, dispatch, {
              name: product.label,
            });
          }

          resolve({
            tempId: existingProduct.cartId,
            data: existingProduct.isLoading ? undefined : existingProduct.data,
            isUpdate: true,
          });
        } catch (error) {
          console.error("addProductToCartBySerial error : ", error);

          // Fetch latest state to decide if we should restore
          const state = thunkAPI.getState() as RootState;
          const currentProduct = selectProductList(state).find(
            (p) => p.cartId === existingProduct.cartId,
          );

          // Restore previous data if validation fails and we were loaded
          if (
            currentProduct &&
            !existingProduct.isLoading &&
            existingProduct.data
          ) {
            dispatch(
              cartSlice.actions.updateProductData({
                cartId: existingProduct.cartId,
                productId: existingProduct.productId,
                data: existingProduct.data,
              }),
            );
          }

          // Reject the promise so the thunk catches it
          reject(error);
        }
      },
      1000,
    );
  });
};

export const handleNewProductScan = async (
  serial: string,
  {
    thunkAPI,
    existingPreOrder,
    storeSlug,
  }: {
    thunkAPI: GetThunkAPI<AsyncThunkConfig>;
    existingPreOrder?: CartProduct;
    storeSlug: string;
  },
): Promise<ScanResult> => {
  const dispatch = thunkAPI.dispatch;
  const tempId = crypto.randomUUID();

  // Add to cart optimistically
  dispatch(
    cartSlice.actions.addProductOptimistically({
      cartId: tempId,
      serial,
      quantity: 1,
      isLoading: true,
    }),
  );

  try {
    // Deduplicate fetch requests
    const product = await getProductDeduplicate(storeSlug, serial, dispatch);
    // update product data
    dispatch(
      cartSlice.actions.updateProductData({
        cartId: tempId,
        productId: product.id,
        data: product,
      }),
    );

    // Check if total quantity in cart exceeds stock

    const state = thunkAPI.getState() as RootState;
    const products = selectProductList(state);
    const totalQuantity = products
      .filter((p) => p.productId === product.id)
      .reduce((sum, p) => sum + p.quantity, 0);

    const isNotEnoughStock = totalQuantity > (product.stock?.quantity ?? 0);

    if (isNotEnoughStock) {
      return handleInsufficientStock(
        dispatch,
        tempId,
        product,
        totalQuantity,
        existingPreOrder,
      );
    }

    // Return data for fulfilled handler
    return { tempId, data: product, isUpdate: false };
  } catch (error) {
    dispatch(cartSlice.actions.removeProductFromCart(tempId));
    throw error;
  }
};

export const handleExistingPreOrderScan = async (
  serial: string,
  {
    thunkAPI,
    existingPreOrder,
    storeSlug,
  }: {
    thunkAPI: GetThunkAPI<AsyncThunkConfig>;
    existingPreOrder: CartProduct;
    storeSlug: string;
  },
): Promise<ScanResult> => {
  const dispatch = thunkAPI.dispatch;

  dispatch(
    cartSlice.actions.setProductPreOrderQuantity({
      cartId: existingPreOrder.cartId,
      quantity: existingPreOrder.quantity + 1,
    }),
  );

  return {
    tempId: existingPreOrder.cartId,
    data: existingPreOrder.data,
    isUpdate: false,
  };
};

const handleInsufficientStock = (
  dispatch: GetThunkAPI<AsyncThunkConfig>["dispatch"],
  tempId: string,
  product: FindProductByIdResult,
  totalQuantity: number,
  existingPreOrder?: CartProduct,
): ScanResult => {
  if (product.usePreorder) {
    if (existingPreOrder) {
      dispatch(
        cartSlice.actions.setProductPreOrderQuantity({
          cartId: existingPreOrder.cartId,
          quantity: existingPreOrder.quantity + 1,
        }),
      );
    } else {
      dispatch(
        cartSlice.actions.updateProductData({
          cartId: tempId,
          productId: product.id,
          data: product,
        }),
      );
      dispatch(
        cartSlice.actions.preOrderProduct({
          cartId: tempId,
          quantity: totalQuantity,
        }),
      );
    }

    dispatch(cartSlice.actions.removeProductFromCart(tempId));
    return { tempId, data: product, isUpdate: false };
  }

  const productStock = product.stock?.quantity ?? 0;

  if (productStock > 0) {
    dispatch(
      cartSlice.actions.setProductQuantity({
        cartId: tempId,
        quantity: productStock,
      }),
    );
    return { tempId, data: product, isUpdate: false };
  } else {
    dispatch(cartSlice.actions.removeProductFromCart(tempId));
    throw new CartError(CartEvent.OUT_OF_STOCK, dispatch, {
      name: product.label,
    });
  }
};
