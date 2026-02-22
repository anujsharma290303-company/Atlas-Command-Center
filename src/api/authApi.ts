import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";

// sophiab sophiabpass    → viewer
// michaelw michaelwpass  → analyst
// emilys emilyspass      → admin

export interface MockUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  image: string;
  company: { name: string };
  address: { city: string };
}

interface UsersResponse {
  users: MockUser[];
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dummyjson.com/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({
        username,
        password,
        expiresInMins = 30,
      }: {
        username: string;
        password: string;
        expiresInMins?: number;
      }) => ({
        url: "auth/login",
        method: "POST",
        body: { username, password, expiresInMins },
      }),
    }),

    // ✅ added — dummyjson users for Settings profile picker
    getUsers: builder.query<MockUser[], void>({
      query: () => "users?limit=10",
      transformResponse: (res: UsersResponse) => res.users,
    }),
  }),
});

export const { useLoginMutation, useGetUsersQuery } = authApi;