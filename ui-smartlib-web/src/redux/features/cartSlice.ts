import { CategoryTranslations } from "@/book/domain/models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TransaccionType = "RENT" | "PURCHASE";

export interface CartItemState {
  title: string;
  image: string;
  isbn: string;
  qty: number;
  price?: number;
  author: string;
  category: CategoryTranslations;
  transactionType: TransaccionType;
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

const loadCartFromLocalStorage = (): CartState => {
  if(typeof window !== 'undefined'){
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      return JSON.parse(savedCart) as CartState;
    }
  }
 
  return initialState;  
};

const saveCartToLocalStorage = (state: CartState) => {
  if(typeof window !== 'undefined'){
    localStorage.setItem("cart", JSON.stringify(state));
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState:loadCartFromLocalStorage(),
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
      saveCartToLocalStorage(state); 
    },
    updateItemQuantity: (state, { payload }: PayloadAction<CartItemState>) => {
      const { qty, isbn } = payload;
      const bookInCart = state.items.find((book) => book.isbn === isbn);

      state.cartHistory.push(payload);

      if (!bookInCart) return;
      bookInCart.qty += qty;

      state.items.push(bookInCart);
      saveCartToLocalStorage(state); 
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
      saveCartToLocalStorage(state); 
    },
    removeItem: (state, { payload }: PayloadAction<Partial<CartItemState>>) => {
      const { isbn } = payload;
      state.items = state.items.filter((book) => book.isbn !== isbn);
      saveCartToLocalStorage(state); 
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToLocalStorage(state); 
    },
    setLanguage(state, { payload }: PayloadAction<{ language: LanguageType }>) {
      state.language = payload.language;
      saveCartToLocalStorage(state);
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
