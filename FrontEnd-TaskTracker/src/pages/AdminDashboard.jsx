import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import api from "../services/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      const [usersRes, tasksRes] = await Promise.all([
        api.get("/users"),
        api.get("/tasks"),
      ]);
      setUsers(usersRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load admin data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function deleteUser(id) {
    if (!window.confirm("Delete this user and their tasks?")) return;
    try {
      await api.delete(`/users/${id}`);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete user");
    }
  }

  if (loading)
    return (
      <>
        <Navbar />
        <Loading />
      </>
    );

  return (
    <>
      <Navbar />
      <main className="container">
        <div className="hero">
          <div>
            <p className="eyebrow">Administration</p>
            <h1>Admin Dashboard</h1>
            <p>Manage users and review all tasks.</p>
          </div>
        </div>
        <ErrorMessage message={error} />

        <section>
          <h2>All Users</h2>
          <div className="table-wrap card">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      {u.role !== "admin" && (
                        <button
                          className="danger"
                          onClick={() => deleteUser(u.id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>All Tasks</h2>
          <div className="table-wrap card">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id}>
                    <td>{t.title}</td>
                    <td>{t.user?.name}</td>
                    <td>
                      <span className={`status ${t.status}`}>{t.status}</span>
                    </td>
                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
