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
  const [error, setError] = useState(null);

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
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.description || !data.instructions) {
          throw new Error('Invalid recipe data received from server');
        }

        if (isMounted) {
          setRecipeDetails({
            description: capitalizeFirstLetter(data.description),
            instructions: capitalizeSentences(data.instructions),
            meta: data.meta || '',
            ingredients: data.ingredients || []
          });
          setIsLoading(false);
          setError(null);
        }
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        if (isMounted) {
          setIsLoading(false);
          setError(error.message);
        }
      }
    };

    fetchRecipeDetails();

    return () => { isMounted = false; };
  }, [recipeName]);

  const recipeLink = getFileName(recipeName);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading recipe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Recipe Loading Failed</h2>
        <p className="error-message">{error}</p>
        <p>Please check the recipe name or try again later.</p>
      </div>
    );
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
          <p className="recipe-description">
            {recipeDetails.description || 'No description available'}
          </p>
          
          {recipeDetails.meta && recipeDetails.meta.split(',').map((item, index) => {
            const [label, value] = item.split(':');
            return (
              <p key={index} className="recipe-meta">
                <strong>{label?.trim() || 'Unknown'}:</strong> {value?.trim() || 'N/A'}
              </p>
            );
          })}
        </div>
      </div>

      <div className="ingredients-section">
        <h2>Ingredients</h2>
        <div className="ingredients-grid">
          {recipeDetails.ingredients?.length > 0 ? (
            recipeDetails.ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-item">
                <span className="amount">{ingredient.amount || 'N/A'}</span>
                <span className="measure">{ingredient.measure || ''}</span>
                <span className="ingredient-name">
                  {capitalizeWords(ingredient.ingredient || 'Unknown ingredient')}
                </span>
              </div>
            ))
          ) : (
            <p className="no-ingredients">No ingredients listed</p>
          )}
        </div>
      </div>

      <div className="instructions-section">
        <h2>Instructions</h2>
        <p style={{ whiteSpace: 'pre-wrap' }}>
          {recipeDetails.instructions || 'No instructions available'}
        </p>
      </div>
    </div>
  );
}

export default RecipePage;
