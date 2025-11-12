"use client";
import Cashout from "@/actions/cashier/cashout";
import findProductById, {
  FindProductByIdResult,
} from "@/actions/product/findById";
import { CashoutInputValues, CashoutSchema } from "@/schema/Payment";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";

export interface CartProduct {
  id: number;
  quantity: number;
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

export const cashoutCart = createAsyncThunk(
  "cart/cashoutCart",
  async (data: CashoutInputValues, thunkAPI) => {
    const { cart } = thunkAPI.getState() as { cart: CartState };
    console.log(data);
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
    },
    setProductQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const product = state.products.find((p) => p.id === id);

      if (!product) return;
      if (Number.isNaN(quantity)) return;
      if (quantity <= 0) return;

      product.quantity = Math.max(+quantity, 1);
      state.total = getTotalPrice(state.products);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addProductToCartById.fulfilled, (state, action) => {
      const product = action.payload;
      const existingProduct = state.products.find((p) => p.id === product.id);
      const quantity = (existingProduct ? existingProduct.quantity : 0) + 1;

      if (!product.category?.overstock && quantity > product.stock) {
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
      state.hasSomeProductOverstock = quantity > product.stock;
    });
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

export const { clearProductCart, removeProductFromCart, setProductQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
