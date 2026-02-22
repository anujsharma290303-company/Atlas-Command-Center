import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AlertConfig {
  id: string;
  type: "crypto" | "weather";
  target: string; // BTC, ETH, city etc.
  operator: ">" | "<";
  threshold: number;
}

interface AlertConfigState {
  alerts: AlertConfig[];
}

const initialState: AlertConfigState = {
  alerts: [],
};

const alertConfigSlice = createSlice({
  name: "alertConfig",
  initialState,
  reducers: {
    addAlert(state, action: PayloadAction<Omit<AlertConfig, "id">>) {
      state.alerts.push({
        id: crypto.randomUUID(),
        ...action.payload,
      });
    },

    removeAlert(state, action: PayloadAction<string>) {
      state.alerts = state.alerts.filter((a) => a.id !== action.payload);
    },

    clearAlerts(state) {
      state.alerts = [];
    },
  },
});

export const { addAlert, removeAlert, clearAlerts } = alertConfigSlice.actions;

export default alertConfigSlice.reducer;
