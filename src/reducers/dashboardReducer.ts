"use client";
import { OrderType } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";

export interface DashboardState {
  orders: any[];
  products: any[];
  bestSellers: any[];
  statistics: {
    weeks: [number, number, number, number, number, number, number];
    methods: [
      { percent: number; total: number },
      { percent: number; total: number }
    ];
  };
  stats: {
    orders: number;
    profit: number;
    borrows: number;
    purchase: number;
    overstock: number;
    low_stock: number;
    stocks: number;
    products: number;
  };
}

export type DashboardStateStatKey = keyof DashboardState["stats"];

const initialState: DashboardState = {
  orders: [],
  products: [],
  bestSellers: [],
  statistics: {
    weeks: [0, 0, 0, 0, 0, 0, 0],
    methods: [
      { percent: 0, total: 0 },
      { percent: 0, total: 0 },
    ],
  },
  stats: {
    orders: 0,
    profit: 0,
    borrows: 0,
    purchase: 0,
    overstock: 0,
    low_stock: 0,
    stocks: 0,
    products: 0,
  },
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: initialState,
  reducers: {
    setBorrowCount: (state, action: PayloadAction<number>) => {
      state.stats.borrows = action.payload;
    },
    setOrders: (state, action: PayloadAction<any[]>) => {
      const orders = action.payload;
      state.orders = orders;
      state.stats.orders = orders.length;
      state.bestSellers = [];

      const purchaseOrders = orders.filter((o) => o.type == OrderType.PURCHASE);
      state.stats.purchase = purchaseOrders.length;
      state.stats.profit = orders.reduce((t, { profit }) => t + profit, 0);

      const overstockCount = orders.reduce((t, order) => {
        const count = order.products?.reduce(
          (pt: number, p: any) => pt + (p.overstock ? 1 : 0),
          0
        );
        return t + (count || 0);
      }, 0);
      state.stats.overstock = overstockCount;

      for (const order in orders) {
        const products = orders[order].products;
        for (const productId in products) {
          const product = products[productId];
          const existing = state.bestSellers.find(
            (p) => p.serial == product.serial
          );
          if (existing) {
            existing.orders += product.count;
          } else {
            state.bestSellers.push({
              id: product.id,
              serial: product.serial,
              label: product.label,
              orders: product.count,
            });
          }
        }

        state.statistics.weeks[dayjs(orders[order].created_at).day()]++;
      }

      state.bestSellers.sort((a, b) => b.orders - a.orders);
      const trafficToPercent = (length: number) =>
        (length / orders.length) * 100;

      const cashoutOrders = orders.filter((order) => order.type == "CASHOUT");
      const cashOrders = cashoutOrders.filter((o) => o.method == "CASH");
      const bankOrders = cashoutOrders.filter((o) => o.method == "BANK");
      state.statistics.methods[0] = {
        percent: +trafficToPercent(cashOrders.length).toFixed(0),
        total: cashOrders.reduce((total, order) => total + order.price, 0),
      };
      state.statistics.methods[1] = {
        percent: +trafficToPercent(bankOrders.length).toFixed(0),
        total: bankOrders.reduce((total, order) => total + order.price, 0),
      };
    },
    setProducts: (state, action: PayloadAction<any[]>) => {
      state.products = action.payload;

      state.stats.products = action.payload.length;

      const lowStockCount = action.payload.filter((p) => {
        return p.stock <= p.low_stock_threshold;
      }).length;
      state.stats.low_stock = lowStockCount;
    },
    setStocks: (state, action: PayloadAction<number>) => {
      state.stats.stocks = action.payload;
    },
  },
});

export const { setBorrowCount, setOrders, setProducts, setStocks } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
