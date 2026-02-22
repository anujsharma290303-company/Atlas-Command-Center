import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../../types/model";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.token;
      state.isAuthenticated = true;

      // ⭐ Multi-tab LOGIN sync event
      localStorage.setItem(
        "auth_event",
        JSON.stringify({
          type: "login",
          time: Date.now(),
        })
      );
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;

      // ⭐ Multi-tab LOGOUT sync event
      localStorage.setItem(
        "auth_event",
        JSON.stringify({
          type: "logout",
          time: Date.now(),
        })
      );
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
