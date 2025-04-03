import React, { useState } from "react";
import './UploadPage.css';
const UploadPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instructions: "",
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3001/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', description: '', instructions: '' });
      } else {
        setSubmitStatus('error');
        console.error('Submission failed:', data.message);
      }
      
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting recipe:', error);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Add a Recipe</h2>
      
      {submitStatus === 'success' && (
        <div style={{ color: 'green', marginBottom: '15px' }}>
          Recipe submitted successfully!
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div style={{ color: 'red', marginBottom: '15px' }}>
          Error submitting recipe. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Recipe Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          maxLength="20"
          placeholder="Enter recipe name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          name="description"
          maxLength="50"
          placeholder="Enter short description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label htmlFor="instructions">Instructions:</label>
        <textarea
          id="instructions"
          name="instructions"
          maxLength="500"
          rows="5"
          placeholder="Enter detailed instructions"
          value={formData.instructions}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit Recipe</button>
      </form>
    </div>
  );
};

export default UploadPage;
