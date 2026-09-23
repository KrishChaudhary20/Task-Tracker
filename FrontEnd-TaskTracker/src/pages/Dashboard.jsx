import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadTasks() {
    try {
      setLoading(true);
      const res = await api.get("/tasks");
      setTasks(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function saveTask(data) {
    try {
      setSaving(true);
      if (editing) {
        await api.put(`/tasks/${editing.id}`, data);
      } else {
        await api.post("/tasks", data);
      }
      setEditing(null);
      setShowForm(false);
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save task");
    } finally {
      setSaving(false);
    }
  }

  async function deleteTask(id) {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete task");
    }
  }

  const stats = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    }),
    [tasks],
  );

  return (
    <>
      <Navbar />
      <main className="container">
        <section className="hero">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>Hello, {user?.name}</h1>
            <p>
              {user?.email} · {user?.role}
            </p>
          </div>
          <button
            className="primary"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            + New Task
          </button>
        </section>

        <div className="stats">
          <div className="card stat">
            <strong>{stats.total}</strong>
            <span>Total</span>
          </div>
          <div className="card stat">
            <strong>{stats.pending}</strong>
            <span>Pending</span>
          </div>
          <div className="card stat">
            <strong>{stats.completed}</strong>
            <span>Completed</span>
          </div>
        </div>

        {showForm && (
          <TaskForm
            task={editing}
            onSubmit={saveTask}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
            submitting={saving}
          />
        )}

        <ErrorMessage message={error} />

        <section className="section-heading">
          <div>
            <h2>My Tasks</h2>
            <p>Keep your work organized.</p>
          </div>
        </section>

        {loading ? (
          <Loading />
        ) : tasks.length === 0 ? (
          <div className="card empty">
            <h3>No tasks yet</h3>
            <p>Create your first task to get started.</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t) => {
                  setEditing(t);
                  setShowForm(true);
                }}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
