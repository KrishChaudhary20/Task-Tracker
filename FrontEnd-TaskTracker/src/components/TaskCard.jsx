export default function TaskCard({ task, onEdit, onDelete, showUser }) {
  return (
    <article className="card task-card">
      <div>
        <span className={`status ${task.status}`}>{task.status}</span>
        <h3>{task.title}</h3>
        <p>{task.description || "No description"}</p>
        {showUser && (
          <small>
            Owner: {task.user?.name} ({task.user?.email})
          </small>
        )}
      </div>
      <div className="actions">
        <button onClick={() => onEdit(task)}>Edit</button>
        <button className="danger" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
