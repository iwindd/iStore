import cartReducer, { CartState } from "@/reducers/cartReducer";
import dashboardReducer, { DashboardState } from "@/reducers/dashboardReducer";
import { configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};

const persistedCartReducer = persistReducer<CartState>(
  persistConfig,
  cartReducer
);

const persistedDashboardReducer = persistReducer<DashboardState>(
  persistConfig,
  dashboardReducer
);

export const store = () => {
  return configureStore({
    reducer: {
      cart: persistedCartReducer,
      dashboard: persistedDashboardReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof store>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
