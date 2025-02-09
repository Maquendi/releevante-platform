import {
  TransactionItemStatusEnum,
  TransactionType,
} from "@/core/domain/loan.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CheckinItem = {
  transactionId: string;
  itemId: string;
  image: string;
  isbn: string;
  title: string;
  status: TransactionItemStatusEnum;
  cpy: string;
  transactionType: TransactionType;
};

interface CheckoutState {
  currentItemForCheckin: CheckinItem;
  completedBooks: CheckinItem[];
}

const initialState: CheckoutState = {
  currentItemForCheckin: {
    transactionId: "",
    itemId: "",
    isbn: "",
    image: "",
    title: "",
    status: TransactionItemStatusEnum.CHECKIN_PENDING,
    cpy: "",
    transactionType: TransactionType.RENT,
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
      action: PayloadAction<{ status: TransactionItemStatusEnum }>
    ) {
      state.currentItemForCheckin = {
        ...state.currentItemForCheckin,
        status: action.payload.status,
      };

      if (
        state.currentItemForCheckin?.status ===
        TransactionItemStatusEnum.CHECKIN_SUCCESS
      ) {
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
