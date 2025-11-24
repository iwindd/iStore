"use client";
import findProductById, {
  FindProductByIdResult,
} from "@/actions/product/findById";
import stockCommit from "@/actions/stock/commit";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";

export interface StockProduct {
  id: number;
  quantity: number;
  data?: FindProductByIdResult; // cached
}

export interface StockState {
  id: number | null;
  products: StockProduct[];
}

const initialState: StockState = {
  id: null,
  products: [],
};

export const setProductToStockById = createAsyncThunk(
  "stock/setProductToStockById",
  async ({
    product_id,
    quantity,
  }: {
    product_id: number;
    quantity: number;
  }) => {
    const resp = await findProductById(product_id);
    if (!resp.success || !resp.data) {
      enqueueSnackbar(`มีบางอย่างผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง!`, {
        variant: "error",
      });
      throw new Error("product_not_found");
    }
    return { product: resp.data, quantity };
  }
);

export const commitStock = createAsyncThunk(
  "stock/commitStock",
  async (data: { note?: string; updateStock?: boolean }, thunkAPI) => {
    const {
      stock: { id, products },
    } = thunkAPI.getState() as { stock: StockState };

    const resp = await stockCommit(products, id || undefined, {
      note: data.note,
      updateStock: data.updateStock,
    });

    return resp;
  }
);

const stockSlice = createSlice({
  name: "stock",
  initialState: initialState,
  reducers: {
    setStockId: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
    },
    resetStock: (state) => {
      state.id = null;
      state.products = [];
    },
    removeProductFromStockById: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    setStockProducts: (state, action: PayloadAction<StockProduct[]>) => {
      state.products = action.payload.filter((p) => p.quantity > 0);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setProductToStockById.fulfilled, (state, { payload }) => {
      const { product, quantity } = payload;
      const existProduct = state.products.find((p) => p.id === product.id);
      if (existProduct) {
        existProduct.quantity = quantity;
        return;
      }

      if (quantity <= 0 && existProduct) {
        state.products = state.products.filter((p) => p.id !== product.id);
        return;
      }

      state.products.push({
        id: product.id,
        data: product,
        quantity,
      });
    });
    builder.addCase(commitStock.fulfilled, (state) => {
      state.id = null;
      state.products = [];
    });
  },
});

export const {
  resetStock,
  removeProductFromStockById,
  setStockProducts,
  setStockId,
} = stockSlice.actions;
export default stockSlice.reducer;
