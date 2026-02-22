import type { Permission, Role } from "../types/permissions";

const viewerPermissions: Permission[] = [];

const analystPermissions: Permission[] = [
  ...viewerPermissions,
  "data:export",
  "alerts:configure",
];

const operatorPermissions: Permission[] = [
  ...analystPermissions,
  "widget:create",
  "widget:resize",
  "data:import",
  "alerts:dismiss",
];

const adminPermissions: Permission[] = [
  ...operatorPermissions,
  "widget:delete",
  "users:manage",
];

export const permissionMatrix: Record<Role, Permission[]> = {
  viewer:   viewerPermissions,
  analyst:  analystPermissions,
  operator: operatorPermissions,
  admin:    adminPermissions,
};