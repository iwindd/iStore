"use client";
import Cashout from "@/actions/cashier/cashout";
import { Consignment } from "@/actions/cashier/consignment";
import findProductById, {
  FindProductByIdResult,
} from "@/actions/product/findById";
import findProductBySerial from "@/actions/product/findBySerial";
import {
  CashoutInputValues,
  CashoutSchema,
  ConsignmentInputValues,
  ConsignmentSchema,
} from "@/schema/Payment";
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  WritableDraft,
} from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";
import { CartHelper } from "./cartHelpers";

export interface CartProduct {
  id: number;
  quantity: number;
  note?: string;
  data?: FindProductByIdResult; // cached
}

export enum CheckoutMode {
  CASHOUT = "cashout",
  CONSIGNMENT = "consignment",
}

export interface CartState {
  products: CartProduct[];
  preOrderProducts: CartProduct[];
  total: number;
  totalPreOrder: number;
  checkoutMode: CheckoutMode;
  storeSlug?: string;
  scanner: string;
}

export const addProductToCartById = createAsyncThunk(
  "cart/addProductToCartById",
  async (productId: number, thunkAPI) => {
    const { cart } = thunkAPI.getState() as { cart: CartState };
    if (!cart.storeSlug) throw new Error("store_not_found");
    const resp = await findProductById(cart.storeSlug, productId);

    if (!resp.success || !resp.data) {
      enqueueSnackbar(`มีบางอย่างผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง!`, {
        variant: "error",
      });
      throw new Error("product_not_found");
    }

    return resp.data;
  },
);

export const addProductToCartBySerial = createAsyncThunk(
  "cart/addProductToCartBySerial",
  async (serial: string, thunkAPI) => {
    const { cart } = thunkAPI.getState() as { cart: CartState };
    if (!cart.storeSlug) throw new Error("store_not_found");
    const resp = await findProductBySerial(cart.storeSlug, serial);

    if (!resp.success || !resp.data) {
      enqueueSnackbar("ไม่พบสินค้านี้ในระบบ", {
        variant: "error",
        preventDuplicate: true,
        key: "scanner-error",
      });
      throw new Error("product_not_found");
    }

    return resp.data;
  },
);

export const cashoutCart = createAsyncThunk(
  "cart/cashoutCart",
  async (data: CashoutInputValues, thunkAPI) => {
    const { cart } = thunkAPI.getState() as { cart: CartState };
    if (!cart.storeSlug) return;

    const payload = CashoutSchema.safeParse({
      products: cart.products,
      preOrderProducts: cart.preOrderProducts,
      ...data,
    });

    if (!payload.success) {
      const hasCartProductError = payload.error.errors.find((p) =>
        p.path.find((path) => path == "products"),
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

    const resp = await Cashout(cart.storeSlug, payload.data);
    if (!resp.success) {
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
        variant: "error",
        key: "error",
        preventDuplicate: true,
      });
      return console.error(resp);
    }

    return resp.data;
  },
);

export const consignmentCart = createAsyncThunk(
  "cart/consignmentCart",
  async (data: ConsignmentInputValues, thunkAPI) => {
    const { cart } = thunkAPI.getState() as { cart: CartState };
    if (!cart.storeSlug) return;
    const payload = ConsignmentSchema.safeParse({
      products: cart.products,
      ...data,
    });

    if (!payload.success) {
      const hasCartProductError = payload.error.errors.find((p) =>
        p.path.find((path) => path == "products"),
      );

      if (hasCartProductError) {
        enqueueSnackbar(`เกิดข้อผิดพลาด ${hasCartProductError.message}`, {
          variant: "error",
          key: "consignment-error",
          preventDuplicate: true,
        });
      }

      throw new Error(payload.error?.message);
    }

    const resp = await Consignment(cart.storeSlug, payload.data);
    if (!resp.success) {
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
        variant: "error",
        key: "error",
        preventDuplicate: true,
      });
      return console.error(resp);
    }

    return resp.consignment;
  },
);

export const initialCartState: CartState = {
  products: [],
  preOrderProducts: [],
  total: 0,
  totalPreOrder: 0,
  checkoutMode: CheckoutMode.CASHOUT,
  scanner: "",
  storeSlug: undefined,
};

const getTotalPrice = (products: CartProduct[]) => {
  return products.reduce(
    (total, product) => total + (product.data?.price || 0) * product.quantity,
    0,
  );
};

