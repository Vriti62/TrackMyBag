import React, { useState, useEffect } from 'react';
import {
  Luggage,
  Users,
  BarChart,
  Edit,
  Trash2,
  Plus,
  LogOut,
  Package,
  ShoppingBag,
  Check,
  X,
  HelpCircle,
  Eye
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
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingLuggage, setEditingLuggage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [supportTickets, setSupportTickets] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchLuggageData(),
          fetchUserData(),
          fetchProductsData(), 
          fetchOrdersData(),
          fetchSupportTickets()
        ]);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
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

  const fetchSupportTickets = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/support/tickets");
      if (!response.ok) throw new Error("Failed to fetch support tickets");
      const data = await response.json();
      
      // Map the data to ensure each ticket has a status
      const ticketsWithStatus = data.map(ticket => ({
        ...ticket,
        status: ticket.status || 'pending' // Set default status if none exists
      }));
      
      setSupportTickets(ticketsWithStatus);
    } catch (err) {
      console.error("Error fetching support tickets:", err);
      setError("Failed to fetch support tickets");
    }
  };
  

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting product:', newProduct);
      const response = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

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
      console.error('Error adding product:', err);
      setError(err.message || "Failed to add product");
    }
  };

  const fetchLuggageData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/luggage");
      if (!response.ok) throw new Error("Failed to fetch luggage data");
      const data = await response.json();
      console.log('Fetched luggage data:', data);
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
      console.log('Fetched users data:', data);
      setUserData(data);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Error fetching user data");
      setUserData([]);
    }
  };

  const handleAddLuggage = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Submitting luggage with data:', newLuggage);
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
      console.log('Response from adding luggage:', data);
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('product-image', file);

    try {
        const response = await fetch('http://localhost:3000/api/uploads/products', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        const data = await response.json();
        console.log('Upload response:', data);

        setNewProduct(prev => ({
            ...prev,
            image: data.filePath.replace('http://localhost:3000', '')
        }));
    } catch (err) {
        console.error('Error uploading image:', err);
        setError('Failed to upload image');
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder({...order});
  };

  const handleSaveOrder = async (orderId) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingOrder,
          id: orderId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      // Update local state and refresh data
      setOrdersData(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? editingOrder : order
        )
      );
      setEditingOrder(null);
      await fetchOrdersData();
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Failed to update order');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      await fetchOrdersData();
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({...product});
  };

  const handleSaveProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProduct)
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      await fetchProductsData();
      setEditingProduct(null);
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        setProductsData(prevProducts => prevProducts.filter(product => product.id !== productId));
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('Failed to delete product');
      }
    }
  };

  const handleEditLuggage = (luggage) => {
    setEditingLuggage({...luggage});
  };

  const handleSaveLuggage = async (luggageId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/luggage/${luggageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingLuggage.name,
          status: editingLuggage.status,
          location: editingLuggage.location,
          userId: editingLuggage.userId,
          num_lugg: parseInt(editingLuggage.num_lugg),
          trackingLink: editingLuggage.trackingLink
        }),
      });
      
      if (!response.ok) throw new Error("Failed to update luggage");
      await fetchLuggageData();
      setEditingLuggage(null);
    } catch (err) {
      console.error('Error updating luggage:', err);
      setError('Failed to update luggage');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete order');
        }

        // Update the local state by removing the deleted order
        setOrdersData(ordersData.filter(order => order.id !== orderId));
        await fetchOrdersData(); // Refresh the data
      } catch (err) {
        console.error('Error deleting order:', err);
        setError('Failed to delete order');
      }
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!ticketId) {
      console.error('No ticket ID provided');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this ticket?')) {
      return;
    }

    try {
      console.log('Attempting to delete ticket:', ticketId);

      const response = await fetch(`http://localhost:3000/api/support/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete ticket');
      }

      // Update local state immediately
      setSupportTickets(prevTickets => 
        prevTickets.filter(ticket => ticket.id !== ticketId)
      );

      console.log('Ticket deleted successfully');
    } catch (err) {
      console.error('Error deleting ticket:', err);
      setError(err.message);
    }
  };

  const handleViewTicket = (ticket) => {
    // You can implement a modal or detailed view here
    console.log('Viewing ticket:', ticket);
    // For now, we'll just show an alert with the full message
    alert(`Full Message:\n\n${ticket.message}`);
  };

  // First, add a function to handle status changes
  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      // Update the status in the UI immediately
      setSupportTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
        )
      );
    } catch (err) {
      console.error('Error updating ticket status:', err);
      setError('Failed to update ticket status');
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

  return (
    <div className="admin-panel">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Luggage className="admin-icon" />
          <span className="admin-title">TrackMyBag Admin</span>
        </div>
        <nav className="admin-nav">
          {[
            { id: 'dashboard', icon: BarChart, label: 'Dashboard' },
            { id: 'luggage', icon: Luggage, label: 'Luggage' },
            { id: 'orders', icon: Package, label: 'Orders' },
            { id: 'products', icon: ShoppingBag, label: 'Products' },
            { id: 'support', icon: HelpCircle, label: 'Support' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`admin-nav-item ${activeTab === id ? 'active' : ''}`}
            >
              <Icon className="admin-icon" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-btn">
            <LogOut className="admin-icon" />
            <span>Logout</span>
          </button>
        </div>
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

                <form onSubmit={handleAddLuggage} className="luggage-form">
                  <div className="luggage-form-group">
                    <label>Luggage Name</label>
                    <input
                      type="text"
                      value={newLuggage.name}
                      onChange={(e) => setNewLuggage({ ...newLuggage, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="luggage-form-group">
                    <label>Status</label>
                    <select
                      value={newLuggage.status}
                      onChange={(e) => setNewLuggage({ ...newLuggage, status: e.target.value })}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Pending">Pending</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  <div className="luggage-form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={newLuggage.location}
                      onChange={(e) => setNewLuggage({ ...newLuggage, location: e.target.value })}
                      required
                    />
                  </div>

                  <div className="luggage-form-group">
                    <label>Number of Luggages</label>
                    <input
                      type="number"
                      value={newLuggage.num_lugg || ''}
                      onChange={(e) => setNewLuggage({ ...newLuggage, num_lugg: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="luggage-form-group">
                    <label>Tracking Link</label>
                    <input
                      type="text"
                      value={newLuggage.trackingLink}
                      onChange={(e) => setNewLuggage({ ...newLuggage, trackingLink: e.target.value })}
                    />
                  </div>

                  <div className="luggage-form-group">
                    <label>User</label>
                    <select
                      value={newLuggage.userId}
                      onChange={(e) => setNewLuggage({ ...newLuggage, userId: e.target.value })}
                      required
                    >
                      <option value="">Select User</option>
                      {userData.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" className="luggage-submit-button">
                    <Plus className="admin-icon" /> Add Luggage
                  </button>
                </form>

                <table className="luggage-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Location</th>
                      <th>Quantity</th>
                      <th>User</th>
                      <th>Tracking</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLuggage.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>
                          {editingLuggage?.id === item.id ? (
                            <input
                              type="text"
                              value={editingLuggage.name}
                              onChange={(e) => setEditingLuggage({...editingLuggage, name: e.target.value})}
                              className="edit-input"
                            />
                          ) : (
                            item.name
                          )}
                        </td>
                        <td>
                          {editingLuggage?.id === item.id ? (
                            <select
                              value={editingLuggage.status}
                              onChange={(e) => setEditingLuggage({...editingLuggage, status: e.target.value})}
                              className="edit-input"
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Transit">In Transit</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          ) : (
                            <span className={`luggage-status status-${item.status.toLowerCase()}`}>
                              {item.status}
                            </span>
                          )}
                        </td>
                        <td>
                          {editingLuggage?.id === item.id ? (
                            <input
                              type="text"
                              value={editingLuggage.location}
                              onChange={(e) => setEditingLuggage({...editingLuggage, location: e.target.value})}
                              className="edit-input"
                            />
                          ) : (
                            item.location
                          )}
                        </td>
                        <td>
                          {editingLuggage?.id === item.id ? (
                            <input
                              type="number"
                              value={editingLuggage.num_lugg || ''}
                              onChange={(e) => setEditingLuggage({
                                ...editingLuggage, 
                                num_lugg: e.target.value === '' ? '' : Number(e.target.value)
                              })}
                              className="edit-input"
                              min="0"
                            />
                          ) : (
                            item.num_lugg
                          )}
                        </td>
                        <td>
                          {editingLuggage?.id === item.id ? (
                            <select
                              value={editingLuggage.userId || ''}
                              onChange={(e) => setEditingLuggage({...editingLuggage, userId: e.target.value})}
                              className="edit-input"
                            >
                              <option value="">Select User</option>
                              {userData.map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.email}
                                </option>
                              ))}
                            </select>
                          ) : (
                            (() => {
                              const user = userData.find(user => String(user.id) === String(item.userId));
                              return user ? user.email : 'N/A';
                            })()
                          )}
                        </td>
                        <td>
                          {editingLuggage?.id === item.id ? (
                            <input
                              type="text"
                              value={editingLuggage.trackingLink}
                              onChange={(e) => setEditingLuggage({...editingLuggage, trackingLink: e.target.value})}
                              className="edit-input"
                            />
                          ) : (
                            item.trackingLink ? (
                              <a href={item.trackingLink} target="_blank" rel="noopener noreferrer">
                                Track
                              </a>
                            ) : (
                              'N/A'
                            )
                          )}
                        </td>
                        <td className="luggage-actions">
                          {editingLuggage?.id === item.id ? (
                            <>
                              <button
                                className="admin-save-button"
                                onClick={() => handleSaveLuggage(item.id)}
                              >
                                <Check className="admin-icon" />
                              </button>
                              <button
                                className="admin-cancel-button"
                                onClick={() => setEditingLuggage(null)}
                              >
                                <X className="admin-icon" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="luggage-action-button luggage-edit-button"
                                onClick={() => handleEditLuggage(item)}
                              >
                                <Edit className="admin-icon" />
                              </button>
                              <button
                                className="luggage-action-button luggage-delete-button"
                                onClick={() => handleDeleteLuggage(item.id)}
                              >
                                <Trash2 className="admin-icon" />
                              </button>
                            </>
                          )}
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
                        <td>
                          {editingOrder?.id === order.id ? (
                            <input
                              type="text"
                              value={editingOrder.username || ''}
                              onChange={(e) => setEditingOrder({
                                ...editingOrder,
                                username: e.target.value
                              })}
                              className="edit-input"
                            />
                          ) : (
                            order?.username || 'N/A'
                          )}
                        </td>
                        <td>
                          {editingOrder?.id === order.id ? (
                            <input
                              type="email"
                              value={editingOrder.email || ''}
                              onChange={(e) => setEditingOrder({
                                ...editingOrder,
                                email: e.target.value
                              })}
                              className="edit-input"
                            />
                          ) : (
                            order?.email || 'N/A'
                          )}
                        </td>
                        <td>
                          {editingOrder?.id === order.id ? (
                            <input
                              type="tel"
                              value={editingOrder.phone}
                              onChange={(e) => setEditingOrder({...editingOrder, phone: e.target.value})}
                              className="edit-input"
                            />
                          ) : (
                            order?.phone || 'N/A'
                          )}
                        </td>
                        <td>
                          {editingOrder?.id === order.id ? (
                            <input
                              type="text"
                              value={editingOrder.address}
                              onChange={(e) => setEditingOrder({...editingOrder, address: e.target.value})}
                              className="edit-input"
                            />
                          ) : (
                            order?.address || 'N/A'
                          )}
                        </td>
                        <td>{order?.orderTime ? new Date(order.orderTime).toLocaleString() : 'N/A'}</td>
                        <td>
                          {order?.items?.map((item, index) => (
                            <div key={index} className="order-item">
                              {item.name} x {item.quantity} (₹{item.price})
                            </div>
                          )) || 'No items'}
                        </td>
                        <td>₹{order?.total || 0}</td>
                        <td>
                          <select
                            value={editingOrder?.id === order.id ? editingOrder.status : order?.status || 'Pending'}
                            onChange={(e) => {
                              if (editingOrder?.id === order.id) {
                                setEditingOrder({...editingOrder, status: e.target.value});
                              } else {
                                handleUpdateOrderStatus(order.id, e.target.value);
                              }
                            }}
                            className="admin-status-select"
                          >
                            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td className="admin-actions">
                          {editingOrder?.id === order.id ? (
                            <>
                              <button
                                className="admin-save-button"
                                onClick={() => handleSaveOrder(order.id)}
                                disabled={isUpdating}
                                title="Save changes"
                              >
                                {isUpdating ? 'Saving...' : 'Save'}
                                <Check size={16} className="admin-icon" />
                              </button>
                              <button
                                className="admin-cancel-button"
                                onClick={() => setEditingOrder(null)}
                                title="Cancel editing"
                              >
                                <X size={16} className="admin-icon" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="admin-edit-button"
                                onClick={() => handleEditOrder(order)}
                                title="Edit order"
                              >
                                <Edit size={16} className="admin-icon" />
                              </button>
                              <button
                                className="admin-delete-button"
                                onClick={() => handleDeleteOrder(order.id)}
                                title="Delete order"
                              >
                                <Trash2 size={16} className="admin-icon" />
                              </button>
                            </>
                          )}
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

                <form onSubmit={addProduct} className="product-form">
                  <div className="product-form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="product-form-group">
                    <label>Price</label>
                    <input
                      type="number"
                      value={newProduct.price || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      required
                      step="0.01"
                    />
                  </div>

                  <div className="product-form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      required
                    />
                  </div>

                  <div className="product-form-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      value={newProduct.inStock || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, inStock: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="product-form-group">
                    <label>Product Image</label>
                    <div className="image-upload">
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
                        <div className="image-upload-area">
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

                  <div className="product-form-group">
                    <label>Description</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="product-submit-button">
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
                          <div className="product-image-cell">
                            {product.image ? (
                              <img 
                                src={product.image.startsWith('http') 
                                    ? product.image 
                                    : `http://localhost:3000/uploads/products/${product.image.split('/').pop()}`}
                                alt={product.name} 
                                className="product-table-image"
                                onError={(e) => {
                                    console.log('Image load error:', product.image);
                                    e.target.src = '/default-product.png';
                                }}
                              />
                            ) : (
                              <div className="no-image">No Image</div>
                            )}
                          </div>
                        </td>
                        <td>{product.id}</td>
                        <td>
                          {editingProduct?.id === product.id ? (
                            <input
                              type="text"
                              value={editingProduct.name}
                              onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                              className="edit-input"
                            />
                          ) : (
                            product.name
                          )}
                        </td>
                        <td>
                          {editingProduct?.id === product.id ? (
                            <input
                              type="number"
                              value={editingProduct.price}
                              onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                              className="edit-input"
                              step="0.01"
                            />
                          ) : (
                            `₹${product.price}`
                          )}
                        </td>
                        <td>
                          {editingProduct?.id === product.id ? (
                            <textarea
                              value={editingProduct.description}
                              onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                              className="edit-input"
                            />
                          ) : (
                            product.description
                          )}
                        </td>
                        <td>
                          {editingProduct?.id === product.id ? (
                            <input
                              type="text"
                              value={editingProduct.category}
                              onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                              className="edit-input"
                            />
                          ) : (
                            product.category
                          )}
                        </td>
                        <td>
                          {editingProduct?.id === product.id ? (
                            <input
                              type="number"
                              value={editingProduct.inStock}
                              onChange={(e) => setEditingProduct({...editingProduct, inStock: Number(e.target.value)})}
                              className="edit-input"
                            />
                          ) : (
                            product.inStock
                          )}
                        </td>
                        <td className="admin-actions">
                          {editingProduct?.id === product.id ? (
                            <>
                              <button
                                className="admin-save-button"
                                onClick={() => handleSaveProduct(product.id)}
                                title="Save changes"
                              >
                                <Check size={16} className="admin-icon" />
                              </button>
                              <button
                                className="admin-cancel-button"
                                onClick={() => setEditingProduct(null)}
                                title="Cancel editing"
                              >
                                <X size={16} className="admin-icon" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="admin-edit-button"
                                onClick={() => handleEditProduct(product)}
                                title="Edit product"
                              >
                                <Edit size={16} className="admin-icon" />
                              </button>
                              <button
                                className="admin-delete-button"
                                onClick={() => handleDeleteProduct(product.id)}
                                title="Delete product"
                              >
                                <Trash2 size={16} className="admin-icon" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'support' && (
              <div className="admin-support-management">
                <div className="admin-section-header">
                  <h2>Support Management</h2>
                  <p>Manage customer support tickets</p>
                </div>

                <div className="admin-controls">
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    className="admin-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>User</th>
                      <th>Subject</th>
                      <th>Message</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supportTickets
                      .filter(ticket => 
                        ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((ticket) => (
                        <tr key={ticket.id}>
                          <td>{ticket.id}</td>
                          <td>{ticket.userName}</td>
                          <td>{ticket.subject}</td>
                          <td className="message-cell">{ticket.message}</td>
                          <td>
                            <select 
                              value={ticket.status || 'pending'}
                              className="status-select"
                              onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="resolved">Resolved</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                          <td className="admin-actions">
                            <button
                              className="admin-view-button"
                              onClick={() => handleViewTicket(ticket)}
                              title="View ticket details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="admin-delete-button"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this ticket?')) {
                                  handleDeleteTicket(ticket.id);
                                }
                              }}
                              title="Delete ticket"
                            >
                              <Trash2 size={16} />
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