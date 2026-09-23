import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

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

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      return setError("Name, email and password are required");
    }
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters");
    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match");

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
    <main className="auth-page">
      <form className="card auth-card" onSubmit={submit}>
        <h1>Create account</h1>
        <p>Start managing your tasks.</p>
        {error && <div className="alert error">{error}</div>}
        <label>
          Name
          <input name="name" value={form.name} onChange={update} />
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={update}
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={update}
          />
        </label>
        <label>
          Confirm password
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={update}
          />
        </label>
        <button className="primary full" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
        <p className="center-text">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
