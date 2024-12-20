import { useEffect, useState } from "react";
import StarRating from "./StarRating";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const KEY = "1229dbd8";

export default function App() {
  const [query, setQuery] = useState("test");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [errors, setError] = useState("");
  const [selectMovie, setselectMoive] = useState();
  const [rating, SetRating] = useState("");

  function handleselectedMovie(id) {
    setselectMoive((select) => (select === id ? null : id));
  }

  function handleCloseMovie() {
    setselectMoive(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleDelectWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(function () {
    function callback(e) {
      if (e.code === "Escape") {
        handleCloseMovie();
        console.log("CLOSING");
      }
    }
    document.addEventListener("keydown", callback);
    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, []);

  useEffect(
    function () {
      //AbortController 接口表示一个控制器对象，允许你根据需要中止一个或多个 Web 请求。
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("someting went wrong with fetching movies");

          const data = await res.json();
          setMovies(data.Search);
          console.log(data.Search);
        } catch (err) {
          console.error(err.message);

          if (err.name !== "AbortError") {
            setError(err.message);
            setError("");
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  function Errormessage() {
    return (
      <p className="error">
        <span>{errors}</span>
      </p>
    );
  }

  function Load() {
    return <div className="loader">Loading.......</div>;
  }

  return (
    <>
      <NavBar>
        <Logo />
        <Input query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>
      ;
      <Main>
        {/* <ListBox element={<ListLeft movies={movies} />} />
        <WatchBox
          element={
            <>
              <Summary watched={watched} />
              <ListRight watched={watched} />
            </>
          }
        /> */}

        <ListBox>
          {isloading && <Load />}
          {!isloading && !errors && (
            <ListLeft movies={movies} selectedMovie={handleselectedMovie} />
          )}
          {errors && <Errormessage />}
        </ListBox>
        <WatchBox>
          {selectMovie ? (
            <MovieDetail
              watched={watched}
              rating={rating}
              selectMovie={selectMovie}
              handleCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              onSetRating={SetRating}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <ListRight
                watched={watched}
                onDelectWatched={handleDelectWatched}
              />
            </>
          )}
        </WatchBox>
      </Main>
    </>
  );
}

function MovieDetail({
  selectMovie,
  handleCloseMovie,
  onAddWatched,
  onSetRating,
  rating,
  watched,
}) {
  const [movie, setMovie] = useState({});

  function handleAdd() {
    const newMovie = { ...movie, userRating: `${rating}` };
    console.log(newMovie);

    onAddWatched(newMovie);
  }

  const isWatched = watched.map((mov) => mov.imdbID).includes(movie.imdbID);

  const WatchedUserRating = watched.find(
    (mov) => mov.imdbID === movie.imdbID
  )?.userRating;

  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectMovie}`
          );
          const data = await res.json();
          setMovie(data);
          console.log(data);
        } catch (err) {}
      }
      getMovieDetails();
    },
    [selectMovie]
  );

  useEffect(
    function () {
      document.title = `Movie | ${movie.Title}`;

      return function () {
        document.title = "usePopcorn";
        console.log(`Clean up effect for movie ${movie.Title}`);
      };
    },
    [movie.Title]
  );

  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={() => handleCloseMovie()}>
          &larr;
        </button>
        <img src={movie.Poster} alt={`Poster of ${movie}`} />
        <div className="details-overview">
          <h2>{movie.Title}</h2>
          <p>
            {movie.Released} &bull; {movie.Runtime}
          </p>
          <p>{movie.Genre}</p>
          <p>
            <span>⭐</span>
            {movie.imdbRating}
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
          {!isWatched ? (
            <>
              {" "}
              <StarRating maxRating={10} size={24} onSetRating={onSetRating} />
              <button className="btn-add" onClick={handleAdd}>
                Add to list
              </button>
            </>
          ) : (
            <p className="isWatched">
              You have watched this movie {WatchedUserRating} ⭐
            </p>
          )}
        </div>

        <p>
          <em>{movie.Plot}</em>
        </p>
        <p>Starring {movie.Actors}</p>
        <p>Directed by {movie.Director}</p>
      </section>
    </div>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function ListBox({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  );
}

function WatchBox({ children }) {
  const [isOpen2, setIsOpen2] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && children}
    </div>
  );
}

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Movie({ movie, selectedMovie }) {
  return (
    <li onClick={() => selectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function ListLeft({ movies, selectedMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} selectedMovie={selectedMovie} />
      ))}
    </ul>
  );
}

function ListRight({ watched, onDelectWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.Runtime}</span>
            </p>
          </div>
          <button
            className="btn-delete"
            onClick={() => onDelectWatched(movie.imdbID)}
          >
            ❌
          </button>
        </li>
      ))}
    </ul>
  );
}

function Summary({ watched }) {
  const avgImdbRating = average(
    watched.map((movie) => movie.imdbRating)
  ).toFixed(2);
  const avgUserRating = average(
    watched.map((movie) => Number(movie.userRating))
  ).toFixed(2);
  const avgRuntime = average(
    watched.map((movie) => Number(movie.Runtime.split(" ").at(0)))
  ).toFixed(2);
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Input({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}
