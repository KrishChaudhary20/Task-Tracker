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
      if (editing) await api.put(`/tasks/${editing.id}`, data);
      else await api.post("/tasks", data);
      setEditing(null);
      setShowForm(false);
      await loadTasks();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save task");
      return false;
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
 
  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "completed").length;
    return { total: tasks.length, completed, pending: tasks.length - completed };
  }, [tasks]);
  const pct = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
 
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold">Hello, {user?.name}</h1>
            <p className="mt-1 text-ink/60">{user?.email} · {user?.role}</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => { setEditing(null); setShowForm(true); }}
          >
            + New task
          </button>
        </section>
 
        <section className="card mt-6 p-5" aria-label="Progress">
          <div className="flex items-baseline justify-between">
            <p className="font-display text-lg font-bold">
              {stats.completed} of {stats.total} done
            </p>
            <p className="text-sm text-ink/60">{stats.pending} pending</p>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-done transition-[width] duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </section>
 
        <div className="mt-6">
          {showForm && (
            <TaskForm
              task={editing}
              onSubmit={saveTask}
              onCancel={() => { setShowForm(false); setEditing(null); }}
              submitting={saving}
            />
          )}
        </div>
 
        <ErrorMessage message={error} />
 
        <h2 className="mb-4 text-2xl font-bold">My tasks</h2>
 
        {loading ? (
          <Loading />
        ) : tasks.length === 0 ? (
          <div className="card animate-pop p-10 text-center">
            <h3 className="text-xl font-bold">No tasks yet</h3>
            <p className="mt-1 text-ink/60">Create your first task to get started.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {tasks.map((task, i) => (
              <TaskCard
                key={task.id}
                index={i}
                task={task}
                onEdit={(t) => { setEditing(t); setShowForm(true); }}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}