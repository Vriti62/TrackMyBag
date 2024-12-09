// models/orderModel.js

const fs = require('fs');
const path = require('path');

const ordersFilePath = path.join(__dirname, '../data/orders.json');
const cartFilePath = path.join(__dirname, '../data/cart.json');

// Helper functions to read and write orders and cart data
const loadOrders = () => {
    if (fs.existsSync(ordersFilePath)) {
        return JSON.parse(fs.readFileSync(ordersFilePath, 'utf-8'));
    }
    return [];
};

const saveOrders = (orders) => {
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), 'utf-8');
};

const loadCart = () => {
    if (fs.existsSync(cartFilePath)) {
        return JSON.parse(fs.readFileSync(cartFilePath, 'utf-8'));
    }
    return [];
};

const saveCart = (cart) => {
    fs.writeFileSync(cartFilePath, JSON.stringify(cart, null, 2), 'utf-8');
};

module.exports = { loadOrders, saveOrders, loadCart, saveCart };
