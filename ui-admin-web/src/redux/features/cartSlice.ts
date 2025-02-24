import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TransaccionType = "RENT" | "PURCHASE";

export interface CartItemState {
  title: string;
  image: string;
  isbn: string;
  qty: number;
  price?: number;
  author: string;
  categories: any[];
  qtyForSale:number;
  transactionType: TransaccionType;
  state?:'IN_CART' | "RESERVED"
}

export type LanguageType = "English" | "Spanish" | "French" | null;

interface CartState {
  items: CartItemState[];
  cartHistory: CartItemState[];
  selectedBookTranslationId: string;
}

const defaultCartState={ items: [], cartHistory: [], selectedBookTranslationId: "null" }
const loadState = (): CartState => {
  if(typeof window === 'undefined')return defaultCartState
  try {
    const storedState = localStorage.getItem("cart");
    return storedState ? JSON.parse(storedState) :defaultCartState
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return  defaultCartState
  }
};

const saveState = (state: CartState) => {
  if(typeof window === 'undefined')return 

  try {
    localStorage.setItem("cart", JSON.stringify(state));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState:loadState(),
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
        state.items.push({...payload,state:'IN_CART'});
      }
      saveState(state)
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
      saveState(state)

    },
    removeItem: (state, { payload }: PayloadAction<Partial<CartItemState>>) => {
      const { isbn } = payload;
      state.items = state.items.filter((book) => book.isbn !== isbn);
      saveState(state)
    },
    clearCart: (state) => {
      state.items = [];
      saveState(state)
    },
    setItemsAsReserved:(state)=>{
      const itemsUpdated=  state.items.map(book=>({...book,state:'RESERVED'}))
      state.items = itemsUpdated as any
    },
    setSelectedBookTranslation(state, { payload }: PayloadAction<{ selectedBookTranslationId: string }>) {
      state.selectedBookTranslationId = payload.selectedBookTranslationId;
    },
  },
});


export const {
  addItem,
  removeItem,
  clearCart,
  setItemsAsReserved,
  setSelectedBookTranslation,
  updateItem,
} = cartSlice.actions;
export default cartSlice.reducer;



