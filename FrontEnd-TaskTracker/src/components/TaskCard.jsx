export default function TaskCard({
  task,
  onEdit,
  onDelete,
  showUser,
  index = 0,
}) {
  const done = task.status === "completed";
  return (
    <article
      style={{ animationDelay: `${index * 60}ms` }}
      className="card flex animate-rise items-start justify-between gap-4 overflow-hidden p-5 transition hover:-translate-y-0.5 hover:ring-brand/30"
    >
      <div className="min-w-0">
        <span className={`pill ${done ? "pill-completed" : "pill-pending"}`}>
          <span className="size-1.5 rounded-full bg-current" />
          {task.status}
        </span>
        <h3
          className={`mt-2 text-lg font-semibold ${done ? "line-through decoration-ink/30" : ""}`}
        >
          {task.title}
        </h3>
        <p className="mt-1 text-sm text-ink/65">
          {task.description || "No description"}
        </p>
        {showUser && (
          <small className="mt-2 block text-ink/50">
            Owner: {task.user?.name} ({task.user?.email})
          </small>
        )}
      </div>
      <div className="flex shrink-0 gap-2">
        <button className="btn" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
