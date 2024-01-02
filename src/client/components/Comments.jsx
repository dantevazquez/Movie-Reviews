import React from 'react'

function Comments({ comments }) {
    return (
        <div>
          <h3>Comments</h3>
          {comments.map((comment) => (
            <div key={comment.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <p><strong>User:</strong> {comment.user.username}</p>
              <p><strong>Text:</strong> {comment.textBody}</p>
            </div>
          ))}
        </div>
      );
}

export default Comments