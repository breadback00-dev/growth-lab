interface MetricTileProps {
  label: string;
  value: string;
  detail: string;
  tone?: "neutral" | "good" | "warn";
}

export default function MetricTile({
  label,
  value,
  detail,
  tone = "neutral"
}: MetricTileProps) {
  return (
    <article className={`metric-tile ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}
