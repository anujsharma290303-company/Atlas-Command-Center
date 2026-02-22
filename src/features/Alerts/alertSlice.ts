import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AlertConfig, AlertEvent } from "../../types/alerts";

interface AlertState {
  configs: AlertConfig[];
  history: AlertEvent[];
}

const initialState: AlertState = {
  configs: [],
  history: [],
};

const alertSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    addAlertConfig(state, action: PayloadAction<AlertConfig>) {
      state.configs.push(action.payload);
    },

    removeAlertConfig(state, action: PayloadAction<string>) {
      state.configs = state.configs.filter((a) => a.id !== action.payload);
    },

    addAlertEvent(state, action: PayloadAction<AlertEvent>) {
      state.history.unshift(action.payload); // ✅ newest first
    },

    clearAlertHistory(state) {
      state.history = [];
    },
  },
});

export const {
  addAlertConfig,
  removeAlertConfig,
  addAlertEvent,
  clearAlertHistory,
} = alertSlice.actions;

export default alertSlice.reducer;