import { LoanItemStatusValues } from "@/core/domain/loan.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CheckinItem = {
  transactionId: string;
  id: string;
  image: string;
  isbn: string;
  title: string;
  status: LoanItemStatusValues;
};

interface CheckoutState {
  currentItemForCheckin: CheckinItem;
  completedBooks: CheckinItem[];
}

const initialState: CheckoutState = {
  currentItemForCheckin: {
    transactionId: "",
    id: "",
    isbn: "",
    image: "",
    title: "",
    status: "CHECKIN_PENDING",
  },
  completedBooks: [],
};

export const returnBookSlice = createSlice({
  name: "returnBookSlice",
  initialState,
  reducers: {
    setCurrentBookForCheckin(state, action: PayloadAction<CheckinItem>) {
      state.currentItemForCheckin = action.payload;
    },
    updateCurrentBookStatus(
      state,
      action: PayloadAction<{ status: LoanItemStatusValues }>
    ) {
      state.currentItemForCheckin = {
        ...state.currentItemForCheckin,
        status: action.payload.status,
      };

      if (state.currentItemForCheckin?.status === "CHECKIN_SUCCESS") {
        state.completedBooks = [
          ...state.completedBooks,
          state.currentItemForCheckin,
        ];
      }
    },
    clearReturnBooks(state) {
      state.currentItemForCheckin = initialState.currentItemForCheckin;
      state.completedBooks = initialState.completedBooks;
    },
  },
});

export const {
  setCurrentBookForCheckin,
  clearReturnBooks,
  updateCurrentBookStatus,
} = returnBookSlice.actions;

export default returnBookSlice.reducer;
