import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const ImageContainer = ({ src, alt, type, onClick, hovered, handleMouseEnter, handleMouseLeave }) => {
    return (
        <div
            className={`image-container ${hovered[type] ? 'hovered' : ''}`}
            onMouseEnter={() => handleMouseEnter(type)}
            onMouseLeave={() => handleMouseLeave(type)}
        >
            <img src={src} alt={alt} />
            <button className="overlay-button" onClick={onClick}>
                {type === 'random' ? 'Random Recipe' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
        </div>
    );
};

const HomePage = () => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState({ random: false, browse: false });

    const getFileName = (name) => name.replace(/\s+/g, '_').toLowerCase();

    const handleMouseEnter = (type) => {
        setHovered((prevHovered) => ({ ...prevHovered, [type]: true }));
    };

    const handleMouseLeave = (type) => {
        setHovered((prevHovered) => ({ ...prevHovered, [type]: false }));
    };

    const handleRandomRecipeClick = async () => {
        try {
            console.log('Random Recipe button clicked'); // Debug log
            const response = await fetch('http://localhost:3001/api/recipe/random'); // Ensure correct URL
            const data = await response.json();
            
            console.log('API Response:', data); // Debug log

            if (response.ok && data.length > 0) {
                const recipeName = data[0].name;
                console.log('Navigating to:', `/recipes/${getFileName(recipeName)}`); // Debug log
                navigate(`/recipes/${getFileName(recipeName)}`);
            } else {
                console.error('No recipe found or server error');
            }
        } catch (error) {
            console.error('Error fetching random recipe:', error);
        }
    };

    return (
        <div className="home-page">
            <div className="left-half">
                <ImageContainer
                    src="/static-assets/random.jpg"
                    alt="Random Recipe"
                    type="random"
                    onClick={handleRandomRecipeClick}
                    hovered={hovered}
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                />
            </div>
            <div className="right-half">
                <ImageContainer
                    src="/static-assets/food.jpg"
                    alt="Browse Recipes"
                    type="browse"
                    onClick={() => navigate('/browse')}
                    hovered={hovered}
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                />
            </div>
        </div>
    );
};

export default HomePage;
