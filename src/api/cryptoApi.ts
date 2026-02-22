import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CryptoCoin, CoinLoreResponse } from "../types/crypto";

export const cryptoApi = createApi({
  reducerPath: "cryptoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.coinlore.net/api/",
  }),
  endpoints: (builder) => ({
    getMarketCoins: builder.query<CryptoCoin[], void>({
      query: () => "tickers/?start=0&limit=10",
      transformResponse: (response: CoinLoreResponse) => response.data,
    }),
  }),
});

export const { useGetMarketCoinsQuery } = cryptoApi;