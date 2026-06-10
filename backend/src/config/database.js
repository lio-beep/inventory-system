const sql = require('mssql');

const config = {
  server: '127.0.0.1',
  port: 63863,
  database: 'InventoryDB',
  user: 'sa',
  password: 'Admin123!',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool = null;

const getPool = async () => {
  if (!pool) {
    pool = await sql.connect(config);
    console.log('Connected to MSSQL database');
  }
  return pool;
};

module.exports = { getPool, sql };