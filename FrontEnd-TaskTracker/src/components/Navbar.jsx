import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <Link to="/dashboard" className="brand">
        TaskTracker
      </Link>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}
        <button className="link-button" onClick={logout}>
          Logout
        </button>
      </nav>
    </header>
  );
}
