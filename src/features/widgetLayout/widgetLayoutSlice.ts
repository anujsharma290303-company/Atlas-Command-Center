import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface WidgetLayout {
  id: string;
  w: number;
  h: number;
  visible: boolean;
}

interface WidgetLayoutState {
  widgets: WidgetLayout[];
  refreshIntervals: Record<string, number>;
}

const defaultWidgets: WidgetLayout[] = [
  { id: "weather", w: 1, h: 1, visible: true },
  { id: "news",    w: 2, h: 1, visible: true },
  { id: "country", w: 1, h: 1, visible: true },
  { id: "crypto",  w: 2, h: 2, visible: true },
  { id: "posts",   w: 2, h: 1, visible: true },
  { id: "map",     w: 2, h: 2, visible: true },
];

const defaultIntervals: Record<string, number> = {
  weather: 60000,
  news:    60000,
  country: 60000,
  crypto:  60000,
  posts:   60000,
  map:     60000,
};

const initialState: WidgetLayoutState = {
  widgets: defaultWidgets,
  refreshIntervals: defaultIntervals,
};

const widgetLayoutSlice = createSlice({
  name: "widgetLayout",
  initialState,
  reducers: {
    setWidgetLayout(state, action: PayloadAction<WidgetLayout[]>) {
      state.widgets = action.payload;
    },

    toggleWidgetVisibility(state, action: PayloadAction<string>) {
      const widget = state.widgets.find((w) => w.id === action.payload);
      if (widget) widget.visible = !widget.visible;
    },

    setRefreshInterval(
      state,
      action: PayloadAction<{ id: string; interval: number }>
    ) {
      state.refreshIntervals[action.payload.id] = action.payload.interval;
    },

    resetLayoutToDefault(state) {
      state.widgets = defaultWidgets;
      state.refreshIntervals = defaultIntervals;
    },

    // ✅ added — swaps two widgets by id, used by withDragHandle
    moveWidget(
      state,
      action: PayloadAction<{ fromId: string; toId: string }>
    ) {
      const { fromId, toId } = action.payload;
      const fromIndex = state.widgets.findIndex((w) => w.id === fromId);
      const toIndex   = state.widgets.findIndex((w) => w.id === toId);

      if (fromIndex === -1 || toIndex === -1) return;

      // Swap positions in the array
      [state.widgets[fromIndex], state.widgets[toIndex]] =
      [state.widgets[toIndex],   state.widgets[fromIndex]];
    },
  },
});

export const {
  setWidgetLayout,
  toggleWidgetVisibility,
  setRefreshInterval,
  resetLayoutToDefault,
  moveWidget, // ✅ exported
} = widgetLayoutSlice.actions;

export const widgetLayoutReducer = widgetLayoutSlice.reducer;