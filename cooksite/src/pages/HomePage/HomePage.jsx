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
            <button className="overlay-button" onClick={onClick}>{type.charAt(0).toUpperCase() + type.slice(1)}</button>
        </div>
    );
};

const HomePage = () => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState({ login: false, browse: false });

    const handleMouseEnter = (type) => {
        setHovered((prevHovered) => ({ ...prevHovered, [type]: true }));
    };

    const handleMouseLeave = (type) => {
        setHovered((prevHovered) => ({ ...prevHovered, [type]: false }));
    };

    const handleLoginClick = () => {
        console.log('Login button clicked');
    };

    const handleBrowseClick = () => {
        try {
            navigate('/browse');
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    return (
        <div className="home-page">
            <div className="left-half">
                <ImageContainer
                    src="/static-assets/chef.jpg"
                    alt="Chef"
                    type="login"
                    onClick={handleLoginClick}
                    hovered={hovered}
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                />
            </div>
            <div className="right-half">
                <ImageContainer
                    src="/static-assets/food.jpg"
                    alt="Food"
                    type="browse"
                    onClick={handleBrowseClick}
                    hovered={hovered}
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                />
            </div>
        </div>
    );
};

export default HomePage;

