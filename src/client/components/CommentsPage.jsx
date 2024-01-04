import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Comments from './Comments';

function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [textBody, setTextBody] = useState('');
  const { reviewId } = useParams();

  //this function can be called anytime to refresh the comments
  const fetchComments = async () => {
    try {
      const { data: commentsData } = await axios.get(`/api/reviews/${reviewId}/comments`);
      setComments(commentsData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [reviewId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {

      //check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('User not authenticated');
        window.alert('You must log in before you can submit a comment!');
        return;
      }

      //make api call
      const response = await axios.post(
        `/api/comments/${reviewId}`,
        { textBody },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Fetch updated comments after posting a new comment
      fetchComments();

      setTextBody('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div>
      <h2>Review Comments</h2>
      <Comments comments={comments} />

      <h3>Write a Comment</h3>
      <form onSubmit={handleCommentSubmit}>
        <label>
          Comment:
          <textarea
            value={textBody}
            onChange={(e) => setTextBody(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Submit Comment</button>
      </form>
    </div>
  );
}

export default CommentsPage;
