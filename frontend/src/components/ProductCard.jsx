import React from 'react';
import { useCart } from '../CartContext'; // Assuming CartContext is set up for managing the cart
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  // Set a default image if the product image is not available
  const imageUrl = product?.image
    ? product.image.startsWith('http')
      ? product.image
      : `http://localhost:3000${product.image}`
    : '/default-image.jpg';

  // Handle Add to Cart button click
  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="product-card bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl">
      {/* Product Image */}
      <img
        src={imageUrl}
        alt={product.name || 'Product'}
        className="product-image w-full h-64 object-cover"
        onError={(e) => e.target.src = '/default-image.jpg'} // Fallback image on error
      />
      <div className="p-4">
        {/* Product Name */}
        <h2 className="text-xl font-semibold text-gray-900">{product.name || 'Unknown Product'}</h2>
        {/* Product Price */}
        <p className="text-lg font-bold text-blue-600">
          ${(product.price ?? 0).toFixed(2)}
        </p>
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="add-to-cart-btn mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
