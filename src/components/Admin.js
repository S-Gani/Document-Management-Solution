
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductList from './ProductList';
import './Admin.css'; // Import your custom CSS for styling
import homeLogo from './home-logo.png'; // Make sure you have a home-logo.png in your project
import userIcon from './user-icon.png'; // Make sure you have a user-icon.png in your project

function Admin({ products, updateProducts, totalSales }) {
  const minStockThreshold = 5;
  const lowStockProducts = products.filter((product) => product.stock <= minStockThreshold);
  const [showAddStockPopup, setShowAddStockPopup] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false); // State for showing edit product modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddProductForm, setShowAddProductForm] = useState(false); // State for showing the add product form
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState(false);

  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    productStock: 0,
    productPrice: 0,
    productImage: '',
  });

  useEffect(() => {
    // Fetch initial products data from backend on component mount
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products'); // Assuming your backend endpoint is '/api/products'
      updateProducts(response.data); // Update local state with fetched products
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddStockClick = (product) => {
    setSelectedProduct(product);
    setShowAddStockPopup(true);
  };


  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      productName: product.name,
      productDescription: product.description,
      productStock: product.stock,
      productPrice: product.price,
      productImage: product.image,
    });
    setShowEditProductModal(true);
  };

  const confirmAction = () => {
    // Implementation for confirmAction
    setShowConfirmDialog(true)
    setShowEditProductModal(false);
    // handleEditProduct(false);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedProduct = {
        ...selectedProduct,
        name: formData.productName,
        description: formData.productDescription,
        stock: parseInt(formData.productStock, 10),
        price: parseInt(formData.productPrice, 10),
        image: formData.productImage,
      };
      
      const response = await axios.put(`/api/products/${selectedProduct.id}`, updatedProduct);
      if (response.status === 200) {
        const fetchResponse = await axios.get('/api/products');
        updateProducts(fetchResponse.data);
        setShowEditProductModal(false);
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      const response = await axios.delete(`/api/products/${selectedProduct.id}`);
      if (response.status === 200) {
        updateProducts(products.filter(p => p.id !== selectedProduct.id));
        setSelectedProduct(null);
        setShowEditProductModal(false);
        setShowConfirmDialog(false)
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };



  const handleAddStock = async () => {
    if (selectedProduct && quantity > 0) {
      try {
        const updatedProduct = {
          ...selectedProduct,
          stock: selectedProduct.stock + parseInt(quantity, 10),
        };
        const response = await axios.put(`/api/products/${selectedProduct.id}`, updatedProduct);
        updateProducts(products.map(p => p.id === selectedProduct.id ? response.data : p));
      } catch (error) {
        console.error('Error adding stock:', error);
      }
    }
    setShowAddStockPopup(false);
    setSelectedProduct(null);
    setQuantity(0);
  };

  const toggleAddProductForm = () => {
    setShowAddProductForm(!showAddProductForm);
    setFormData({
      productName: '',
      productDescription: '',
      productStock: 0,
      productPrice: 0,
      productImage: '',
    });
    setShowEditProductModal(false);
    setShowAddStockPopup(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    // Form data extraction and preparation
    const newData = {
      id: products.length ? products[products.length - 1].id + 1 : 1,
      name: formData.productName,
      description: formData.productDescription,
      stock: parseInt(formData.productStock, 10),
      price: parseInt(formData.productPrice, 10),
      image: formData.productImage,
    };
    
    try {
      // Send POST request to backend to add new product
      const response = await axios.post('/api/products', newData);
      if (response.status !== 200) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      console.log('Data saved successfully');
      // updateProducts([...products, response.data]); // Update the products state with the new product
       // Re-fetch the products from backend to update the products state with the new product
    const fetchResponse = await axios.get('/api/products');
    if (fetchResponse.status !== 200) {
      throw new Error(`Request failed with status ${fetchResponse.status}`);
    }
    updateProducts(fetchResponse.data); 
    } catch (error) {
      console.error('Error saving data:', error);
    }
    
    setShowAddProductForm(false); // Close the form after submission
    setFormData({
      productName: '',
      productDescription: '',
      productStock: 0,
      productPrice: 0,
      productImage: '',
    }); // Reset form data
    
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    // Simulated sales data for the selected date, replace with actual data retrieval logic
    setSalesData([
      { id: 1, name: 'Product 1', amount: 100, stockSold: 1 },
      // { id: 2, name: 'Product 2', amount: 150, stockSold: 3 },
    ]);
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <Link to="/" className="home-button">
          <img src={homeLogo} alt="Home" />
        </Link>
        <h1>Admin Dashboard</h1>
        <img 
          src={userIcon} 
          alt="User" 
          className="user-icon" 
          onClick={() => setShowProfile(!showProfile)} 
        />
        <h2>Total Sales: ₹{totalSales}</h2>
      </header>
      <div className={`admin-profile-sidebar ${showProfile ? 'open' : ''}`}>
        <h2>Admin Profile</h2>
        <p>Admin_Name</p>
        <p>+91 911XXXXXXX</p>
        <button onClick={() => setShowProfile(false)}>Close</button>
      </div>
      <div className="admin-content">
        <section className="low-stock">
          <h2>Low Stock Alert</h2>
          {lowStockProducts.length > 0 ? (
            <ul>
              {lowStockProducts.map((product) => (
                <li key={product.id} className="low-stock-product">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <br></br>
                  <div className="product-details">
                    <p className="product-name">{product.name}</p>
                    <p className="product-stock">Stock is low: {product.stock} remaining</p>
                    <button className="add-stock-button" onClick={() => handleAddStockClick(product)}>Add Stock</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No low stock products</p>
          )}
        </section>

        <section className="sales">
          <div className="container">
            <div className="add-product">
              <h2>Add Product</h2>
              <button className="add-product-button" onClick={toggleAddProductForm}>
                Add Product
              </button>
            </div>
            
            <div className="sale">
              {/* Sales Section */}
              {/* <h2>Sales</h2> */}
              {/* <label htmlFor="date">Select Date:</label> */}
              {/* <input */}
                {/* type="date" */}
                {/* id="date" */}
                {/* value={selectedDate} */}
                {/* onChange={handleDateChange} */}
              {/* /> */}
              <br></br>
              {/* {salesData.length > 0 ? ( */}
                {/* <ul> */}
                  {/* {salesData.map((sale) => ( */}
                    {/* <li key={sale.id}> */}
                      {/* Total Sales: ₹{totalSales} */}
                      {/* <br></br> */}
                      {/* Quantity Sold: {sale.stockSold} */}
                    {/* </li> */}
                  {/* ))} */}
                {/* </ul> */}
              {/* ) : ( */}
                {/* <p>No sales data for selected date</p> */}
              {/* )} */}
            </div> 
            
          </div>
        </section>
        <section className="all-products">
          <h2>All Products</h2>
          {/* <ProductList products={products} isAdmin /> */}
          <ProductList
            products={products}
            isAdmin
            onEditProduct={handleEditProduct} // Pass the edit function to ProductList
          />
        </section>
      </div>

      {/* Edit Product Modal */}
      {selectedProduct && showEditProductModal && (
        <div className="modall">
          <div className="modall-content">
            <span className="close" onClick={() => setShowEditProductModal(false)}>&times;</span>
            <h2>Edit Product</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
              <label htmlFor="editProductName">Product Name</label>
              <input
                type="text"
                id="editProductName"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="editProductDescription">Product Description</label>
              <textarea
                id="editProductDescription"
                name="productDescription"
                value={formData.productDescription}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="editProductStock">Product Stock</label>
              <input
                type="number"
                id="editProductStock"
                name="productStock"
                value={formData.productStock}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="editProductPrice">Product Price</label>
              <input
                type="number"
                id="editProductPrice"
                name="productPrice"
                value={formData.productPrice}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="editProductImage">Product Image</label>
              <input
                type="text"
                id="editProductImage"
                name="productImage"
                value={formData.productImage}
                onChange={handleInputChange}
                required
              />
              
              <button type="submit" style={{ marginLeft: '20%'}}>Save</button>
              <button type="button" onClick={confirmAction} style={{ marginLeft: '20%', backgroundColor: 'red' }}>Delete</button>
              </form>
              {/* Save Button with Confirmation Dialog */}
              {/* <button type="submit" onClick={() => confirmAction('save')} style={{ marginLeft: '20%' }}>Save</button> */}

              {/* Delete Button with Confirmation Dialog */}
              {/* </form><button type="button" onClick={() => confirmAction('delete')} style={{ marginLeft: '20%', backgroundColor: 'red' }}>Delete</button> */}
            {/* </form> */}
          </div>
        </div>
      )}

      {/* Confirm Dialog Component */}
      {showConfirmDialog && (
        <div className="popup">
          <div className="popup-content">
            <p>would you like to delete the product</p>
            <button onClick={handleDeleteProduct}>Yes</button>
            <button onClick={() => setShowConfirmDialog(false)}>No</button>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      <div className={`modal ${showAddProductForm ? 'show' : ''}`} onClick={toggleAddProductForm}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <span className="close" onClick={toggleAddProductForm}>&times;</span>
          <h2>Add Product</h2>
          <form onSubmit={handleAddProductSubmit}>
            <label htmlFor="productName">Product Name:</label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              required
            /><br />
            <label htmlFor="productDescription">Description:</label>
            <textarea
              id="productDescription"
              name="productDescription"
              value={formData.productDescription}
              onChange={handleInputChange}
              required
            ></textarea><br />
            <label htmlFor="productStock">Stock:</label>
            <input
              type="number"
              id="productStock"
              name="productStock"
              value={formData.productStock}
              onChange={handleInputChange}
              required
            /><br />
            <label htmlFor="productPrice">Price:</label>
            <input
              type="number"
              id="productPrice"
              name="productPrice"
              value={formData.productPrice}
              onChange={handleInputChange}
              required
            /><br />
            <label htmlFor="productImage">Product Image URL:</label>
            <input
              type="text"
              id="productImage"
              name="productImage"
              value={formData.productImage}
              onChange={handleInputChange}
              required
            /><br />
            <button type="submit" className="add-product-button">Submit</button>
          </form>
        </div>
      </div>

      {showAddStockPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Enter quantity to add for {selectedProduct.name}:</p>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className='quanipfield'
            />
            <button onClick={handleAddStock}>Add Stock</button>
            <button onClick={() => setShowAddStockPopup(false)}>Cancel</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Admin;
