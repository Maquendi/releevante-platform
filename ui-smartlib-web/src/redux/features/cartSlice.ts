import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  title: string;
  image: string;
  isbn: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  cartHistory: CartItem[];
}

const initialState: CartState = {
  items: [],
  cartHistory: [],
};

const calculateTotalQuantityById = ({
  cartHistory,
  isbn,
}: {
  cartHistory: CartItem[];
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
    addItem: (state, { payload }: PayloadAction<CartItem>) => {
      const isBookExist = state.items.find(
        (book) => book.isbn === payload.isbn
      );
      if (isBookExist) {
        isBookExist.qty += payload.qty;
      } else {
        state.items.push(payload);
      }
      state.cartHistory.push(payload);
    },
    updateItemQuantity: (state, { payload }: PayloadAction<CartItem>) => {
      const { qty, isbn } = payload;
      const bookInCart = state.items.find((book) => book.isbn === isbn);

      state.cartHistory.push(payload);

      if (!bookInCart) return;
      bookInCart.qty += qty;

      state.items.push(bookInCart);
    },
    removeItem: (state, { payload }: PayloadAction<CartItem>) => {
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
  },
});

export const { addItem, updateItemQuantity, removeItem, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
