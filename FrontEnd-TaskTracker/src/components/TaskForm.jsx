import { useEffect, useState } from "react";

const initial = { title: "", description: "", status: "pending" };

export default function TaskForm({ task, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(
      task
        ? {
            title: task.title || "",
            description: task.description || "",
            status: task.status || "pending",
          }
        : initial,
    );
    setError("");
  }, [task]);

  function update(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    setError("");
    await onSubmit(form);
    if (!task) setForm(initial);
  }

  return (
    <form className="card form-card" onSubmit={submit}>
      <h2>{task ? "Edit task" : "Create task"}</h2>
      {error && <div className="alert error">{error}</div>}
      <label>
        Title
        <input
          name="title"
          value={form.title}
          onChange={update}
          placeholder="Task title"
        />
      </label>
      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={update}
          placeholder="Optional description"
        />
      </label>
      <label>
        Status
        <select name="status" value={form.status} onChange={update}>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </label>
      <div className="actions">
        <button className="primary" disabled={submitting}>
          {submitting ? "Saving..." : task ? "Update" : "Create"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
