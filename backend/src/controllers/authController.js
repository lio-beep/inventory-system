const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool, sql } = require('../config/database');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const pool = await getPool();
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Users WHERE Username = @username');

    if (result.recordset.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const user = result.recordset[0];
    const isValidPassword = await bcrypt.compare(password, user.Password);

    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user.Id, username: user.Username },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { id: user.Id, username: user.Username },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { login };