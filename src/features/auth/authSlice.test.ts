import { describe, test, expect, vi, afterEach } from "vitest";
import authReducer, { setCredentials, logout } from "./authSlice";
import type { User } from "../../types/model";
afterEach(() => {
  vi.restoreAllMocks();
});
describe("authSlice reducer", () => {
  const mockUser: User = {
    id: 1,
    username: "emilys",
    email: "test@test.com",
    firstName: "Emily",
    lastName: "Stone",
    role: "admin",
  };

  test("setCredentials logs user in and triggers auth_event", () => {
    const storageSpy = vi.spyOn(Storage.prototype, "setItem");

    const action = setCredentials({
      user: mockUser,
      token: "abc123",
    });

    const state = authReducer(undefined, action);

    expect(state.isAuthenticated).toBe(true);
    expect(state.accessToken).toBe("abc123");
    expect(state.user).toEqual(mockUser);

    expect(storageSpy).toHaveBeenCalledWith("auth_event", expect.any(String));
  });

  test("logout clears auth state and triggers logout event", () => {
    const storageSpy = vi.spyOn(Storage.prototype, "setItem");

    const loggedState = {
      user: mockUser,
      accessToken: "abc123",
      isAuthenticated: true,
    };

    const state = authReducer(loggedState, logout());

    // ✅ state reset behaviour
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);

    // ✅ logout sync event
    expect(storageSpy).toHaveBeenCalledWith("auth_event", expect.any(String));
  });
});
