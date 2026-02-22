import { vi } from "vitest";
vi.mock("../api/authApi", () => ({
  useLoginMutation: () => [
    vi.fn().mockResolvedValue({
      unwrap: () =>
        Promise.resolve({
          id: 1,
          username: "emilys",
          accessToken: "mockToken",
        }),
    }),
    { isLoading: false },
  ],
}));

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import Login from "./Login";
import authReducer from "../features/auth/authSlice";

describe("Login Component", () => {
  // Faking the store
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
  });
  //  Creating a global var
  const renderLogin = () =>
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>,
    );
  // Mocking the APi

  test("renders login button", () => {
    renderLogin();
    // selecting the login button as per pov user
    const loginButton = screen.getByRole("button", { name: /login/i });

    expect(loginButton).toBeInTheDocument();
  });

  test("shows validation error when submitting empty form", async () => {
    renderLogin();
    // Clicking the login button and seeing the error
    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    const errorMessage = await screen.findByText(
      /please fix the errors above/i,
    );

    expect(errorMessage).toBeInTheDocument();
  });

  test("allows user to type into username and password inputs", () => {
    renderLogin();
    // user writing
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    // similuting the changes
    fireEvent.change(usernameInput, { target: { value: "emilys" } });
    fireEvent.change(passwordInput, { target: { value: "emilyspass" } });
    // getting the value
    expect(usernameInput).toHaveValue("emilys");
    expect(passwordInput).toHaveValue("emilyspass");
  });

  test("updates redux auth state after successful login", async () => {
    renderLogin();

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: "emilys" } });
    fireEvent.change(passwordInput, { target: { value: "emilyspass" } });

    fireEvent.click(loginButton);

    await Promise.resolve();

    const state = store.getState();

    expect(state.auth.isAuthenticated).toBe(true);
  });
});
