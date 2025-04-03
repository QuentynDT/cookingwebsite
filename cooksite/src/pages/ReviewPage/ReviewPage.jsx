import React, { useState } from 'react';
import './ReviewPage.css';

function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleStarHover = (index) => {
    setHoverRating(index + 1);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="review-container">
      <h1>Did you like the website?</h1>
      <div className="stars">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`star ${
              index < rating // If clicked, make it golden
                ? 'golden'
                : index < hoverRating // If hovered and not clicked, make it yellow
                ? 'yellow'
                : ''
            }`}
            onClick={() => handleStarClick(index)}
            onMouseEnter={() => handleStarHover(index)}
            onMouseLeave={handleStarLeave}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
}

export default ReviewPage;
