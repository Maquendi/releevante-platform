import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";
import { userApi } from "./services/userApi";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import cartReducer from "./features/cartSlice";
import settingReducer from "./features/settingsSlice";
import videReducer from "./features/vibeSlice";
import checkoutReducer from "./features/checkoutSlice";
import returnbooksReducer from "./features/returnbookSlice";
import pageTransitionPayloadReducer from "./features/pageTransitionSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    cart: cartReducer,
    settings: settingReducer,
    vide: videReducer,
    checkout: checkoutReducer,
    returnbooks: returnbooksReducer,
    pageTransition: pageTransitionPayloadReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([userApi.middleware]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
