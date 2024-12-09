const express = require('express');
const { loadCart, saveCart } = require('../models/cartModel');
const { loadProducts } = require('../models/productModel');
const router = express.Router();

// GET cart
router.get('/', (req, res) => {
    try {
        const cart = loadCart();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error.message);
        res.status(500).json({ error: 'Failed to fetch cart.' });
    }
});

// POST add product to cart
router.post('/add', (req, res) => {
    try {
        const cart = loadCart();
        const products = loadProducts();
        const { productId } = req.body;

        // Validate that productId is provided
        if (!productId) return res.status(400).json({ error: 'Product ID is required.' });

        const product = products.find((p) => p.id === productId);
        if (!product) return res.status(404).json({ error: 'Product not found.' });

        // Check if the product already exists in the cart, if so, increase the quantity
        const existingProduct = cart.find(item => item.id === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        saveCart(cart);
        res.status(201).json({ message: 'Product added to cart.' });
    } catch (error) {
        console.error('Error adding product to cart:', error.message);
        res.status(500).json({ error: 'Failed to add product to cart.' });
    }
});

// DELETE clear cart
router.delete('/clear', (req, res) => {
    try {
        saveCart([]);
        res.status(200).json({ message: 'Cart cleared.' });
    } catch (error) {
        console.error('Error clearing cart:', error.message);
        res.status(500).json({ error: 'Failed to clear cart.' });
    }
});

module.exports = router;
