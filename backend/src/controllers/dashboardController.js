const { getPool } = require('../config/database');

const getDashboardStats = async (req, res) => {
  try {
    const pool = await getPool();

    // Total Products
    const totalProducts = await pool.request()
      .query('SELECT COUNT(*) AS total FROM Products');

    // Total Categories
    const totalCategories = await pool.request()
      .query('SELECT COUNT(DISTINCT Category) AS total FROM Products');

    // Low Stock Products (quantity <= 10)
    const lowStock = await pool.request()
      .query('SELECT COUNT(*) AS total FROM Products WHERE Quantity <= 10');

    res.json({
      success: true,
      data: {
        totalProducts: totalProducts.recordset[0].total,
        totalCategories: totalCategories.recordset[0].total,
        lowStockProducts: lowStock.recordset[0].total,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getDashboardStats };