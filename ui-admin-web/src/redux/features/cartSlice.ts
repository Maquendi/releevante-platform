import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TransaccionType = "RENT" | "PURCHASE";

export interface CartItemState {
  id:string;
  title: string;
  image: string;
  isbn: string;
  qty: number;
  price?: number;
  author: string;
  categories: any[];
  qtyForSale:number;
  transactionType: TransaccionType;
}

export type LanguageType = "English" | "Spanish" | "French" | null;

interface CartState {
  items: CartItemState[];
  cartHistory: CartItemState[];
  selectedBookTranslationId: string;
}

const initialState: CartState = {
  items: [],
  cartHistory: [],
  selectedBookTranslationId: 'null',
};



const cartSlice = createSlice({
  name: "cart",
  initialState:initialState,
  reducers: {
    addItem: (state, { payload }: PayloadAction<CartItemState>) => {
      const isBookExist = state.items.find(
        (book) =>
          book.isbn === payload.isbn &&
          book.transactionType === payload.transactionType
      );
      if (isBookExist) {
        isBookExist.qty += payload.qty;
      } else {
        state.items.push(payload);
      }
      state.cartHistory.push(payload);
    },
    updateItemQuantity: (state, { payload }: PayloadAction<CartItemState>) => {
      const { qty, isbn } = payload;
      const bookInCart = state.items.find((book) => book.isbn === isbn);

      state.cartHistory.push(payload);

      if (!bookInCart) return;
      bookInCart.qty += qty;

      state.items.push(bookInCart);
    },
    updateItem: (state, { payload }: PayloadAction<Partial<CartItemState>>) => {
      const { isbn, ...fieldsToUpdate } = payload;
      state.items = state.items.map((item) => {
        if (item.isbn === isbn) {
          return {
            ...item,
            ...fieldsToUpdate,
          };
        }
        return item;
      });
    },
    removeItem: (state, { payload }: PayloadAction<Partial<CartItemState>>) => {
      const { isbn } = payload;
      state.items = state.items.filter((book) => book.isbn !== isbn);
    },
    clearCart: (state) => {
      state.items = [];
    },
    setSelectedBookTranslation(state, { payload }: PayloadAction<{ selectedBookTranslationId: string }>) {
      state.selectedBookTranslationId = payload.selectedBookTranslationId;
    },
  },
});


export const {
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
  setSelectedBookTranslation,
  updateItem,
} = cartSlice.actions;
export default cartSlice.reducer;
