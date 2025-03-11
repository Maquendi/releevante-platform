import { BookTransactions, TransactionType } from "@/core/domain/loan.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BookTransactionItemState {
  id: string;
  isbn: string;
  cpy: string;
  position: string;
  image: string;
  title: string;
  transactionType: TransactionType;
  transactionId: string;
  exchangeCompleted?: boolean;
  currentlyExchanging?: boolean;
  exchangeWithError?: boolean;
}

export interface BookExchangeState {
  transactionItems: BookTransactionItemState[];
  currentItem?: BookTransactionItemState;
  bookExchangeSuccess?: boolean;
}

const initialState: BookExchangeState = {
  transactionItems: [],
};

export const bookExchangeSlice = createSlice({
  name: "exchange",
  initialState,
  reducers: {
    setCurrentItem(state, action: PayloadAction<BookTransactionItemState>) {
      const currentItem = action.payload;
      console.log("setCurrentItem action: " + JSON.stringify(action));
      const itemIndex = state.transactionItems.findIndex(
        (item) => item.id === currentItem.id
      );

      if (itemIndex >= 0) {
        state.transactionItems[itemIndex] = currentItem;
      }

      console.log("setCurrentItem: " + JSON.stringify(currentItem));
      state.currentItem = {
        ...currentItem,
      };
    },
    setTransaction(state, action: PayloadAction<BookTransactions>) {
      let transactionsItems: BookTransactionItemState[] = [];
      if (action.payload.purchase?.length) {
        const purchasedItems = action.payload.purchase.flatMap((purchase) => {
          return purchase.items.map((item) => ({
            ...item,
            exchangeCompleted: false,
            currentlyExchanging: false,
            exchangeWithError: false,
            transactionType: TransactionType.PURCHASE,
            transactionId: purchase.id,
          }));
        });
        transactionsItems = [...purchasedItems];
      }

      if (action.payload.rent?.length) {
        const purchasedItems = action.payload.rent.flatMap((rent) => {
          return rent.items.map((item) => ({
            ...item,
            exchangeCompleted: false,
            currentlyExchanging: false,
            exchangeWithError: false,
            transactionType: TransactionType.RENT,
            transactionId: rent.id,
          }));
        });

        transactionsItems = [...transactionsItems, ...purchasedItems];
      }
      state.transactionItems = [...transactionsItems];
    },

    onBookExchangeSuccess(state) {
      state.bookExchangeSuccess = true;
    },

    clearBookExchangeState(state) {
      state.currentItem = undefined;
      state.transactionItems = [];
      state.bookExchangeSuccess = false;
    },
  },
});

export const {
  setTransaction,
  setCurrentItem,
  onBookExchangeSuccess,
  clearBookExchangeState,
} = bookExchangeSlice.actions;

export default bookExchangeSlice.reducer;
