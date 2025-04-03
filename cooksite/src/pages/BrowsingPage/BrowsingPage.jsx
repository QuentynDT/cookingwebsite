import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import './BrowsingPage.css';

function BrowsingPage() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/recipes');
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
        setRecipes(sortedData);
        setFilteredRecipes(sortedData);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchRecipes();
  }, []);

  const getFileName = (name) => name.replace(/\s+/g, '_').toLowerCase();

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === '') {
      setFilteredRecipes(recipes);
    } else {
      setFilteredRecipes(
        recipes.filter((recipe) =>
          recipe.name.toLowerCase().includes(term)
        )
      );
    }
  };

  return (
    <div>
      {/* Add Recipe button in the top right */}
      <div className="add-recipe-container">
        <Link to="/upload" className="add-recipe-button">
          Add a Recipe
        </Link>
      </div>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for recipes..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      {filteredRecipes.length > 0 ? (
        <div className="grid-container">
          {filteredRecipes.map((recipe, index) => (
            <div key={index} className="grid-item">
              {/* Recipe name link using React Router's Link */}
              <div className="text">
                <Link
                  to={`/recipes/${getFileName(recipe.name)}`}
                  className="recipe-link"
                >
                  {recipe.name}
                </Link>
              </div>
              {/* Image link using React Router's Link */}
              <div className="image">
                <Link
                  to={`/recipes/${getFileName(recipe.name)}`}
                  className="image-link"
                >
                  <img
                    src={`/static-assets/${getFileName(recipe.name)}.jpg`}
                    alt={recipe.name}
                    onError={(e) => {
                      e.target.src = '/static-assets/default-image.jpg';
                    }}
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="failure-container">
          <img
            src="/static-assets/failure.jpg"
            alt="No results found"
            className="failure-image"
          />
        </div>
      )}
      <div className="button-container">
        <a href="http://localhost:5173/review" className="review-button">
          Review
        </a>
      </div>
    </div>
  );
}

export default BrowsingPage;
