import { SubCategory } from "@/book/domain/models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BookRecommendationState {
  id: string;
  en: string;
  fr: string;
  es: string;
  subCategories: SubCategory[];
}

type PageTransitionPayload = {
  bookRecommendation?: BookRecommendationState;
};

const initialState: PageTransitionPayload = {
  bookRecommendation: undefined,
};

export const pageTransitionPayloadSlice = createSlice({
  name: "pageTransitionPayload",
  initialState,
  reducers: {
    setBookRecommendation: (
      state,
      action: PayloadAction<BookRecommendationState>
    ) => {
      state.bookRecommendation = action.payload;
    },
    resetBookToSee: (state) => {
      state.bookRecommendation = undefined;
    },
  },
});

export const { setBookRecommendation, resetBookToSee } =
  pageTransitionPayloadSlice.actions;

export default pageTransitionPayloadSlice.reducer;
