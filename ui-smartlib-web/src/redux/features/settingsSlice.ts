import FetchLibrarySettings from "@/actions/settings-actions";
import { LibrarySettings } from "@/core/domain/settings.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchConfiguration = createAsyncThunk(
  "configuration/fetchConfiguration",
  async () => {
    return await FetchLibrarySettings();
  }
);

interface ConfigurationState {
  data: LibrarySettings | null;
  loading: boolean;
  error: string | null;
}

const isValidJSON = (value: string): boolean => {
  if (!value) return false;
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};

const loadFromLocalStorage = (): ConfigurationState => {
  if (typeof window !== "undefined") {
    const storedData = localStorage.getItem("settings");
    if (storedData && isValidJSON(storedData)) {
      return {
        data: JSON.parse(storedData),
        loading: false,
        error: null,
      };
    }
  }
  return {
    data: null,
    loading: false,
    error: null,
  };
};

const initialState: ConfigurationState = loadFromLocalStorage();

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfiguration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchConfiguration.fulfilled,
        (state, action: PayloadAction<LibrarySettings>) => {
          state.loading = false;
          state.data = action.payload;
          // Guardar en localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("settings", JSON.stringify(action.payload));
          }
        }
      )
      .addCase(fetchConfiguration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch configuration";
      });
  },
});

export default settingsSlice.reducer;
