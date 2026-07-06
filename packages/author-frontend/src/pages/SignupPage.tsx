import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { signup as signupApi } from "../api";
import { Field, ErrorAlert } from "../components/ui";
import type { SignupFormData } from "../types";
import { Logo } from "../components/Logo";
import { Navigate, NavLink } from "react-router";

const EMPTY: SignupFormData = {
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  confirmPassword: ""
};

export default function SignupPage() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const [fields, setFields] = useState<SignupFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // clear inline error on change
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate(): boolean {
    const newErrors: Partial<SignupFormData> = {};

    const { firstName, lastName, username, password } = fields;

    if (!firstName.trim()) newErrors.firstName = "Required";
    if (!lastName.trim()) newErrors.lastName = "Required";
    if (!username.trim()) newErrors.username = "Required";
    if (password.length < 6) newErrors.password = "At least 6 characters";
    if (fields.password !== fields.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setServerError(null);
    setSubmitting(true);
    try {
      const { token, user } = await signupApi(fields);
      login(token, user);
      setIsLogin(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Signup failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return isLogin ? (
    <Navigate to="/" />
  ) : (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8">
          <Logo />
          <p className="font-display text-xs tracking-[0.08em] uppercase text-slate">
            Create your author account
          </p>
        </div>

        {/* Card */}
        <div className="border border-border p-8">
          <h1 className="font-display font-bold text-lg text-parchment mb-6">
            Sign up
          </h1>

          {serverError && (
            <div className="mb-5">
              <ErrorAlert message={serverError} />
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <Field
                id="firstName"
                label="First name"
                value={fields.firstName}
                onChange={handleChange}
                placeholder="John"
                required
                autoComplete="given-name"
                error={errors.firstName}
              />
              <Field
                id="lastName"
                label="Last name"
                value={fields.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
                autoComplete="family-name"
                error={errors.lastName}
              />
            </div>

            <Field
              id="username"
              label="Username"
              value={fields.username}
              onChange={handleChange}
              placeholder="john_doe"
              required
              autoComplete="username"
              error={errors.username}
            />

            <Field
              id="password"
              label="Password"
              type="password"
              value={fields.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              required
              autoComplete="new-password"
              error={errors.password}
            />

            <Field
              id="confirmPassword"
              label="Confirm password"
              type="password"
              value={fields.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat password"
              required
              autoComplete="new-password"
              error={errors.confirmPassword}
            />

            <button
              type="submit"
              disabled={submitting}
              className="
                mt-2 bg-brand text-white font-display font-bold
                text-xs tracking-[0.08em] uppercase py-3
                hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed
                transition-opacity duration-150
              "
            >
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center font-display text-xs text-slate mt-5">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-brand hover:opacity-80 transition-opacity
            font-semibold"
          >
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
}
