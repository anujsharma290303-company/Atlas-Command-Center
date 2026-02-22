import { useState } from "react";
import toast from "react-hot-toast";
import { useLoginMutation } from "../api/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { loginFormConfig } from "../config/loginFormConfig";
import type { LoginForm } from "../types/login";
import type { Role } from "../types/permissions";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const [values, setValues] = useState<LoginForm>({ username: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginForm, string>>>({});
  const [formError, setFormError] = useState("");
  const [shake, setShake] = useState(false);

  const handleChange = (key: keyof LoginForm, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));

    const field = loginFormConfig[key];
    if (field.validation) {
      const error = field.validation(value);
      setErrors((prev) => ({ ...prev, [key]: error ?? undefined }));
    }
  };

  const validateAll = (): boolean => {
    const newErrors: Partial<Record<keyof LoginForm, string>> = {};
    let hasError = false;

    for (const key in loginFormConfig) {
      const k = key as keyof LoginForm;
      const field = loginFormConfig[k];
      if (field.validation) {
        const error = field.validation(values[k]);
        if (error) {
          newErrors[k] = error;
          hasError = true;
        }
      }
    }

    setErrors(newErrors);
    return !hasError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll()) {
      setFormError("Please fix the errors above");
      setShake(true);
      toast.error("Big Mistake! No worries it happens");
      setTimeout(() => setShake(false), 350);
      return;
    }

    try {
      setFormError("");
      const result = await login(values).unwrap();
      const token = result.accessToken ?? result.token;

      if (!token) throw new Error("No token received");

      let role: Role = "viewer";
      if (values.username === "emilys")   role = "admin";
      if (values.username === "michaelw") role = "analyst";
      if (values.username === "atuny0")   role = "operator";

      dispatch(setCredentials({ user: { ...result, role }, token }));
      toast.success(`Logged in as ${role.toUpperCase()} — Welcome!`);
      navigate("/dashboard");
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Invalid credentials";
      setFormError(message);
      setShake(true);
      setTimeout(() => setShake(false), 350);
      toast.error("Login Failed ❌ " + message);
      console.error(err);
    }
  };

  return (
    <div className="login-gradient min-h-screen flex items-center justify-center px-4">
      <div
        className={`
          w-full max-w-md p-8 rounded-xl
          bg-white/10 backdrop-blur-xl
          border border-white/20
          shadow-xl text-white
          ${shake ? "shake" : ""}
        `}
      >
        <h1 className="mb-6 text-3xl font-bold tracking-tight md:text-5xl lg:text-5xl">
          Atlas <span className="text-emerald-500">Command</span> Center
        </h1>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {(Object.keys(loginFormConfig) as Array<keyof LoginForm>).map((key) => {
            const field = loginFormConfig[key];
            return (
              <div key={key} className="flex flex-col gap-1">
                <input
                  type={field.inputType ?? "text"}
                  placeholder={field.placeholder}
                  value={values[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full px-4 py-3
                    rounded-xl bg-white/10
                    border border-white/20
                    outline-none focus:border-sky-400
                    transition-colors duration-200
                    placeholder:text-white/50"
                />
                {errors[key] && (
                  <p className="text-red-400 text-xs font-medium">
                    ⚠️ {errors[key]}
                  </p>
                )}
              </div>  
            );
          })}

          {formError && (
            <p className="text-red-400 text-sm -mt-2 font-medium">
              ⚠️ {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 py-3 rounded-lg
              bg-sky-500 hover:bg-sky-600
              active:scale-95
              transition-all duration-200
              font-semibold
              shadow-lg shadow-sky-500/30
              disabled:opacity-60"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
