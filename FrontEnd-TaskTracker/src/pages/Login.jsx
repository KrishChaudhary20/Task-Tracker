import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.email.trim() || !form.password) {
      setError("Enter your email and password");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from?.pathname || "/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to log in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form className="card w-full max-w-md animate-rise p-8" onSubmit={submit}>
        <h1 className="text-3xl font-extrabold">Welcome back</h1>
        <p className="mt-1 text-ink/60">Log in to manage your tasks.</p>
        <ErrorMessage message={error} />
        <div className="mt-6 space-y-4">
          <label className="label">
            Email
            <input
              className="field"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={update}
            />
          </label>
          <label className="label">
            Password
            <input
              className="field"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={update}
            />
          </label>
        </div>
        <button className="btn btn-primary mt-6 w-full py-3" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </button>
        <p className="mt-5 text-center text-sm text-ink/60">
          No account?{" "}
          <Link
            to="/register"
            className="font-semibold text-brand hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>
    </main>
  );
}
