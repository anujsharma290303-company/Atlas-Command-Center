import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  id: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  createdAt: number;
}

interface NotificationState {
  queue: Notification[];
}

const initialState: NotificationState = {
  queue: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    pushNotification(
      state,
      action: PayloadAction<Omit<Notification, "id" | "createdAt">>
    ) {
      state.queue.push({
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        ...action.payload,
      });
    },

    removeNotification(state, action: PayloadAction<string>) {
      state.queue = state.queue.filter((n) => n.id !== action.payload);
    },

    clearNotifications(state) {
      state.queue = [];
    },
  },
});

export const {
  pushNotification,
  removeNotification,
  clearNotifications,
} = notificationSlice.actions;

export const notificationReducer = notificationSlice.reducer;
export default notificationReducer;
