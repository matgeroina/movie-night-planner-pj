export default function Loader({ label = "Loading…" }) {
  return (
    <div className="card" style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span className="spinner" aria-hidden="true" />
      <span style={{ opacity: 0.9 }}>{label}</span>
    </div>
  );
}
