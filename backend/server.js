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
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
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
// Add this route to your existing Express server
app.post('/api/ingredients/rename', async (req, res) => {
  let connection;
  try {
    const { oldName, newName } = req.body;
    connection = await pool.getConnection();

    // Check if old ingredient exists
    const [existing] = await connection.execute(
      'SELECT id FROM ingredient WHERE name = ?',
      [oldName]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    // Update ingredient name
    await connection.execute(
      'UPDATE ingredient SET name = ? WHERE name = ?',
      [newName, oldName]
    );

    res.json({ message: 'Ingredient renamed successfully' });
  } catch (error) {
    console.error('Error renaming ingredient:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'New ingredient name already exists' });
    }
    
    res.status(500).json({ message: 'Failed to rename ingredient' });
  } finally {
    if (connection) connection.release();
  }
});

app.get('/api/recipe/random', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT name, description, instructions FROM recipe ORDER BY RAND() LIMIT 1'
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No recipes found' });
    }

    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching random recipe:', error);
    res.status(500).json({ error: 'Failed to fetch random recipe' });
  } finally {
    if (connection) connection.release();
  }
});

app.get('/api/recipe/details/:recipeName', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const recipeName = req.params.recipeName.replace(/_/g, ' ');
    const [recipeRows] = await connection.execute(
      `SELECT description, meta, instructions 
       FROM recipe 
       WHERE LOWER(name) = LOWER(?)`,
      [recipeName]
    );

    if (recipeRows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    const [ingredients] = await connection.execute(
      `SELECT ri.amount AS amount,
              m.name AS measure,
              i.name AS ingredient
       FROM recipe r
       JOIN recipeingredient ri ON r.id = ri.recipe_id
       JOIN ingredient i ON i.id = ri.ingredient_id
       JOIN measure m ON m.id = ri.measure_id
       WHERE r.name = ? ORDER BY i.name`,
      [recipeName]
    );

    res.json({
      ...recipeRows[0],
      ingredients
    });

  } catch (error) {
    console.error('Error fetching recipe details:', error);
    res.status(500).json({ error: 'Failed to fetch recipe details' });
  } finally {
    if (connection) connection.release();
  }
});
app.get('/api/recipes/search', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const searchQuery = req.query.query || '';
    const [rows] = await connection.execute(
      `
      SELECT DISTINCT r.name 
      FROM recipe r 
      JOIN recipeingredient ri ON r.id = ri.recipe_id 
      JOIN ingredient i ON i.id = ri.ingredient_id 
      WHERE i.name LIKE ? 
      
      UNION 
      
      SELECT name 
      FROM recipe 
      WHERE name LIKE ? 
      
      ORDER BY name`,
      [`%${searchQuery}%`, `%${searchQuery}%`]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching filtered recipes:', error);
    res.status(500).json({ message: 'Failed to fetch filtered recipes' });
  } finally {
    if (connection) connection.release();
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
