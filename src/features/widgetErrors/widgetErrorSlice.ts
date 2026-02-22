import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface WidgetError {
  widget: string;
  message: string;
  stack: string | null | undefined;
  timestamp: string;
}

interface WidgetErrorState {
  errors: WidgetError[];
}

const initialState: WidgetErrorState = {
  errors: [],
};

const widgetErrorSlice = createSlice({
  name: "widgetErrors",
  initialState,
  reducers: {
    logWidgetError: (
      state,
      action: PayloadAction<Omit<WidgetError, "timestamp">>
    ) => {
      state.errors.push({
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    clearWidgetErrors: (state) => {
      state.errors = [];
    },
  },
});

export const { logWidgetError, clearWidgetErrors } = widgetErrorSlice.actions;
export default widgetErrorSlice.reducer;