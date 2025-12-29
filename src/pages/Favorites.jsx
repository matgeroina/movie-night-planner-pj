import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { getMovieById } from "../api/movies";
import Loader from "../components/Loader";

export default function Favorites() {
  const [favorites, setFavorites] = useLocalStorage("favorites", []);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ids = useMemo(() => favorites, [favorites]);

  function toggleFavorite(id) {
    setFavorites((prev) => prev.filter((x) => x !== id));
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (ids.length === 0) {
        setMovies([]);
        setError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {

        const results = await Promise.all(
          ids.map((id) => getMovieById(id))
        );

        if (!cancelled) setMovies(results);
      } catch (e) {
        if (!cancelled) {
          setError(e.message || "Failed to load favorites");
          setMovies([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [ids]);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
        <h1 style={{ margin: 0 }}>Favorites</h1>
        <Link className="btn" to="/">← Back to search</Link>
      </div>

      {ids.length === 0 && (
        <div className="card" style={{ display: "grid", gap: 10 }}>
          <b>No favorites yet</b>
          <div style={{ opacity: 0.85, padding: 20}}>
            Go to Home, search something, and tap ☆ Favorite.
          </div>
          <div>
            <Link className="btn" to="/" style={{marginTop: 20, marginBottom: 20}}>Go search</Link>
          </div>
        </div>
      )}

      {loading && <Loader label="Loading favorites…" />}

      {error && <p className="card">Error:{error}</p>}

      {!loading && !error && movies.length > 0 && (
        <div className="grid">
          {movies.map((m) => (
            <MovieCard
              key={m.imdbID}
              movie={m}
              isFavorite={true}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
