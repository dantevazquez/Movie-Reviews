import { Route, Routes } from "react-router-dom";
import AllMovies from "./components/AllMovies";
import MovieDetails from "./components/MovieDetails";
import CommentsPage from "./components/CommentsPage";

function App() {
 
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<AllMovies/>}></Route>
        <Route path="/movies/:id" element={<MovieDetails/>} />
        <Route path="/reviews/:reviewId/comments" element={<CommentsPage/>} />
      </Routes>
    </div>
  );
}

export default App;
