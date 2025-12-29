export default function SearchBar({ value, onChange, onSubmit, disabled }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="card"
      style={{ display: "flex", gap: 10, alignItems: "center" }}
    >
      <input
        className="input"
        placeholder="Search movies…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button className="btn primary" type="submit" disabled={disabled}>
  Search
</button>

    </form>
  );
}
