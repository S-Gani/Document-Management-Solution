import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductList from './ProductList';
import axios from 'axios';
import './User.css'; 
import homeLogo from './home-logo.png';

function User({ products, updateProducts, updateSalesData }) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    paymentOption: 'cod',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const timeoutRef = useRef(null);
  const [quantity, setQuantity] = useState(1); // State to hold the selected quantity


  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleBuyClick = (product) => {
    setSelectedProduct(product);
    setShowPopup(true);
  };

  const handleConfirmBuy = (confirm) => {
    if (confirm && selectedProduct) {
      setStep(2);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const isValidPhoneNumber = /^\d{10}$/.test(formData.phone);
    if (!isValidPhoneNumber) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    const isPaymentSuccessful = true; 
    if (isPaymentSuccessful) {
      const updatedProducts = products.map((product) =>
        product.id === selectedProduct.id && product.stock > 0
          ? { ...product, stock: product.stock - quantity }
          : product
      );
      updateProducts(updatedProducts);

      const saleAmount = selectedProduct.price * quantity;
      updateSalesData(saleAmount, selectedProduct.id);


      try {
        // Send PUT request to backend to update the product's stock
        const response = await axios.put(`/api/products/${selectedProduct.id}`, {
          ...selectedProduct,
          stock: selectedProduct.stock - quantity,
        });
        if (response.status !== 200) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        console.log('Product stock updated successfully');
      } catch (error) {
        console.error('Error updating product stock:', error);
      }

      
      resetForm();
      setOrderPlaced(true);
      timeoutRef.current = setTimeout(() => {
        setOrderPlaced(false);
      }, 5000);
    }
  };

  const resetForm = () => {
    setShowPopup(false);
    setSelectedProduct(null);
    setFormData({
      name: '',
      address: '',
      phone: '',
      paymentOption: 'cod',
    });
    setStep(1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // const filteredProducts = products.filter((product) =>
  //   product.name.toLowerCase().includes(searchQuery)
  // );
  const filteredProducts = products.filter((product) =>
    product.name && product.name.toLowerCase().includes(searchQuery)
  );
  

  return (
    <div className="user-page">
      <header className="user-header">
        <Link to="/" className="home-button">
          <img src={homeLogo} alt="Home" />
        </Link>
        {/* <h1 className="user-page-welcome">Happy Shopping</h1> */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar"
        />
      </header>
      {searchQuery ? (
        <section className="search-results">
          <h2>Search Results</h2>
          <ProductList products={filteredProducts} buyProduct={handleBuyClick} />
        </section>
      ) : (
        <>
          <section className="featured-products">
            <h2>Featured Products</h2>
            <div className="product-gridd">
              {products.slice(0, 4).map((product) => (
                <div className="product-cardd" key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p className="product-descriptionn">{product.description}</p>
                  <p className="product-pricee">₹{product.price}</p>
                  {/* <button onClick={() => handleBuyClick(product)}>Buy Now</button> */}
                  {product.stock > 0 ? (
                    <button onClick={() => handleBuyClick(product)}>Buy Now</button>
                  ) : (
                    <p className="out-of-stock">Out of Stock</p>
                  )}
                </div>
              ))}
            </div>
          </section>
          <section className="all-productss">
          <h2>All Products</h2>
          <div className="product-griddd">
            {products.map((product) => (
              <div className="product-carddd" key={product.id}>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="product-descriptionnn">{product.description}</p>
                <p className="product-stockkk">Quantity: {product.stock}</p> {/* Changed Stock to Quantity */}
                {/* <p className="product-stockk">Stock:{product.stock}</p> */}
                <p className="product-priceee">Price:₹{product.price}</p>
                {/* <button onClick={() => handleBuyClick(product)}>Buy Now</button> */}
                {product.stock > 0 ? (
                    <button onClick={() => handleBuyClick(product)}>Buy Now</button>
                  ) : (
                    <p className="out-of-stock">Out of Stock</p>
                  )}
                
                </div>
             ))}
           </div>
          </section>
        </>
      )}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            {step === 1 && (
              <div>
                <p>Would you like to buy this product?</p>
                <button onClick={() => handleConfirmBuy(true)}className="button-spacing" >Yes</button>
                <button onClick={() => setShowPopup(false)}>No</button>
              </div>
            )}
            {step === 2 && (
              <form onSubmit={handleFormSubmit}>
                 <h3>Select Quantity</h3>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                >
                  {[...Array(selectedProduct.stock)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <h3>Delivery Address</h3>
                <label>Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <label>Address:</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
                <label>Phone:</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
                <h3>Payment Options</h3>
                <label>Payment Option:</label>
                <select
                  value={formData.paymentOption}
                  onChange={(e) => setFormData({ ...formData, paymentOption: e.target.value })}
                >
                  <option value="cod">Cash on Delivery</option>
                  <option value="upi">UPI</option>
                  <option value="netbanking">Net Banking</option>
                </select>
                <button type="submit">Place Order</button>
              </form>
            )}
          </div>
        </div>
      )}
      {orderPlaced && (
        <div className="popup">
          <div className="popup-content">
            <p>Thank you for shopping with us!</p>
            <button onClick={() => setOrderPlaced(false)}>Close</button>
          </div>
        </div>
      )}
      <footer className="user-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Customer Service</h3>
            <ul>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/returns">Returns</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>About Us</h3>
            <ul>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/press">Press</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <ul>
              <li><a href="https://www.facebook.com">Facebook</a></li>
              <li><a href="https://www.twitter.com">Twitter</a></li>
              <li><a href="https://www.instagram.com">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Your E-Commerce Store. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default User;
