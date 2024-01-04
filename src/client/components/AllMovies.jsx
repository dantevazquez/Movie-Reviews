import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import '../App.css';

function AllMovies() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  console.log("movies", movies);

  useEffect(() => {
    async function getMovies() {
      try {
        const { data: foundMovies } = await axios.get("/api/movies");
        setMovies(foundMovies);
      } catch (error) {
        console.error(error);
      }
    }

    getMovies();
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>All Movies</h2>

      <input
        type="text"
        placeholder="Search by movie name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredMovies.map((movie) => (
        <Link key={movie.id} to={`/movies/${movie.id}`} className="link-style">
          <div style={{ border: "2px solid black", cursor: 'pointer' }}>
            <h3>{movie.name}</h3>
            <img src={movie.imgLink} alt={movie.name} style={{ maxWidth: '100%' }} />
            <p>Average Rating: {movie.avgRating}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default AllMovies;