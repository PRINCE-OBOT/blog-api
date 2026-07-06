import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { login as loginApi } from "../api";
import { Field, ErrorAlert } from "../components/ui";
import { Logo } from "../components/Logo";
import { Navigate, NavLink } from "react-router";

export default function LoginPage() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const [fields, setFields] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { token, user } = await loginApi(fields);
      login(token, user);
      setIsLogin(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return isLogin ? (
    <Navigate to="/" />
  ) : (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8">
          <Logo />
          <p className="font-display text-xs tracking-[0.08em] uppercase text-slate">
            Author Access Only
          </p>
        </div>

        {/* Card */}
        <div className="border border-border p-8">
          <h1 className="font-display font-bold text-lg text-parchment mb-6">
            Sign in
          </h1>

          {error && (
            <div className="mb-5">
              <ErrorAlert message={error} />
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            <Field
              id="username"
              label="Username"
              value={fields.username}
              onChange={handleChange}
              placeholder="Username"
              required
              autoComplete="username"
            />
            <Field
              id="password"
              label="Password"
              type="password"
              value={fields.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            <button
              type="submit"
              disabled={submitting || !fields.username || !fields.password}
              className="
                mt-2 bg-brand text-white font-display font-bold
                text-xs tracking-[0.08em] uppercase py-3
                hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed
                transition-opacity duration-150
              "
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        {/* Switch to signup */}
        <p className="text-center font-display text-xs text-slate mt-5">
          Don't have an account?{" "}
          <NavLink
            to="/signup"
            className="text-brand hover:opacity-80 transition-opacity
            font-semibold"
          >
            Sign up
          </NavLink>
        </p>
      </div>
    </div>
  );
}
