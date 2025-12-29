import { Link } from "react-router-dom";

const FALLBACK_POSTER =
  "https://via.placeholder.com/300x445?text=No+Poster";

export default function MovieCard({ movie, isFavorite, onToggleFavorite }) {
  const poster = movie.Poster && movie.Poster !== "N/A" ? movie.Poster : FALLBACK_POSTER;

  return (
    <div className="card" style={{ display: "grid", gap: 10 }}>
      <img
        src={poster}
        alt={`${movie.Title} poster`}
        style={{
          width: "100%",
          aspectRatio: "2 / 3",
          objectFit: "cover",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        loading="lazy"
      />

      <div style={{ display: "grid", gap: 4 }}>
        <b style={{ lineHeight: 1.2 }}>{movie.Title}</b>
        <div style={{ opacity: 0.85, fontSize: 14 }}>
          {movie.Year} • {movie.Type}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <Link className="btn" to={`/movie/${movie.imdbID}`}>
          Details
        </Link>

        <button
          className="btn"
          type="button"
          onClick={() => onToggleFavorite(movie.imdbID)}
          aria-pressed={isFavorite}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "★" : "☆"} Favorite
        </button>
      </div>
    </div>
  );
}