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
    <div className="details-page">
      <Link className="btn" to="/">← Back to Search</Link>

      <div className="card details-card">
        <img
          className="details-poster"
          src={poster}
          alt={`${movie.Title} poster`}
        />

        <div className="details-content">
          <h1>{movie.Title}</h1>

          <div className="details-meta">
            {movie.Year} • {movie.Runtime} • {movie.Genre}
          </div>

          <div>
            ⭐ IMDb rating: <b>{movie.imdbRating}</b>
          </div>

          <p className="details-plot">{movie.Plot}</p>

          <div className="details-actions">
            <button className="btn" onClick={toggleFavorite}>
              {isFavorite ? "★ Remove from favorites" : "☆ Add to favorites"}
            </button>

            {movie.Website && movie.Website !== "N/A" && (
              <a
                className="btn"
                href={movie.Website}
                target="_blank"
                rel="noreferrer"
              >
                Official site
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
