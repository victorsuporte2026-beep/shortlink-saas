export function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string | number
  hint?: string
}) {
  return (
    <article className="card stat-card">
      <span className="muted small">{label}</span>
      <strong className="stat-value">{value}</strong>
      {hint ? <p className="muted small">{hint}</p> : null}
    </article>
  )
}
