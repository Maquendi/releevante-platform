import { TransactionItemStatusEnum } from "@/core/domain/loan.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CurrentBook = {
  isbn: string | null;
  status: TransactionItemStatusEnum | null;
};

interface CheckoutState {
  currentBook: CurrentBook;
  completedBooks: CurrentBook[];
}

const initialState: CheckoutState = {
  currentBook: {
    isbn: null,
    status: null,
  },
  completedBooks: [],
};

export const checkoutSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setCurrentCopy(state, action: PayloadAction<CurrentBook>) {
      const { isbn, status } = action.payload;
      state.currentBook = { isbn, status };
      const completedBookKeys = state.completedBooks.map((item) => item.isbn);
      if (
        !completedBookKeys.includes(isbn) &&
        status === TransactionItemStatusEnum.CHECKOUT_SUCCESS
      ) {
        state.completedBooks = [...state.completedBooks, action.payload];
      }
    },
    clearCheckout(state) {
      state.completedBooks = initialState.completedBooks;
      state.currentBook = initialState.currentBook;
    },
  },
});

export const { setCurrentCopy, clearCheckout } = checkoutSlice.actions;

export default checkoutSlice.reducer;
