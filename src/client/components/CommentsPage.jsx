// CommentsPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Comments from './Comments'; 

function CommentsPage() {
  const [comments, setComments] = useState([]);
  const { reviewId } = useParams();

  useEffect(() => {
    async function getComments() {
      try {
        const { data: commentsData } = await axios.get(`/api/reviews/${reviewId}/comments`);
        setComments(commentsData);
      } catch (error) {
        console.error(error);
      }
    }

    getComments();
  }, [reviewId]);

  return (
    <div>
      <h2>Review Comments</h2>
      <Comments comments={comments} />
    </div>
  );
}

export default CommentsPage;
