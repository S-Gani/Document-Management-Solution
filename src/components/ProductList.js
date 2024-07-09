// ProductList.js (or wherever you render product cards)
import React from 'react';
import './ProductList.css'; 
// Import your custom CSS for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';


function ProductList({ products, isAdmin, onEditProduct }) {
  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product-itemm">
          <img src={product.image} alt={product.name} className="product-imagee" />
          <div className="product-infoo">
            <h3>{product.name}</h3>
            <p>Price: ₹{product.price}</p>
            {isAdmin ? (
              <>
                <p>Stock: {product.stock}</p>
                {/* <button className="edit-button" onClick={() => onEditProduct(product)}>
                  Edit
                </button> */}
                <button className="edit-product-button" onClick={() => onEditProduct(product)}>
                <FontAwesomeIcon icon={faCog} /> {/* Gear symbol icon */}
              </button>
              </>
            ) : (
              <p>Description: {product.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;

