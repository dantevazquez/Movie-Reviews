import React from 'react';
import { Link } from 'react-router-dom';

function Review({ review }) {

  if (!review || !review.user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ borderTop: '1px solid #dfe1e5', marginBottom: '10px' }}>
      <p><strong>User:</strong> {review.user.username}</p>
      <p><strong>Rating:</strong> {review.rating}</p>
      <p><strong>Text:</strong> {review.textBody}</p>
      <Link to={`/reviews/${review.id}/comments`}>View Comments</Link>
    </div>
  );
}

export default Review;
