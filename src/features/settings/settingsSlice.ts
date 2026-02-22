import { createSlice } from "@reduxjs/toolkit";

type Theme = "dark" | "light";

interface SettingsState {
  theme: Theme;
}

const initialState: SettingsState = {
  theme: "dark",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
      // ✅ one class on <html> cascades all CSS variables
      document.documentElement.classList.toggle(
        "light",
        state.theme === "light"
      );
    },

    setTheme(state, action: { payload: Theme }) {
      state.theme = action.payload;
      document.documentElement.classList.toggle(
        "light",
        action.payload === "light"
      );
    },
  },
});

export const { toggleTheme, setTheme } = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;