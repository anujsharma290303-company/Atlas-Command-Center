export type Role = "admin" | "analyst" | "operator" | "viewer";

export type Permission =
  | "widget:create"
  | "widget:delete"
  | "widget:resize"
  | "data:export"
  | "data:import"
  | "alerts:configure"
  | "alerts:dismiss"
  | "users:manage";