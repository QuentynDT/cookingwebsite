import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './RecipePage.css';

function RecipePage() {
  const { recipeName } = useParams();
  const [recipeDetails, setRecipeDetails] = useState({
    description: '',
    instructions: '',
    meta: '',
    ingredients: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const getFileName = (name) => name.replace(/\s+/g, '_').toLowerCase();

  const capitalizeWords = (str) => {
    return str
      .replace(/_/g, ' ')
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const capitalizeSentences = (str) => {
    return str
      .split('. ')
      .map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1))
      .join('. ');
  };

  useEffect(() => {
    let isMounted = true;

    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/recipe/details/${recipeName}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch recipe details');
        }

        const data = await response.json();
        if (isMounted) {
          setRecipeDetails({
            description: capitalizeFirstLetter(data.description),
            instructions: capitalizeSentences(data.instructions),
            meta: data.meta,
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        if (isMounted) setIsLoading(false);
      }
    };

    fetchRecipeDetails();

    return () => {
      isMounted = false;
    };
  }, [recipeName]);

  const recipeLink = getFileName(recipeName);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recipe-page">
      <h1 className="recipe-title">{capitalizeWords(recipeName)}</h1>
      <div className="recipe-container">
        <div className="recipe-image-container">
          <img
            src={`/static-assets/${recipeLink}2.jpg`}
            alt={capitalizeWords(recipeName)}
            onError={(e) => {
              e.target.src = '/static-assets/default-image.jpg';
            }}
            className="recipe-image"
          />
        </div>

        <div className="recipe-details-container">
          <p className="recipe-description">{recipeDetails.description}</p>
          {recipeDetails.meta.split(',').map((item, index) => {
            const [label, value] = item.split(':');
            return (
              <p key={index} className="recipe-meta">
                <strong>{label.trim()}:</strong> {value.trim()}
              </p>
            );
          })}
        </div>
      </div>
      <div className="instructions-section">
        <h2>Instructions</h2>
        <p style={{ whiteSpace: 'pre-wrap' }}>{recipeDetails.instructions}</p>
      </div>
    </div>
  );
}

export default RecipePage;