const onAddProductToCart = (
  state: WritableDraft<CartState>,
  action: PayloadAction<FindProductByIdResult>,
) => {
  const product = action.payload;
  const existingProduct = state.products.find((p) => p.id === product.id);
  const quantity = (existingProduct ? existingProduct.quantity : 0) + 1;
  const isEnoughtStock = quantity <= (product.stock?.quantity || 0);
  let caseType: "not_enought_stock" | "add_to_cart" | "add_to_pre_order" =
    "add_to_cart";

  if (!isEnoughtStock) {
    caseType = "not_enought_stock";
  }

  if (!isEnoughtStock && product.usePreorder) {
    caseType = "add_to_pre_order";
  }

  switch (caseType) {
    case "not_enought_stock":
      enqueueSnackbar(`จำนวนสินค้า <${product.label}> ในสต๊อกไม่เพียงพอ!`, {
        variant: "error",
        key: `addProductToCart-${product.id}-overstock`,
        preventDuplicate: true,
      });
      break;
    case "add_to_pre_order":
      (() => {
        const existingPreOrderProduct = state.preOrderProducts.find(
          (p) => p.id === product.id,
        );

        if (existingPreOrderProduct) {
          existingPreOrderProduct.quantity += 1;
          existingPreOrderProduct.data = product;
          return;
        }

        state.preOrderProducts.push({
          id: product.id,
          quantity: 1,
          data: product,
        });
      })();

      enqueueSnackbar(
        `เพิ่มสินค้าพรีออเดอร์ <${product.label}> เข้าตะกร้าแล้ว!`,
        {
          variant: "info",
          key: `addPreOrderProductToCart-${product.id}`,
          preventDuplicate: true,
        },
      );
      break;
    case "add_to_cart":
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

      enqueueSnackbar(`เพิ่มสินค้า <${product.label}> เข้าตะกร้าแล้ว!`, {
        variant: "success",
        key: `addProductToCart-${product.id}`,
        preventDuplicate: true,
      });
      break;
    default:
      break;
  }

  state.total = getTotalPrice(state.products);
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    clearProductCart: (state) => {
      state.products = [];
      state.preOrderProducts = [];
      state.total = 0;
      state.totalPreOrder = 0;
    },
    setStoreSlug: (state, action: PayloadAction<string>) => {
      if (state.storeSlug == action.payload) {
        return;
      }

      state.storeSlug = action.payload;
      state.products = [];
      state.preOrderProducts = [];
      state.total = 0;
      state.totalPreOrder = 0;
    },
    removeProductFromCart: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter((p) => p.id != action.payload);
      state.total = getTotalPrice(state.products);
    },
    removePreOrderProductFromCart: (state, action: PayloadAction<number>) => {
      state.preOrderProducts = state.preOrderProducts.filter(
        (p) => p.id != action.payload,
      );
      state.totalPreOrder = getTotalPrice(state.preOrderProducts);
    },
    setProductQuantity: (state, action) => {
      CartHelper.setQuantity(state.products, action, {
        checkStock: true,
      });
      state.total = getTotalPrice(state.products);
    },
    setProductPreOrderQuantity: (state, action) => {
      CartHelper.setQuantity(state.preOrderProducts, action);
      state.totalPreOrder = getTotalPrice(state.preOrderProducts);
    },
    setProductNote: (state, action) =>
      CartHelper.setNote(state.products, action),
    setProductPreOrderNote: (state, action) =>
      CartHelper.setNote(state.preOrderProducts, action),
    preOrderProduct: (
      state,
      action: PayloadAction<{
        id: number;
        quantity: number;
      }>,
    ) => {
      let quantity = Number(action.payload.quantity);
      if (quantity <= 0) return;
      const product = state.products.find((p) => p.id === action.payload.id);
      if (!product) return;
      if (Number.isNaN(quantity)) quantity = product?.quantity;
      const existingPreOrderProduct = state.preOrderProducts.find(
        (p) => p.id === action.payload.id,
      );

      if (existingPreOrderProduct) {
        existingPreOrderProduct.quantity = quantity;
        state.totalPreOrder = getTotalPrice(state.preOrderProducts);
        return;
      }

      state.preOrderProducts.push({
        ...product,
        quantity: quantity,
        note: "",
      });
      state.totalPreOrder = getTotalPrice(state.preOrderProducts);
    },
    setCheckoutMode: (state, action: PayloadAction<CheckoutMode>) => {
      state.checkoutMode = action.payload;
    },
    setScanner: (state, action: PayloadAction<string>) => {
      state.scanner = action.payload;
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
      state.preOrderProducts = [];
      state.total = 0;
      state.totalPreOrder = 0;
    });
    builder.addCase(consignmentCart.fulfilled, (state) => {
      enqueueSnackbar(`ทำรายการฝากขายสำเร็จแล้ว!`, {
        variant: "success",
      });
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
  setStoreSlug,
} = cartSlice.actions;
export default cartSlice.reducer;
