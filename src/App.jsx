import { NavLink, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Favorites.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";

export default function App() {
  return (
    <div className="container">
      <header className="nav">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/favorites">Favorites</NavLink>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/movie/:id" element={<MovieDetails />} />

        <Route path="*" element={<p>Page not found</p>}></Route>
      </Routes>
    </div>
  );
}