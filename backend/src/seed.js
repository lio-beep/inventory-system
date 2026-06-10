const bcrypt = require('bcryptjs');
const { getPool, sql } = require('./config/database');

const seed = async () => {
  try {
    const pool = await getPool();
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await pool.request()
      .input('username', sql.NVarChar, 'admin')
      .input('password', sql.NVarChar, hashedPassword)
      .query(`
        IF NOT EXISTS (SELECT * FROM Users WHERE Username = @username)
        INSERT INTO Users (Username, Password) VALUES (@username, @password)
      `);

    console.log('Admin user created! Username: admin | Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seed();