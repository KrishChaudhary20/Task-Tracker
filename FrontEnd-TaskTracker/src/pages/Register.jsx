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
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  }

  async function submit(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      return setError("Name, email and password are required");
    }

    if (form.password.length < 6) {
      return setError("Use at least 6 characters for your password");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords don't match");
    }

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      console.log("Registration successful:", response.data);

      navigate("/login", {
        state: { message: "Account created successfully. Please log in." },
      });

    } catch (err) {
      console.error("Registration error:", err);

      if (err.response) {
        setError(
          err.response.data?.message ||
          `Registration failed (${err.response.status})`
        );
      } else if (err.request) {
        setError("Unable to connect to server. Please try again.");
      } else {
        setError(err.message || "Unable to register");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <form
        className="card w-full max-w-md animate-rise p-8"
        onSubmit={submit}
      >
        <h1 className="text-3xl font-extrabold">Create account</h1>

        <p className="mt-1 text-ink/60">
          Start organizing your tasks.
        </p>

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
                required={name !== "confirmPassword"}
                disabled={loading}
              />
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-6 w-full py-3"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create account"}
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
