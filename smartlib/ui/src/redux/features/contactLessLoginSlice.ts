import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LoginInfo {
  user: {
    id?: string;
  };
}

const initialState: LoginInfo = {
  user: {},
};

export const contactLessLoginSlice = createSlice({
  name: "contactlesslogin",
  initialState,
  reducers: {
    addUserId: (state, action: PayloadAction<LoginInfo>) => {
      state.user = { ...action.payload.user };
    },
    clearUserId: (state) => {
      state.user = {};
    },
  },
});

export const { addUserId, clearUserId } = contactLessLoginSlice.actions;

export default contactLessLoginSlice.reducer;
