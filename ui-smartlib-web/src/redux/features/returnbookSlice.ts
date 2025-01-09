import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ItemStatus =
  | "return_pending"
  | "return_started"
  | "return_successful"
  | "door_opening"
  | "opened_waiting"
  | "return_failure";

export type ReturnBook = {
  itemId:string
  image:string;
  bookId:string
  bookTitle:string;
  status:ItemStatus;
};

interface CheckoutState {
  currentReturnBook: ReturnBook;
  completedBooks: ReturnBook[];
}

const initialState: CheckoutState = {
  currentReturnBook:{
    itemId:'',
    bookId:'',
    image:'',
    bookTitle:'',
    status:'return_pending'
  } ,
  completedBooks: [],
};

export const checkoutSlice = createSlice({
  name: "returnBookSlice",
  initialState,
  reducers: {
    setCurrentReturnBook(state, action: PayloadAction<ReturnBook>) {
      state.currentReturnBook = action.payload;
    },
    updateCurrentReturnBookStatus(state, action: PayloadAction<{status:ItemStatus}>) {
      state.currentReturnBook = {...state.currentReturnBook,status:action.payload.status};
    },
    clearReturnBooks(state) {
      state.currentReturnBook = initialState.currentReturnBook;
      state.completedBooks = initialState.completedBooks;
    },
  },
});

export const { setCurrentReturnBook, clearReturnBooks,updateCurrentReturnBookStatus } = checkoutSlice.actions;

export default checkoutSlice.reducer;
