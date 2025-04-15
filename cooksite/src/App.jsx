import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import BrowsingPage from './pages/BrowsingPage/BrowsingPage';
import ReviewPage from './pages/ReviewPage/ReviewPage';
import RecipePage from './pages/RecipePage/RecipePage';
import RenamePage from './pages/RenamePage/RenamePage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowsingPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/recipes/:recipeName" element={<RecipePage />} />
        <Route path="/rename-ingredient" element={<RenamePage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
