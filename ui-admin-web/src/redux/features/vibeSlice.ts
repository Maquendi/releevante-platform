import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type VibeState = {
  readingVibe: string | null;
  moodVibe: string | null;
  favorStoryVibe: string | null;
};

const getLocalStorageState = (): VibeState => {
  if (typeof window !== "undefined") {
    const savedState = localStorage.getItem("vibeState");
    return savedState ? JSON.parse(savedState) : { readingVibe: null, moodVibe: null, favorStoryVibe: null };
  }
  return { readingVibe: null, moodVibe: null, favorStoryVibe: null };
};

const initialState: VibeState = getLocalStorageState();

export const vibeSlice = createSlice({
  name: "vibes",
  initialState,
  reducers: {
    updateVibe: (
      state,
      action: PayloadAction<{ vibeType: keyof VibeState; value: string }>
    ) => {
      state[action.payload.vibeType] = action.payload.value;

      if (typeof window !== "undefined") {
        localStorage.setItem("vibeState", JSON.stringify(state));
      }
    },
    resetVibes: (state) => {
      state.readingVibe = null;
      state.moodVibe = null;
      state.favorStoryVibe = null;

      if (typeof window !== "undefined") {
        localStorage.setItem("vibeState", JSON.stringify(state));
      }
    },
  },
});

export const { updateVibe, resetVibes } = vibeSlice.actions;

export default vibeSlice.reducer;
