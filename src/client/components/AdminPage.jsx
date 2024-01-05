import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const AdminPage = () => {
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);


  const [newMovie, setNewMovie] = useState({
    name: '',
    genre: '',
    releaseYear: '',
    director: '',
    imgLink: '',
  });

  const [selectedGenre, setSelectedGenre] = useState('');

  //handles all input changes minus genre
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const newValue = name === 'releaseYear' ? parseInt(value, 10) : value;

    setNewMovie((prevMovie) => ({
      ...prevMovie,
      [name]: newValue,
    }));
  };

  //handles genre drop down in add movie form
  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setNewMovie((prevMovie) => ({
      ...prevMovie,
      genre: e.target.value,
    }));
  };

  //Handle add movie form
  const handleAddMovie = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post('/api/movies', newMovie, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const addedMovie = response.data;

      setMovies((prevMovies) => [...prevMovies, addedMovie]);

      // Clear the form after successful submission
      setNewMovie({
        name: '',
        genre: '',
        releaseYear: '',
        director: '',
        imgLink: '',
      });
      setSelectedGenre('');
    } catch (error) {
      console.error(error);
    }
  };

  //When a delete putton is pressed, this does the magic
  const handleDeleteItem = async (type, itemId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this ${type}?`);

    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('Token not found. User may not be logged in.');
          return;
        }

        const response = await axios.delete(`/api/${type}s/${itemId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response);

        // Update the state to reflect the deletion
        switch (type) {
          case 'movie':
            setMovies(prevMovies => prevMovies.filter(movie => movie.id !== itemId));
            break;
          case 'review':
            setReviews(prevReviews => prevReviews.filter(review => review.id !== itemId));
            break;
          case 'comment':
            setComments(prevComments => prevComments.filter(comment => comment.id !== itemId));
            break;
          case 'user':
            setUsers(prevUsers => prevUsers.filter(currentUser => currentUser.id !== itemId));
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  //Fetch all info
  useEffect(() => {
    // Fetch movies
    axios.get('/api/movies')
      .then(response => setMovies(response.data))
      .catch(error => console.error(error));

    // Fetch reviews
    axios.get('/api/reviews')
      .then(response => setReviews(response.data))
      .catch(error => console.error(error));

    // Fetch comments
    axios.get('/api/comments')
      .then(response => setComments(response.data))
      .catch(error => console.error(error));

    // Fetch users
    axios.get('/api/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);

  console.log(reviews);

  return (
    <div>
      <h1>Admin Page</h1>

      {/* Add Movie Form */}
      <form onSubmit={handleAddMovie}>
        <h2>Add Movie</h2>
        <label>
          Name:
          <input type="text" name="name" value={newMovie.name} onChange={handleInputChange} required />
        </label>
        <label>
          Genre:
          <select id="genre" name="genre" value={selectedGenre} onChange={handleGenreChange} required>
            <option value="">Select a genre</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Horror">Horror</option>
            <option value="Sci-Fi">Science Fiction (Sci-Fi)</option>
            <option value="Action">Action</option>
          </select>
        </label>
        <label>
          Release Year:
          <input type="number" name="releaseYear" value={newMovie.releaseYear} onChange={handleInputChange} required />
        </label>
        <label>
          Director:
          <input type="text" name="director" value={newMovie.director} onChange={handleInputChange} required />
        </label>
        <label>
          Image Link:
          <input type="url" name="imgLink" value={newMovie.imgLink} onChange={handleInputChange} required />
        </label>
        <button type="submit">Add Movie</button>
      </form>

      {/* Movie List */}
      <div>
        <h2>Movies</h2>
        <ul>
          {movies.map(movie => (
            <li key={movie.id}>
              <button className="delete-button" onClick={() => handleDeleteItem('movie', movie.id)}>X</button>
              {movie.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Reviews List */}
      <div>
        <h2>Reviews</h2>
        <ul>
          {reviews.map(review => (
            <li key={review.id}>
              <button className="delete-button" onClick={() => handleDeleteItem('review', review.id)}>X</button>
              {review.textBody}
            </li>
          ))}
        </ul>
      </div>

      {/* Comments List */}
      <div>
        <h2>Comments</h2>
        <ul>
          {comments.map(comment => (
            <li key={comment.id}>
              <button className="delete-button" onClick={() => handleDeleteItem('comment', comment.id)}>X</button>
              {comment.textBody}
            </li>
          ))}
        </ul>
      </div>

      {/* users list */}
      <div>
        <h2>Users</h2>
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <button className="delete-button" onClick={() => handleDeleteItem('user', user.id)}>X</button>
              {user.username}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default AdminPage;
