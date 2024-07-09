import React from 'react';

function Product({ product, isAdmin, buyProduct }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>Price: ₹{product.price}</p>
      <p>Stock: {product.stock}</p>
      {!isAdmin && (
        <button onClick={() => buyProduct(product)} disabled={product.stock === 0}>
          {product.stock > 0 ? 'Buy' : 'Out of Stock'}
        </button>
      )}
    </div>
  );
}

export default Product;


