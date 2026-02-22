import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { WeatherResponse } from "../types/weather";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
export const weatherApi = createApi({
  reducerPath: "weatherApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.openweathermap.org/data/2.5",
  }),
  endpoints: (builder) => ({
    getWeatherByCity: builder.query<WeatherResponse, string>({
      query: (city) => `weather?q=${city}&appid=${API_KEY}&units=metric`,
    }),

    getWeatherByCoords: builder.query<
      WeatherResponse,
      { lat: number; lon: number }
    >({
      query: ({ lat, lon }) =>
        `weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
    }),
  }),
});
export const {
    useGetWeatherByCityQuery,
    useGetWeatherByCoordsQuery,
} = weatherApi
