const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get cart for a user (assumes userId is available, e.g. from auth middleware)
exports.getCart = async (req, res) => {
  try {
    const userId = req.user?.userId || req.query.userId;
    if (!userId) return res.status(400).json({ error: 'User ID required.' });

    let cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) cart = await Cart.create({ userId, items: [] });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart.' });
  }
};

// Add product to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user?.userId || req.body.userId;
    const { productId } = req.body;
    if (!userId || !productId) return res.status(400).json({ error: 'User ID and Product ID required.' });

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = await Cart.create({ userId, items: [] });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }

    await cart.save();
    res.status(201).json({ message: 'Product added to cart.', cart });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product to cart.' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user?.userId || req.body.userId;
    if (!userId) return res.status(400).json({ error: 'User ID required.' });

    await Cart.findOneAndUpdate({ userId }, { items: [] });
    res.json({ message: 'Cart cleared.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart.' });
  }
};