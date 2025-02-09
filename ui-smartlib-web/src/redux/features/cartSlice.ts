import { CategoryTranslations, FtagItem } from "@/book/domain/models";
import { TransactionType } from "@/core/domain/loan.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItemState {
  title: string;
  image: string;
  isbn: string;
  qty: number;
  price?: number;
  author: string;
  categories: FtagItem[];
  transactionType: TransactionType;
}

export type LanguageType = "English" | "Spanish" | "French" | null;

interface CartState {
  items: CartItemState[];
  cartHistory: CartItemState[];
  language: LanguageType;
}

const initialState: CartState = {
  items: [],
  cartHistory: [],
  language: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
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
    setLanguage(state, { payload }: PayloadAction<{ language: LanguageType }>) {
      state.language = payload.language;
    },
  },
});

export const {
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
  setLanguage,
  updateItem,
} = cartSlice.actions;
export default cartSlice.reducer;
