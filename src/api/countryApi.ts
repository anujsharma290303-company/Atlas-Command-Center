import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CountryResponse } from "../types/country";

export const countryApi = createApi({
  reducerPath: "countryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://restcountries.com/v3.1/",
  }),
  endpoints: (builder) => ({
    getAllCountries: builder.query<CountryResponse[], void>({
      query: () =>
        "all?fields=name,flags,population,region,subregion,capital,currencies,languages",
    }),

    searchCountry: builder.query<CountryResponse[], string>({
      query: (name) =>
        `name/${name}?fields=name,flags,population,region,subregion,capital,currencies,languages`,
    }),
  }),
});

export const { useGetAllCountriesQuery, useSearchCountryQuery } = countryApi;
