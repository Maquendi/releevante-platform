import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItemState {
  title: string;
  image: string;
  isbn: string;
  qty: number;
  price?:number,
  transactionType: 'RENT' | 'PURCHASE'
}

export type LanguageType="English" | 'Spanish' | 'French' | null

 interface CartState {
  items: CartItemState[];
  cartHistory: CartItemState[];
  language:LanguageType
}

const initialState: CartState = {
  items: [],
  cartHistory: [],
  language:null
};

const calculateTotalQuantityById = ({
  cartHistory,
  isbn,
}: {
  cartHistory: CartItemState[];
  isbn: string;
}): number => {
  return cartHistory
    .filter((item) => item.isbn === isbn)
    .reduce((acc, item) => acc + item.qty, 0);
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, { payload }: PayloadAction<CartItemState>) => {
      const isBookExist = state.items.find(
        (book) => book.isbn === payload.isbn && book.transactionType === payload.transactionType
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
    removeItem: (state, { payload }: PayloadAction<CartItemState>) => {
      state.items = state.items.filter((book) => book.isbn !== payload.isbn);
      const existingQuantityInCart =
        calculateTotalQuantityById({
          cartHistory: state.cartHistory,
          isbn: payload.isbn,
        }) || 0;
      if (!existingQuantityInCart) return;
      state.cartHistory.push({ ...payload, qty: -existingQuantityInCart });
    },
    clearCart: (state) => {
      state.items = [];
    },
    setLanguage(state,{payload}:PayloadAction<{language:LanguageType}>){
      state.language = payload.language
    }
  },
});

export const { addItem, updateItemQuantity, removeItem, clearCart,setLanguage } =
  cartSlice.actions;
export default cartSlice.reducer;
