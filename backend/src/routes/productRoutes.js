const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getProducts);
router.get('/:id', authenticateToken, getProduct);
router.post('/', authenticateToken, createProduct);
router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

module.exports = router;