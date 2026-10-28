export default function Loading() {
  return (
    <div
      className="flex items-center justify-center gap-2 py-16 text-ink/60"
      role="status"
    >
      <span className="size-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      Loading…
    </div>
  );
}
