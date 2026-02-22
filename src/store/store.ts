import { configureStore } from "@reduxjs/toolkit";

import { authApi } from "../api/authApi";
import authReducer from "../features/auth/authSlice";
import widgetErrorReducer from "../features/widgetErrors/widgetErrorSlice";
import { weatherApi } from "../api/weatherApi";
import { newsApi } from "../api/newsApi";
import { countryApi } from "../api/countryApi";
import { cryptoApi } from "../api/cryptoApi";
import { postApi } from "../api/postApi";
import alertConfigReducer from "../features/Alerts/alertConfigSlice";
import { widgetLayoutReducer } from "../features/widgetLayout/widgetLayoutSlice";
import { notificationReducer } from "../features/notification/notificationSlice";
import alertReducer from "../features/Alerts/alertSlice";
import { settingsReducer } from "../features/settings/settingsSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    alerts: alertReducer,
    widgetLayout: widgetLayoutReducer,
    notifications: notificationReducer,
    alertConfig: alertConfigReducer,
    widgetErrors: widgetErrorReducer,
     settings: settingsReducer, 

    [authApi.reducerPath]: authApi.reducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [countryApi.reducerPath]: countryApi.reducer,
    [cryptoApi.reducerPath]: cryptoApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      weatherApi.middleware,
      newsApi.middleware,
      countryApi.middleware,
      cryptoApi.middleware,
      postApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
