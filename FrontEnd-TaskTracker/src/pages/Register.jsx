import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import ErrorMessage from "../components/ErrorMessage";

const fields = [
  ["name", "Name", "text", "name"],
  ["email", "Email", "email", "email"],
  ["password", "Password", "password", "new-password"],
  ["confirmPassword", "Confirm password", "password", "new-password"],
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password)
      return setError("Name, email and password are required");
    if (form.password.length < 6)
      return setError("Use at least 6 characters for your password");
    if (form.password !== form.confirmPassword)
      return setError("Passwords don't match");

    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to register");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <form className="card w-full max-w-md animate-rise p-8" onSubmit={submit}>
        <h1 className="text-3xl font-extrabold">Create account</h1>
        <p className="mt-1 text-ink/60">Start organizing your tasks.</p>
        <ErrorMessage message={error} />
        <div className="mt-6 space-y-4">
          {fields.map(([name, label, type, auto]) => (
            <label key={name} className="label">
              {label}
              <input
                className="field"
                name={name}
                type={type}
                autoComplete={auto}
                value={form[name]}
                onChange={update}
              />
            </label>
          ))}
        </div>
        <button className="btn btn-primary mt-6 w-full py-3" disabled={loading}>
          {loading ? "Creating…" : "Create account"}
        </button>
        <p className="mt-5 text-center text-sm text-ink/60">
          Already registered?{" "}
          <Link
            to="/login"
            className="font-semibold text-brand hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
