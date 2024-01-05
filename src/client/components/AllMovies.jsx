// Import necessary libraries
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

// AllMovies component
function AllMovies() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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
      <input
        className='search-bar'
        type="text"
        placeholder="Search by movie name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="movies-container">
        {filteredMovies.map((movie) => (
          <Link key={movie.id} to={`/movies/${movie.id}`} className="link-style">
            <div className="movie-item">
              <img src={movie.imgLink} alt={movie.name} />
              <h3 className='movie-name'>{movie.name}</h3>

              <div className='rating-container'>
                <p className='avg-rating'>{movie.avgRating.toFixed(1)}</p>
                <img src="https://img.icons8.com/doodle/48/potato--v1.png" alt="Potato" className="potato-image" />
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AllMovies;
