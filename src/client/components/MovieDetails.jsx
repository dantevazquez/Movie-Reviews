import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Review from './Review';

function MovieDetails() {
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const { id } = useParams();
  
    useEffect(() => {
      async function getMovieDetails() {
        try {
          const { data: movieData } = await axios.get(`/api/movies/${id}`);
          setMovie(movieData);
  
          const { data: reviewsData } = await axios.get(`/api/reviews/${id}`);
          setReviews(reviewsData);
        } catch (error) {
          console.error(error);
        }
      }
  
      getMovieDetails();
    }, [id]);
  
    if (!movie) {
      return <div>Loading...</div>;
    }
  
    return (
      <div>
        <h2>{movie.name}</h2>
        <img src={movie.imgLink} alt={movie.name} style={{ maxWidth: '100%' }} />
        <p>Average Rating: {movie.avgRating}</p>
        <p>Genre: {movie.genre}</p>
        <p>Release Year: {movie.releaseYear}</p>
        <p>Director: {movie.director}</p>
  
        <h3>Reviews</h3>
        {reviews.map((review) => (
          <Review key={review.id} review={review} />
        ))}
      </div>
    );
  }
  
  export default MovieDetails;
