import { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import { searchMovies } from "../api/movies";
import { useLocalStorage } from "../hooks/useLocalStorage";
import Loader from "../components/Loader";

export default function Home() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [favorites, setFavorites] = useLocalStorage("favorites", []);

  function toggleFavorite(id) {
    setFavorites((prev) => {
      const has = prev.includes(id);
      return has ? prev.filter((x) => x !== id) : [...prev, id];
    });
  }

  async function runSearch(nextPage = 1) {
    const q = query.trim();
    if (q.length < 2) {
      setError("Type at least 2 characters.");
      setItems([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await searchMovies({ query: q, page: nextPage });
      setItems(data.Search || []);
      setTotal(Number(data.totalResults || 0));
      setPage(nextPage);
    } catch (e) {
      setError(e.message || "Something went wrong");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  const canPrev = page > 1;
  const canNext = page * 10 < total;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <h1 style={{ margin: 0 }}>Movie Night Planner</h1>

      <SearchBar
        value={query}
        onChange={setQuery}
        onSubmit={() => runSearch(1)}
        disabled={loading}
      />

      {loading && <Loader label="Searching…" />}

      {error && <p className="card">Error: {error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="card">Try searching for a movie title above.</p>
      )}

      {items.length > 0 && (
        <div
          className="card"
          style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}
        >
          <div>
            Found: <b>{total}</b> results • Page <b>{page}</b>
            <span style={{ marginLeft: 10, opacity: 0.85 }}>
              Favorites: <b>{favorites.length}</b>
            </span>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" disabled={!canPrev || loading} onClick={() => runSearch(page - 1)}>
              Prev
            </button>
            <button className="btn" disabled={!canNext || loading} onClick={() => runSearch(page + 1)}>
              Next
            </button>

            <Link className="btn" to="/favorites">
              Go to Favorites →
            </Link>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="grid">
          {items.map((m) => (
            <MovieCard
              key={m.imdbID}
              movie={m}
              isFavorite={favorites.includes(m.imdbID)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
