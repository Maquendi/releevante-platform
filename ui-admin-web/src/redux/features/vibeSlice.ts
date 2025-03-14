import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type VibeState = {
  vibe: string | null;
  mood: string | null;
  flavor: string | null;
};


const initialState:VibeState={ vibe: null, mood: null, flavor: null }

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
      state.vibe = null;
      state.mood = null;
      state.flavor = null;

      if (typeof window !== "undefined") {
        localStorage.setItem("vibeState", JSON.stringify(state));
      }
    },
  },
});

export const { updateVibe, resetVibes } = vibeSlice.actions;

export default vibeSlice.reducer;
