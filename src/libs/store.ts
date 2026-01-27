import cartReducer, { CartState } from "@/reducers/cartReducer";
import dashboardReducer, { DashboardState } from "@/reducers/dashboardReducer";
import projectReducer from "@/reducers/projectReducer";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};

const persistedCartReducer = persistReducer<CartState>(
  persistConfig,
  cartReducer,
);

const persistedDashboardReducer = persistReducer<DashboardState>(
  persistConfig,
  dashboardReducer,
);

const rootReducer = combineReducers({
  cart: persistedCartReducer,
  dashboard: persistedDashboardReducer,
  project: projectReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
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
export type AppDispatch = AppStore["dispatch"];
