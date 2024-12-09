import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/ProductPage.css';

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.jpg';
    
    // If the path already starts with http/https, use it directly
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Ensure the path includes the uploads/products directory
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `http://localhost:3000/uploads/products${cleanPath}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        const data = await response.json();
        console.log('Fetched products:', data); // Debug log
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    alert('Product added to cart!');
  };

  const handleCartClick = () => {
    navigate('/CartPage');
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <main>
      <header class = "product_header">
        <h1>Our Products</h1>
        <div className="cart-icon" onClick={handleCartClick}>
          <i className="fas fa-shopping-cart"></i>
          {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
        </div>
      </header>

      <div className="container">
        <div className="grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img 
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  onError={(e) => {
                    console.log('Image failed to load:', product.image);
                    e.target.src = '/placeholder-image.jpg';
                    e.target.onerror = null;
                  }}
                />
              </div>
              <div className="product-info">
                <h2>{product.name}</h2>
                <p className="description">{product.description}</p>
                <p className="price">Rs.{product.price?.toFixed(2) || '0.00'}</p>
                <button 
                  className="add-to-cart"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
