import type { LoginForm } from "../types/login";
import type { FormFieldConfig } from "./formConfig";

export const loginFormConfig: FormFieldConfig<LoginForm> = {
  username: {
    label: "Username",
    type: "text",
    inputType: "text",
    placeholder: "Username",
    validation: (value) => {
      if (!value) return "Please enter your username";
      if (value.length < 3) return "Username must be at least 3 characters";
      return null;
    },
  },
  password: {
    label: "Password",
    type: "text",
    inputType: "password",
    placeholder: "Password",
    validation: (value) => {
      if (!value) return "Please enter your password";
      if (value.length < 6) return "Password must be at least 6 characters";
      return null;
    },
  },
};