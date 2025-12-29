import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMovieById } from "../api/movies";
import { useLocalStorage } from "../hooks/useLocalStorage";
import Loader from "../components/Loader";


const FALLBACK_POSTER =
  "https://via.placeholder.com/300x445?text=No+Poster";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [favorites, setFavorites] = useLocalStorage("favorites", []);
  const isFavorite = favorites.includes(id);

  function toggleFavorite() {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await getMovieById(id);
        if (!cancelled) setMovie(data);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load movie");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <Loader label="Loading movie…" />;

  if (error) return <p className="card">Error: {error}</p>;
  if (!movie) return null;

  const poster =
    movie.Poster && movie.Poster !== "N/A" ? movie.Poster : FALLBACK_POSTER;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <Link className="btn" to="/">← Back</Link>

      <div className="card" style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}>
        <img
          src={poster}
          alt={`${movie.Title} poster`}
          style={{
            width: "100%",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />

        <div style={{ display: "grid", gap: 10 }}>
          <h1 style={{ margin: 0 }}>{movie.Title}</h1>

          <div style={{ opacity: 0.85 }}>
            {movie.Year} • {movie.Runtime} • {movie.Genre}
          </div>

          <div>
            ⭐ IMDb rating: <b>{movie.imdbRating}</b>
          </div>

          <p style={{ lineHeight: 1.5 }}>{movie.Plot}</p>

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button className="btn" onClick={toggleFavorite}>
              {isFavorite ? "★ Remove from favorites" : "☆ Add to favorites"}
            </button>

            {movie.Website && movie.Website !== "N/A" && (
              <a className="btn" href={movie.Website} target="_blank" rel="noreferrer">
                Official site
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
