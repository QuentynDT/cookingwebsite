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
async function connectDB() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');
    return connection;
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    throw error;
  }
}
app.get('/api/recipe/details/:recipeName', async (req, res) => {
  try {
    const connection = await connectDB();
    const recipeName = req.params.recipeName.replace(/_/g, ' ');
    const recipeQuery = `SELECT description, meta, instructions FROM recipe WHERE name = ?`;
    const [recipeRows] = await connection.execute(recipeQuery, [recipeName]);

    if (recipeRows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({
      description: recipeRows[0].description,
      meta: recipeRows[0].meta,
      instructions: recipeRows[0].instructions,
    });
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    res.status(500).json({ error: 'Failed to fetch recipe details' });
  }
});


app.get('/api/recipes', async (req, res) => {
  try {
    const connection = await connectDB();
    const [rows] = await connection.execute('SELECT name FROM recipe order by name');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Failed to fetch recipes' });
  }
});
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
