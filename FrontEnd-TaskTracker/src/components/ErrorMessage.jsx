export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div
      key={message}
      role="alert"
      className="my-4 animate-shake rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
    >
      {message}
    </div>
  );
}
