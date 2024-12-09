import React, { useState, useEffect } from 'react';
import {
  Luggage,
  Users,
  BarChart,
  Search,
  Edit,
  Trash2,
  Plus,
  LogOut,
  Package,
  ShoppingBag,
} from 'lucide-react';
import '../styles/admin.css';

// Initial data


function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [luggageData, setLuggageData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newLuggage, setNewLuggage] = useState({
    name: "",
    status: "",
    location: "",
    num_lugg: 0,
    userId: "",
    trackingLink: ""
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    description: "",
    category: "",
    inStock: 0,
    image: null
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchProductsData(), fetchOrdersData()]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchProductsData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/products");
      if (!response.ok) throw new Error("Failed to fetch products data");
      const data = await response.json();
      setProductsData(data);
    } catch (err) {
      throw new Error("Error fetching products data");
    }
  };

  const fetchOrdersData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/orders");
      if (!response.ok) throw new Error("Failed to fetch orders data");
      const data = await response.json();
      console.log('Fetched orders:', data);
      if (Array.isArray(data.orders)) {
        setOrdersData(data.orders);
      } else {
        console.error('Orders data is not an array:', data);
        setOrdersData([]);
      }
    } catch (err) {
      console.error("Error fetching orders data:", err);
      setOrdersData([]);
    }
  };
  

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(newProduct).forEach(key => {
        formData.append(key, newProduct[key]);
      });

      const response = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Failed to add product");
      await fetchProductsData();
      setNewProduct({
        name: "",
        price: 0,
        description: "",
        category: "",
        inStock: 0,
        image: null
      });
    } catch (err) {
      setError(err.message || "Failed to add product");
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete product");
      await fetchProductsData();
    } catch (err) {
      setError("Error deleting product");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Refresh the orders list
      await fetchOrdersData();
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchLuggageData(), fetchUserData()]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchLuggageData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/luggage");
      if (!response.ok) throw new Error("Failed to fetch luggage data");
      const data = await response.json();
      setLuggageData(data);
    } catch (err) {
      throw new Error("Error fetching luggage data");
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users");
      if (!response.ok) throw new Error("Failed to fetch user data");
      const data = await response.json();
      setUserData(data);
    } catch (err) {
      throw new Error("Error fetching user data");
    }
  };

  const handleAddLuggage = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:3000/api/luggage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newLuggage,
          num_lugg: Number(newLuggage.num_lugg)
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add luggage");

      await fetchLuggageData();
      setNewLuggage({
        name: "",
        status: "",
        location: "",
        num_lugg: 0,
        userId: "",
        trackingLink: ""
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add luggage");
    }
  };

  const handleUpdateLuggage = async (id, updatedLuggage) => {
    try {
      const response = await fetch(`http://localhost:3000/api/luggage/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedLuggage),
      });
      
      if (!response.ok) throw new Error("Failed to update luggage");
      await fetchLuggageData();
    } catch (err) {
      setError("Error updating luggage");
    }
  };

  const handleDeleteLuggage = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/luggage/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete luggage");
      await fetchLuggageData();
    } catch (err) {
      setError("Error deleting luggage");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setModalOpen(false);
    } catch (err) {
      setError("Error updating profile");
    }
  };

  const filteredLuggage = luggageData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toString().includes(searchTerm)
  );

  const filteredOrders = ordersData.filter(
    (order) =>
      (order?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order?.phone?.includes(searchTerm)) ?? false
  );

  const filteredProducts = productsData.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="admin-panel">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Luggage className="admin-icon" />
          <span className="admin-title">Admin Panel</span>
        </div>
        <nav className="admin-nav">
          {[
            { id: 'dashboard', icon: BarChart, label: 'Dashboard' },
            { id: 'luggage', icon: Luggage, label: 'Luggage' },
            { id: 'orders', icon: Package, label: 'Orders' },
            { id: 'products', icon: ShoppingBag, label: 'Products' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`admin-nav-item ${activeTab === id ? 'active' : ''}`}
            >
              <Icon className="admin-icon" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="admin-main-content">
        <header className="admin-header-section">
          <h1 className="admin-header-title">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Overview
          </h1>
          <div className="admin-header-actions">
            <button 
              className="admin-edit-profile-button" 
              onClick={() => setModalOpen(true)}
            >
              <Edit className="admin-icon" /> Edit Profile
            </button>
            <button 
              className="admin-logout-button" 
              onClick={handleLogout}
            >
              <LogOut className="admin-icon" /> Logout
            </button>
          </div>
        </header>

        {error && <div className="admin-error">{error}</div>}
        {loading && <div className="admin-loading">Loading...</div>}

        {!loading && (
          <div className="admin-content">
            {activeTab === 'dashboard' && (
              <div className="admin-cards">
                {[
                  { label: 'Total Users', icon: Users, count: userData.length },
                  { label: 'Active Luggages', icon: Luggage, count: luggageData.length },
                  { label: 'Total Orders', icon: Package, count: ordersData.length },
                  { label: 'Total Products', icon: ShoppingBag, count: productsData.length }
                ].map(({ label, icon: Icon, count }) => (
                  <div key={label} className="admin-card">
                    <div className="admin-card-header">
                      <span>{label}</span>
                      <Icon className="admin-icon" />
                    </div>
                    <div className="admin-card-content">
                      <div className="admin-count">{count}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'luggage' && (
              <div className="admin-luggage-management">
                <div className="admin-section-header">
                  <h2>Luggage Management</h2>
                  <p>Track and manage all luggages</p>
                </div>

                <div className="admin-controls">
                  <input
                    type="text"
                    placeholder="Search luggage..."
                    className="admin-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <form onSubmit={handleAddLuggage} className="admin-form">
                  <input
                    type="text"
                    placeholder="Luggage Name"
                    value={newLuggage.name}
                    onChange={(e) => setNewLuggage({ ...newLuggage, name: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Status"
                    value={newLuggage.status}
                    onChange={(e) => setNewLuggage({ ...newLuggage, status: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={newLuggage.location}
                    onChange={(e) => setNewLuggage({ ...newLuggage, location: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Number of Luggages"
                    value={newLuggage.num_lugg || ''}
                    onChange={(e) => setNewLuggage({ ...newLuggage, num_lugg: Number(e.target.value) })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Custom Tracking Link (optional)"
                    value={newLuggage.trackingLink}
                    onChange={(e) => setNewLuggage({ ...newLuggage, trackingLink: e.target.value })}
                  />
                  <select
                    value={newLuggage.userId}
                    onChange={(e) => setNewLuggage({ ...newLuggage, userId: e.target.value })}
                    required
                  >
                    <option value="">Select User</option>
                    {userData.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="admin-submit-button">
                    <Plus className="admin-icon" /> Add Luggage
                  </button>
                </form>

                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Location</th>
                      <th>Tracking Link</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLuggage.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.status}</td>
                        <td>{item.location}</td>
                        <td>{item.trackingLink}</td>
                        <td className="admin-actions">
                          <button
                            className="admin-edit-button"
                            onClick={() => handleUpdateLuggage(item.id, item)}
                          >
                            <Edit className="admin-icon" />
                          </button>
                          <button
                            className="admin-delete-button"
                            onClick={() => handleDeleteLuggage(item.id)}
                          >
                            <Trash2 className="admin-icon" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="admin-orders-management">
                <div className="admin-section-header">
                  <h2>Orders Management</h2>
                  <p>Track and manage all customer orders</p>
                </div>

                <div className="admin-controls">
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="admin-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Order Time</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order?.id || Math.random()}>
                        <td>{order?.id}</td>
                        <td>{order?.username || 'N/A'}</td>
                        <td>{order?.email || 'N/A'}</td>
                        <td>{order?.phone || 'N/A'}</td>
                        <td>{order?.address || 'N/A'}</td>
                        <td>{order?.orderTime ? new Date(order.orderTime).toLocaleString() : 'N/A'}</td>
                        <td>{order?.items?.join(", ") || 'No items'}</td>
                        <td>${order?.total || 0}</td>
                        <td>
                          <select
                            value={order?.status || 'Pending'}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="admin-status-select"
                          >
                            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <button className="admin-view-button">
                            <Edit className="admin-icon" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="admin-products-management">
                <div className="admin-section-header">
                  <h2>Products Management</h2>
                  <p>Manage all available products</p>
                </div>

                <div className="admin-controls">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="admin-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <form onSubmit={addProduct} className="admin-form">
                  <div className="form-group">
                    <label>Product Image</label>
                    <div className="image-upload-container">
                      {newProduct.image ? (
                        <div className="image-preview">
                          <img src={newProduct.image} alt="Product preview" />
                          <button 
                            type="button" 
                            onClick={() => setNewProduct(prev => ({ ...prev, image: null }))}
                            className="remove-image"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="image-upload">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            id="product-image"
                            className="image-input"
                          />
                          <label htmlFor="product-image" className="image-label">
                            <Plus className="admin-icon" />
                            Upload Image
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    required
                    step="0.01"
                  />
                  <textarea
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Stock Quantity"
                    value={newProduct.inStock || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, inStock: Number(e.target.value) })}
                    required
                  />
                  <button type="submit" className="admin-submit-button">
                    <Plus className="admin-icon" /> Add Product
                  </button>
                </form>

                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>In Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          {product.image ? (
                            <img src={product.image} alt={product.name} />
                          ) : (
                            <div className="no-image">No Image</div>
                          )}
                        </td>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product.description}</td>
                        <td>{product.category}</td>
                        <td>{product.inStock}</td>
                        <td className="admin-actions">
                          <button className="admin-edit-button">
                            <Edit className="admin-icon" />
                          </button>
                          <button
                            className="admin-delete-button"
                            onClick={() => deleteProduct(product.id)}
                          >
                            <Trash2 className="admin-icon" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSaveProfile}>
              <div className="modal-form-group">
                <label htmlFor="name">Name:</label>
                <input
                  id="name"
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                />
              </div>
              <div className="modal-form-group">
                <label htmlFor="email">Email:</label>
                <input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  required
                />
              </div>
              <div className="modal-form-group">
                <label htmlFor="phone">Phone:</label>
                <input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="modal-save-button">Save</button>
                <button
                  type="button"
                  className="modal-cancel-button"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;