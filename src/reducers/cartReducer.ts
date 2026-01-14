"use client";
import Cashout from "@/actions/cashier/cashout";
import findProductById, {
  FindProductByIdResult,
} from "@/actions/product/findById";
import findProductBySerial from "@/actions/product/findBySerial";
import { CashoutInputValues, CashoutSchema } from "@/schema/Payment";
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  WritableDraft,
} from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";

export interface CartProduct {
  id: number;
  quantity: number;
  preOrder?: {
    quantity: number;
    preOrderAll?: boolean;
  };
  note?: string;
  data?: FindProductByIdResult; // cached
}

export interface CartState {
  products: CartProduct[];
  total: number;
  hasSomeProductOverstock: boolean;
}

export const addProductToCartById = createAsyncThunk(
  "cart/addProductToCartById",
  async (productId: number) => {
    const resp = await findProductById(productId);

    if (!resp.success || !resp.data) {
      enqueueSnackbar(`มีบางอย่างผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง!`, {
        variant: "error",
      });
      throw new Error("product_not_found");
    }

    return resp.data;
  }
);

export const addProductToCartBySerial = createAsyncThunk(
  "cart/addProductToCartBySerial",
  async (serial: string) => {
    const resp = await findProductBySerial(serial);

    console.log(resp);
    if (!resp.success || !resp.data) {
      enqueueSnackbar("ไม่พบสินค้านี้ในระบบ", {
        variant: "error",
        preventDuplicate: true,
        key: "scanner-error",
      });
      throw new Error("product_not_found");
    }

    return resp.data;
  }
);

export const cashoutCart = createAsyncThunk(
  "cart/cashoutCart",
  async (data: CashoutInputValues, thunkAPI) => {
    const { cart } = thunkAPI.getState() as { cart: CartState };
    const payload = CashoutSchema.safeParse({
      products: cart.products,
      ...data,
    });

    if (!payload.success) {
      const hasCartProductError = payload.error.errors.find((p) =>
        p.path.find((path) => path == "products")
      );

      if (hasCartProductError) {
        enqueueSnackbar(`เกิดข้อผิดพลาด ${hasCartProductError.message}`, {
          variant: "error",
          key: "cashout-error",
          preventDuplicate: true,
        });
      }

      throw new Error(payload.error?.message);
    }

    const resp = await Cashout(payload.data);
    if (!resp.success) {
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
        variant: "error",
        key: "error",
        preventDuplicate: true,
      });
      throw new Error(resp.message);
    }

    return resp.data;
  }
);

const initialState: CartState = {
  products: [],
  total: 0,
  hasSomeProductOverstock: false,
};

const getTotalPrice = (products: CartProduct[]) => {
  return products.reduce(
    (total, product) => total + (product.data?.price || 0) * product.quantity,
    0
  );
};

const getHasSomeProductOverstock = (products: CartProduct[]) => {
  return products.some(
    (product) =>
      product.quantity > (product.data?.stock?.quantity || 0) &&
      product.data?.category?.overstock
  );
};

