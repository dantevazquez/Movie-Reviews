import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Profile() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [comments, setComments] = useState([]);


  const findMovieById = (movieId) => {
    return allMovies.find((movie) => movie.id === movieId);
  }

  const findReviewById = (reviewId) => {
    return allReviews.find((review) => review.id === reviewId);
  };

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${loggedInUser.id}`);
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/users/${loggedInUser.id}/reviews`);
        setReviews(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAllReviews = async () => {
      try {
        const response = await axios.get(`/api/reviews`);
        setAllReviews(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAllMovies = async () => {
      try {
        const response = await axios.get(`/api/movies`);
        setAllMovies(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/users/${loggedInUser.id}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
    fetchReviews();
    fetchComments();
    fetchAllReviews();
    fetchAllMovies();
  }, []);


  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the reviews state after successful deletion
      setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));

      // Fetch comments again after deleting the review
      const response = await axios.get(`/api/users/${user.id}/comments`);
      setComments(response.data);
      toast.success("Review Deleted");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setComments(comments.filter((comment) => comment.id !== commentId));
      toast.success("Comment Deleted");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      {user && (
        <div>
          <h3>User Information</h3>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>isAdmin: {user.isAdmin ? 'Yes' : 'No'}</p>
        </div>
      )}

      <h3>Reviews (Score | Review | Movie)</h3>
      {reviews.map((review) => (
        <div key={review.id} className="review-item">
          <button className="delete-button" onClick={() => handleDeleteReview(review.id)}>
            X
          </button>
          <p>
            {review.rating.toFixed(1)}{' '}
            <img
              src="https://img.icons8.com/doodle/48/potato--v1.png"
              className="potato-image"
              alt="Potato"
              style={{ marginBottom: '-5px' }}
            />
            {' | '}
            {review.textBody} | {findMovieById(review.movieId)?.name}
          </p>

        </div>
      ))}

      <h3>Comments (Comment | Review)</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          <button className="delete-button" onClick={() => handleDeleteComment(comment.id)}>
            X
          </button>
          <p>{comment.textBody} | {findReviewById(comment.reviewId)?.textBody}</p>

        </div>
      ))}
      <ToastContainer/>
    </div>
  );
}

export default Profile;
