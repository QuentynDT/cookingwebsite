import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RenamePage.css';

function RenamePage() {
  const [oldName, setOldName] = useState('');
  const [newName, setNewName] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!oldName.trim() || !newName.trim()) {
      setMessage('Both fields are required');
      setIsError(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/ingredients/rename', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldName, newName }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to rename ingredient');
      }

      setMessage('Ingredient renamed successfully!');
      setIsError(false);
      setOldName('');
      setNewName('');
      
      // Redirect after 2 seconds
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    }
  };

  return (
    <div className="rename-page-container">
      <h1 className="rename-title">Replace Ingredient</h1>
      <form onSubmit={handleSubmit} className="rename-form">
        <div className="form-group">
          <label htmlFor="oldName">Old Ingredient Name:</label>
          <input
            type="text"
            id="oldName"
            value={oldName}
            onChange={(e) => setOldName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newName">New Ingredient Name:</label>
          <input
            type="text"
            id="newName"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Enter
        </button>
      </form>
      {message && (
        <div className={`message ${isError ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default RenamePage;
