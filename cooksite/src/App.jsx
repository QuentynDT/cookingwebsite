import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import BrowsingPage from './pages/BrowsingPage/BrowsingPage';
import ReviewPage from './pages/ReviewPage/ReviewPage';
import RecipePage from './pages/RecipePage/RecipePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowsingPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/recipes/:recipeName" element={<RecipePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
