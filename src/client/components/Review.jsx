import React from 'react';
import { Link } from 'react-router-dom';

const potato_icon_url =  'https://img.icons8.com/doodle/48/potato--v1.png';
function Review({ review }) {

  if (!review || !review.user) {
    return <div>Loading...</div>;
  }

  // Create an array with length equal to review.rating
  const potatoes = Array.from({ length: review.rating }, (_, i) => i);

  return (
    <div style={{ borderTop: '1px solid #dfe1e5', marginBottom: '10px' }}>
      <p><strong>User:</strong> {review.user.username}</p>
      <p>{potatoes.map((_, i) => <img key={i} src={potato_icon_url} className='potato-image-review'/>)}</p>
      <p><strong>Text:</strong> {review.textBody}</p>
      <Link to={`/reviews/${review.id}/comments`}>View Comments</Link>
    </div>
  );
}

export default Review;
