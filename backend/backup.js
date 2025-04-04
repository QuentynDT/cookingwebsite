const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'quentyn',
  database: 'recipeDB'
};

// Create connection pool for better performance
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/api/recipe/details/:recipeName', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const recipeName = req.params.recipeName.replace(/_/g, ' ');

    // Get basic recipe details
    const [recipeRows] = await connection.execute(
      `SELECT description, meta, instructions 
       FROM recipe 
       WHERE name = ?`,
      [recipeName]
    );

    if (recipeRows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Get ingredients data
    const [ingredients] = await connection.execute(
      `SELECT ri.amount AS amount,
              m.name AS measure,
              i.name AS ingredient
       FROM recipe r
       JOIN recipeingredient ri ON r.id = ri.recipe_id
       JOIN ingredient i ON i.id = ri.ingredient_id
       JOIN measure m ON m.id = ri.measure_id
       WHERE r.name = ?`,
      [recipeName]
    );

    res.json({
      ...recipeRows[0],
      ingredients // Add ingredients to response
    });

  } catch (error) {
    console.error('Error fetching recipe details:', error);
    res.status(500).json({ error: 'Failed to fetch recipe details' });
  } finally {
    if (connection) connection.release(); // Release connection back to pool
  }
});

// Existing /api/recipes endpoint remains unchanged

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
