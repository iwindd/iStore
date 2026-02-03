import cartReducer, { CartState } from "@/reducers/cartReducer";
import dashboardReducer, { DashboardState } from "@/reducers/dashboardReducer";
import projectReducer from "@/reducers/projectReducer";
import settingsReducer, { SettingsState } from "@/reducers/settingsReducer";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";

const cartPersistConfig = {
  key: "cart",
  storage,
};

const dashboardPersistConfig = {
  key: "dashboard",
  storage,
};

const settingsPersistConfig = {
  key: "settings",
  storage,
};

const persistedCartReducer = persistReducer<CartState>(
  cartPersistConfig,
  cartReducer,
);

const persistedDashboardReducer = persistReducer<DashboardState>(
  dashboardPersistConfig,
  dashboardReducer,
);

const persistedSettingsReducer = persistReducer<SettingsState>(
  settingsPersistConfig,
  settingsReducer,
);

const rootReducer = combineReducers({
  cart: persistedCartReducer,
  dashboard: persistedDashboardReducer,
  project: projectReducer,
  settings: persistedSettingsReducer,
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
