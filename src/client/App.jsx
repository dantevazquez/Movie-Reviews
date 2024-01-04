import { Route, Routes } from "react-router-dom";
import AllMovies from "./components/AllMovies";
import MovieDetails from "./components/MovieDetails";
import CommentsPage from "./components/CommentsPage";
import NavBar from "./components/NavBar";
import SignInRegisterPage from "./components/SignInRegisterPage";
import CreateAccountPage from "./components/CreateAccountPage";
import Profile from "./components/Profile";
import AdminPage from "./components/AdminPage";

function App() {
 
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<AllMovies/>}></Route>
        <Route path="/movies/:id" element={<MovieDetails/>} />
        <Route path="/reviews/:reviewId/comments" element={<CommentsPage/>} />
        <Route path="/signin-register" element={<SignInRegisterPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}

export default App;
