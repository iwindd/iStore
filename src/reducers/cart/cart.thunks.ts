"use client";
import Cashout from "@/actions/cashier/cashout";
import { Consignment } from "@/actions/cashier/consignment";
import { RootState } from "@/libs/store";
import {
  CashoutInputValues,
  CashoutSchema,
  ConsignmentInputValues,
  ConsignmentSchema,
} from "@/schema/Payment";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CartHelper } from "./cart.helpers";
import { selectPreOrderProducts, selectProductList } from "./cart.selectors";
import { CartEvent } from "./cart.types";
import {
  handleExistingPreOrderScan,
  handleExistingProductScan,
  handleNewProductScan,
} from "./cart.utils";

export const addProductToCartBySerial = createAsyncThunk(
  "cart/addProductToCartBySerial",
  async (serial: string, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const { currentProject: project } = state.project;
    if (!project) throw new Error(CartEvent.STORE_NOT_FOUND);

    const storeSlug = project.slug;

    // Check if product exists in pre-order list
    const preOrderProducts = selectPreOrderProducts(state);
    const existingPreOrder = CartHelper.findExistingProductBySerial(
      preOrderProducts,
      serial,
    );

    // Check if product exists in cart
    const products = selectProductList(state);
    const existingProduct = CartHelper.findExistingProductBySerial(
      products,
      serial,
    );

    if (existingProduct) {
      return await handleExistingProductScan(serial, {
        thunkAPI,
        existingProduct,
        storeSlug,
      });
    } else if (existingPreOrder) {
      return handleExistingPreOrderScan(serial, {
        thunkAPI,
        existingPreOrder,
        storeSlug,
      });
    }
    return handleNewProductScan(serial, {
      thunkAPI,
      existingPreOrder,
      storeSlug,
    });
  },
);

export const cashoutCart = createAsyncThunk(
  "cart/cashoutCart",
  async (data: CashoutInputValues, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const { currentProject: project } = state.project;
    if (!project?.slug) return;

    const products = selectProductList(state);
    const preOrderProducts = selectPreOrderProducts(state);

    const payload = CashoutSchema.safeParse({
      products,
      preOrderProducts,
      ...data,
    });

    if (!payload.success) {
      const hasCartProductError = payload.error.errors.find((p) =>
        p.path.find((path) => path == "products"),
      );

      if (hasCartProductError) {
        // Listener will catch this via rejected action
        throw new Error(`เกิดข้อผิดพลาด ${hasCartProductError.message}`);
      }

      throw new Error(payload.error?.message);
    }

    const resp = await Cashout(project.slug, payload.data);
    if (!resp.success) {
      return thunkAPI.rejectWithValue(
        "เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง",
      );
    }

    return resp.data;
  },
);

export const consignmentCart = createAsyncThunk(
  "cart/consignmentCart",
  async (data: ConsignmentInputValues, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const { currentProject: project } = state.project;
    if (!project?.slug) return;

    const products = selectProductList(state);
    const payload = ConsignmentSchema.safeParse({
      products,
      ...data,
    });

    if (!payload.success) {
      const hasCartProductError = payload.error.errors.find((p) =>
        p.path.find((path) => path == "products"),
      );

      if (hasCartProductError) {
        // Listener will catch this via rejected action
        throw new Error(`เกิดข้อผิดพลาด ${hasCartProductError.message}`);
      }

      throw new Error(payload.error?.message);
    }

    const resp = await Consignment(project.slug, payload.data);
    if (!resp.success) {
      return thunkAPI.rejectWithValue(
        "เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง",
      );
    }

    return resp.consignment;
  },
);
