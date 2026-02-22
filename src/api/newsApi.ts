import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { NewsResponse } from "../types/news";

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

export const newsApi = createApi({
  reducerPath: "newsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://newsapi.org/v2",
  }),

  endpoints: (builder) => ({
    getTopHeadlines: builder.query<NewsResponse, string>({
      query: (country = "us") =>
        `top-headlines?country=${country}&apiKey=${API_KEY}`,
    }),

    searchNews: builder.query<NewsResponse, string>({
      query: (query) =>
        `everything?q=${query}&sortBy=publishedAt&apiKey=${API_KEY}`,
    }),
  }),
});
export const { useGetTopHeadlinesQuery, useSearchNewsQuery } = newsApi;
