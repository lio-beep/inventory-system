const { getPool, sql } = require('../config/database');

// GET all products
const getProducts = async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .query('SELECT * FROM Products ORDER BY CreatedAt DESC');

    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET single product
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Products WHERE Id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// CREATE product
const createProduct = async (req, res) => {
  try {
    const { name, category, quantity, unitPrice } = req.body;

    if (!name || !category || quantity === undefined || unitPrice === undefined) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const pool = await getPool();
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('category', sql.NVarChar, category)
      .input('quantity', sql.Int, quantity)
      .input('unitPrice', sql.Decimal(10, 2), unitPrice)
      .query(`
        INSERT INTO Products (Name, Category, Quantity, UnitPrice)
        OUTPUT INSERTED.*
        VALUES (@name, @category, @quantity, @unitPrice)
      `);

    res.status(201).json({ success: true, message: 'Product created', data: result.recordset[0] });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// UPDATE product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, quantity, unitPrice } = req.body;

    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, name)
      .input('category', sql.NVarChar, category)
      .input('quantity', sql.Int, quantity)
      .input('unitPrice', sql.Decimal(10, 2), unitPrice)
      .query(`
        UPDATE Products
        SET Name = @name, Category = @category, Quantity = @quantity,
            UnitPrice = @unitPrice, UpdatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE Id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product updated', data: result.recordset[0] });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// DELETE product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Products OUTPUT DELETED.* WHERE Id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };