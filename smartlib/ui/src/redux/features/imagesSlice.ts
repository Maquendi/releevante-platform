import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ImagesState {
    cachedImages: Record<string, string> | null
}

interface ImageToAdd {
    id: string;
    image: string;
}

const initialState: ImagesState = {
    cachedImages: null
}

export const imagesSlice = createSlice({
    name: "images",
    initialState,
    reducers: {
        setImages: (
            state,
            action: PayloadAction<ImagesState>
        ) => {
            state.cachedImages = action.payload.cachedImages;
        },
        addImages: (
            state,
            action: PayloadAction<ImagesState>
        ) => {
          
            state.cachedImages = {
                ...state.cachedImages,
                ...action.payload.cachedImages
            };
        }
    },
});

export const { setImages, addImages } = imagesSlice.actions;

export default imagesSlice.reducer;