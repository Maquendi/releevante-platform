import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ItemStatus = {
  cpy: string;
  isbn: string;
  status:
    | "checkout_started"
    | "checkout_successful"
    | "door_opening"
    | "opened_waiting"
    | "checkout_failure";
};

type CheckoutState = {
  itemStatus: ItemStatus;
};

const initialState: CheckoutState = {
    itemStatus: {} as any,
};

export const checkoutSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    updateItemStatus: (state, action: PayloadAction<CheckoutState>) => {
      state.itemStatus = action.payload.itemStatus;
    },
  },
});

export const { updateItemStatus } = checkoutSlice.actions;

export default checkoutSlice.reducer;
