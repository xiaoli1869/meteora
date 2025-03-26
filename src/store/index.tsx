// src/store/storeContext.tsx
import React, { createContext, useContext } from "react";
import Store from "./store";

const storeContext = createContext({
  Store,
});

export const useStore = () => {
  return useContext(storeContext);
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <storeContext.Provider value={{ Store }}>{children}</storeContext.Provider>
  );
};
