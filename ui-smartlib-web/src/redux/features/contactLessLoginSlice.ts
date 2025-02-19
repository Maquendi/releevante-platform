import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LoginInfo {
  userId?: string;
}

const initialState: LoginInfo = {
  userId: undefined,
};

export const contactLessLoginSlice = createSlice({
  name: "contactlesslogin",
  initialState,
  reducers: {
    addUserId: (state, action: PayloadAction<LoginInfo>) => {
      state.userId = action.payload.userId;
    },
    clearUserId: (state) => {
      state.userId = undefined;
    },
  },
});

export const { addUserId, clearUserId } = contactLessLoginSlice.actions;

export default contactLessLoginSlice.reducer;
