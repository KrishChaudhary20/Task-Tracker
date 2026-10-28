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
      setError("Add a title before saving");
      return;
    }
    setError("");
    const ok = await onSubmit(form);
    if (!task && ok !== false) setForm(initial); // keep the text if saving failed
  }

  return (
    <form className="card mb-6 animate-pop space-y-4 p-6" onSubmit={submit}>
      <h2 className="text-xl font-bold">{task ? "Edit task" : "New task"}</h2>
      {error && (
        <div
          key={error}
          role="alert"
          className="animate-shake rounded-xl bg-danger/10 px-4 py-2.5 text-sm font-medium text-danger"
        >
          {error}
        </div>
      )}
      <label className="label">
        Title
        <input
          className="field"
          name="title"
          value={form.title}
          onChange={update}
          placeholder="What needs doing?"
          autoFocus
        />
      </label>
      <label className="label">
        Description
        <textarea
          className="field min-h-24 resize-y"
          name="description"
          value={form.description}
          onChange={update}
          placeholder="Optional details"
        />
      </label>
      <label className="label">
        Status
        <select
          className="field"
          name="status"
          value={form.status}
          onChange={update}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </label>
      <div className="flex gap-2">
        <button className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving…" : task ? "Save changes" : "Create task"}
        </button>
        {onCancel && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
