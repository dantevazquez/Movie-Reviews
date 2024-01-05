import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Review from './Review';

function MovieDetails() {
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [textBody, setTextBody] = useState('');
  const { id } = useParams();

  //Gets the movie data and review data to later display
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token');
  
      //if token is not valid, don't let the user submit a review
      if (!token) {
        console.error('User not authenticated');
        window.alert('You must log in before you can submit a review!');
        return;
      }
  
      //convert string number to a number
      const numericRating = parseInt(rating, 10);
      const reviewData = { rating: numericRating, textBody };
  
      //post data to server
      const response = await axios.post(
        `/api/reviews/${id}`,
        reviewData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Fetch the updated movie data including the average rating
      const { data: updatedMovieData } = await axios.get(`/api/movies/${id}`);
      setMovie(updatedMovieData);
  
      // Fetch the updated reviews data
      const updatedReviews = await axios.get(`/api/reviews/${id}`);
      setReviews(updatedReviews.data);
  
      // Clear the form fields
      setRating(0);
      setTextBody('');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };
  
  
  //give prog time to load movie
  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{movie.name}</h2>
      <img src={movie.imgLink} alt={movie.name} style={{ maxWidth: '100%' }} />
      <p>Average Rating: {movie.avgRating.toFixed(1)}</p>
      <p>Genre: {movie.genre}</p>
      <p>Release Year: {movie.releaseYear}</p>
      <p>Director: {movie.director}</p>

      <h3>Reviews</h3>
      {reviews.map((review) => (
        <Review key={review.id} review={review} />
      ))}

      <h3>Write a Review</h3>
      <form onSubmit={handleReviewSubmit}>
        <label>
          Rating:
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
          />
        </label>
        <br />
        <label>
          Review:
          <textarea
            value={textBody}
            onChange={(e) => setTextBody(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
}

export default MovieDetails;
