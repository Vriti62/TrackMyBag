import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import './ProductPage.css';

// Mock Cart Context
const CartContext = React.createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => React.useContext(CartContext);

// Product Card Component
const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <h3 className="product-title">{product.name}</h3>
      <p className="product-price">${product.price.toFixed(2)}</p>
      <button onClick={() => addToCart(product)} className="add-to-cart-button">
        Add to Cart
      </button>
    </div>
  );
};

// Cart Contents Component
const CartContents = () => {
  const { cart } = useCart();

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="cart-list">
          {cart.map((item) => (
            <li key={item.id} className="cart-item">
              <span>{item.name}</span>
              <span>Quantity: {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Main Product Page Component
const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/products')
      .then((response) => setProducts(response.data))
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <div className="product-page-container">
      {/* Header */}
      <header className="app-header">
        <h1>Product Page</h1>
        <div className="cart-icon" onClick={() => navigate('/cart')}>
          <FontAwesomeIcon icon={faShoppingCart} size="2x" />
          <span className="cart-count">
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </span>
        </div>
      </header>

      {/* Routes */}
      <Routes>
        {/* Product List */}
        <Route
          path="/"
          element={
            <div className="product-list">
              {products.length === 0 ? (
                <p>Loading products...</p>
              ) : (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                  />
                ))
              )}
            </div>
          }
        />
        {/* Cart */}
        <Route path="/CartPage" element={<CartContents />} />
      </Routes>
    </div>
  );
};

// Wrap the ProductPage with CartProvider
const WrappedProductPage = () => (
  <CartProvider>
    <ProductPage />
  </CartProvider>
);

export default WrappedProductPage;