const onAddProductToCart = (
  state: WritableDraft<CartState>,
  action: PayloadAction<FindProductByIdResult>
) => {
  const product = action.payload;
  const existingProduct = state.products.find((p) => p.id === product.id);
  const quantity = (existingProduct ? existingProduct.quantity : 0) + 1;
  const isPreOrderAll =
    product.usePreorder && existingProduct?.preOrder?.preOrderAll;

  if (
    !product.category?.overstock &&
    quantity > (product.stock?.quantity || 0) &&
    !isPreOrderAll
  ) {
    enqueueSnackbar(`จำนวนสินค้า <${product.label}> ในสต๊อกไม่เพียงพอ!`, {
      variant: "error",
      key: `addProductToCart-${product.id}-overstock`,
      preventDuplicate: true,
    });

    return;
  }

  enqueueSnackbar(`เพิ่มสินค้า <${product.label}> เข้าตะกร้าแล้ว!`, {
    variant: "success",
    key: `addProductToCart-${product.id}`,
    preventDuplicate: true,
  });

  (() => {
    if (existingProduct) {
      existingProduct.quantity = quantity;
      existingProduct.data = product;
      return;
    }

    state.products.push({
      id: product.id,
      quantity: quantity,
      data: product,
    });
  })();

  state.total = getTotalPrice(state.products);
  state.hasSomeProductOverstock = quantity > (product.stock?.quantity || 0);
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    clearProductCart: (state) => {
      state.products = [];
      state.hasSomeProductOverstock = false;
      state.total = 0;
    },
    removeProductFromCart: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter((p) => p.id != action.payload);
      state.total = getTotalPrice(state.products);
      state.hasSomeProductOverstock = getHasSomeProductOverstock(
        state.products
      );
    },
    setProductQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const product = state.products.find((p) => p.id === id);
      if (!product) return;
      const stockCount = product.data?.stock?.quantity || product.quantity;
      const isPreOrderAll = product.preOrder?.preOrderAll;

      if (Number.isNaN(quantity)) return;
      if (quantity <= 0) return;

      if (quantity > stockCount && !isPreOrderAll) {
        product.quantity = stockCount;
        return;
      }

      product.quantity = Math.max(+quantity, 1);
      state.total = getTotalPrice(state.products);
      state.hasSomeProductOverstock = getHasSomeProductOverstock(
        state.products
      );
    },
    setProductPreOrderQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      let value = Number(quantity);
      const product = state.products.find((p) => p.id === id);
      if (!product) return;
      if (Number.isNaN(value)) value = product.quantity;
      if (value <= 0) value = 1;

      if (product.quantity > (product.data?.stock?.quantity || 0)) {
        product.quantity = product.data?.stock?.quantity || 0;
      }

      product.preOrder = {
        quantity: value,
        preOrderAll: false,
      };
    },
    setProductNote: (
      state,
      action: PayloadAction<{ id: number; note: string }>
    ) => {
      const { id, note } = action.payload;
      const product = state.products.find((p) => p.id === id);

      if (!product) return;
      product.note = note.slice(0, 40);
    },
    setPreOrderAll: (
      state,
      action: PayloadAction<{ id: number; preOrderAll: boolean }>
    ) => {
      const { id, preOrderAll } = action.payload;
      const product = state.products.find((p) => p.id === id);

      if (!product) return console.error("product_not_found", id, product);

      if (!preOrderAll) {
        delete product.preOrder;
        if (product.quantity > (product.data?.stock?.quantity || 0)) {
          product.quantity = product.data?.stock?.quantity || 0;
        }
        return;
      }

      product.preOrder = {
        quantity: 0,
        preOrderAll: true,
      };
    },
    mergePreorder: (state, action: PayloadAction<number>) => {
      const product = state.products.find((p) => p.id === action.payload);
      if (!product) return;

      product.quantity = (product.preOrder?.quantity || 1) + product.quantity;
      product.preOrder = {
        quantity: 0,
        preOrderAll: true,
      };
    },
    removePreorder: (state, action: PayloadAction<number>) => {
      const product = state.products.find((p) => p.id === action.payload);
      if (!product) return;
      delete product.preOrder;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addProductToCartById.fulfilled, onAddProductToCart);
    builder.addCase(addProductToCartBySerial.fulfilled, onAddProductToCart);
    builder.addCase(cashoutCart.fulfilled, (state) => {
      enqueueSnackbar(`ทำรายการคิดเงินสำเร็จแล้ว!`, {
        variant: "success",
      });
      state.products = [];
      state.total = 0;
      state.hasSomeProductOverstock = false;
    });
  },
});

export const {
  clearProductCart,
  removeProductFromCart,
  setProductQuantity,
  setProductNote,
  setPreOrderAll,
  setProductPreOrderQuantity,
  mergePreorder,
  removePreorder,
} = cartSlice.actions;
export default cartSlice.reducer;
