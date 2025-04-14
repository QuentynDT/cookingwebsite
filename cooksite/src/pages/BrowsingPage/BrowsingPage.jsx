import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BrowsingPage.css';

function BrowsingPage() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const fetchFilteredRecipes = async (term) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/recipes/search?query=${encodeURIComponent(term)}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch filtered recipes');
      }
      const data = await response.json();
      setFilteredRecipes(data);
    } catch (error) {
      console.error('Error fetching filtered recipes:', error);
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/recipes');
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        setRecipes(data);
        setFilteredRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRecipes(recipes);
    } else {
      fetchFilteredRecipes(searchTerm);
    }
  }, [searchTerm, recipes]);

  const getFileName = (name) => name.replace(/\s+/g, '_').toLowerCase();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  return (
    <div>
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
              <div className="text">
                <Link
                  to={`/recipes/${getFileName(recipe.name)}`}
                  className="recipe-link"
                >
                  {recipe.name}
                </Link>
              </div>
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
