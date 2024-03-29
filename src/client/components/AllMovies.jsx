import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';
import { MdExpandMore } from "react-icons/md";

// AllMovies component
function AllMovies() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const source = axios.CancelToken.source();

    async function getMovies() {
      setLoading(true);
      try {
        const { data: foundMovies } = await axios.get(`/api/movies?search=${searchTerm}&page=${page}`, {
          cancelToken: source.token,
        });
        setMovies((prevMovies) => [...prevMovies, ...foundMovies]);
        setLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          console.error(error);
        }
        setLoading(false);
      }
    }

    getMovies();

    return () => {
      source.cancel();
    };
  }, [page, searchTerm]);

  const loadMoreMovies = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className='parent-container-allmovies'>

      <div className='search-bar'>
        <input
          type="text"
          placeholder="Search by movie name"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // Reset page number to 1 when a new search is performed
            setMovies([]); // Clear the current movies when a new search is performed
          }}
        />
      </div>
      <div className='scroll-box-allmovies'>

        <div className="movies-container">

          {movies.map((movie) => (
            <Link key={movie.id} to={`/movies/${movie.id}`} className="link-style">
              <div className="movie-item">
                <img className='movie-poster' src={movie.imgLink} alt={movie.name} loading='lazy' />
                <h3 className='movie-name'>{movie.name}</h3>

                <div className='rating-container'>
                  <p className='avg-rating'>{movie.avgRating.toFixed(1)}</p>
                  <img src="https://img.icons8.com/doodle/48/potato--v1.png" alt="Potato" className="potato-image" />
                </div>

              </div>
            </Link>
          ))}
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <div className="load-more-border" ></div>
            <button className='load-more-button' onClick={loadMoreMovies}>
              <MdExpandMore size={58}/>
            </button>
          </div>
        )}
      </div>


    </div>
  );

}

export default AllMovies;
