"use client";
import { AppStore, RootState, store } from "@/libs/store";
import { useRef } from "react";
import { Provider } from "react-redux";
import { Persistor, persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

export default function StoreProvider({
  children,
  preloadedState,
}: Readonly<{
  children: React.ReactNode;
  preloadedState?: Partial<RootState>;
}>) {
  const storeRef = useRef<AppStore | null>(null);
  const persistorRef = useRef<ReturnType<typeof persistStore> | null>(null);

  if (!storeRef.current) {
    const _store = store(preloadedState);
    storeRef.current = _store;
    persistorRef.current = persistStore(_store);
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistorRef.current as Persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
