import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
    isActive ? "bg-brand/10 text-brand" : "text-ink/70 hover:bg-ink/5"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  const links = (
    <>
      <NavLink
        to="/dashboard"
        className={linkClass}
        onClick={() => setOpen(false)}
      >
        Dashboard
      </NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-display text-lg font-bold"
        >
          <span className="grid size-7 place-items-center rounded-lg bg-brand text-sm text-white">
            ✓
          </span>
          TaskTracker
        </Link>
        <nav className="hidden items-center gap-1 sm:flex">
          {links}
          <button className="btn ml-2" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
