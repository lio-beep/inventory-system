const { getPool } = require('../config/database');

const getReport = async (req, res) => {
  try {
    const pool = await getPool();

    // Summary stats
    const summary = await pool.request().query(`
      SELECT
        COUNT(*) AS totalProducts,
        SUM(Quantity) AS totalQuantity,
        SUM(Quantity * UnitPrice) AS totalInventoryValue
      FROM Products
    `);

    // Low stock products
    const lowStock = await pool.request().query(`
      SELECT Id, Name, Category, Quantity, UnitPrice
      FROM Products
      WHERE Quantity <= 10
      ORDER BY Quantity ASC
    `);

    res.json({
      success: true,
      data: {
        summary: summary.recordset[0],
        lowStockProducts: lowStock.recordset,
      },
    });
  } catch (error) {
    console.error('Report error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getReport };