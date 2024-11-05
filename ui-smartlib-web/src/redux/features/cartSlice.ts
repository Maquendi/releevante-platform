import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  book_id: string;
  qty: number;
  cart_id: string;
  image_url:string
  edition_id:string
  title:string
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
  bookId,
}: {
  cartHistory: CartItem[];
  bookId: string;
}): number => {
  return cartHistory
    .filter((item) => item.book_id === bookId)
    .reduce((acc, item) => acc + item.qty, 0);
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, { payload }: PayloadAction<CartItem>) => {
      const isBookExist= state.items.find(book=>book.book_id === payload.book_id)
      if(isBookExist){
        isBookExist.qty+=payload.qty
      }else{
        state.items.push(payload);
      }
      state.cartHistory.push(payload);
    },
    updateItemQuantity: (state, { payload }: PayloadAction<CartItem>) => {
      const { qty, book_id } = payload;
      const bookInCart = state.items.find(
        (book) => book.book_id === book_id
      );

      state.cartHistory.push(payload);

      if (!bookInCart) return;
      bookInCart.qty += qty;

      state.items.push(bookInCart);
    },
    removeItem: (state, { payload }: PayloadAction<CartItem>) => {
      state.items = state.items.filter(
        (book) => book.book_id !== payload.book_id
      );
      const existingQuantityInCart =
        calculateTotalQuantityById({
          cartHistory: state.cartHistory,
          bookId: payload.book_id,
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
