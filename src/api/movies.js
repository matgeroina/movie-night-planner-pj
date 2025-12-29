const BASE_URL = "https://www.omdbapi.com/";

function getKey() {
  const key = import.meta.env.VITE_OMDB_KEY;
  if (!key) {
    throw new Error("Missing VITE_OMDB_KEY");
  }
  return key;
}

async function request(params) {
  const url = new URL(BASE_URL);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json();

  if (data.Response === "False") {
    throw new Error(data.Error || "OMDb error");
  }

  return data;
}

export async function searchMovies({ query, page = 1, type, year }) {
  return request({
    apikey: getKey(),
    s: query,
    page,
    type,
    y: year,
  });
}

export async function getMovieById(id) {
  return request({
    apikey: getKey(),
    i: id,
    plot: "full",
  });
}
