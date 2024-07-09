// ------------------------------------------ current
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from './components/Admin';
import User from './components/User';
import axios from 'axios';
import Login from './components/Login';
import Home from './components/Home';
import { getProducts, saveProducts } from './utils/localStorage';
// import { saveProducts } from './utils/localStorage'; // Assuming saveProducts is implemented correctly
axios.defaults.baseURL = 'http://localhost:5000';
// import initialProducts from '/data/Data.json';

function App() {
  const [role, setRole] = useState('user'); // 'user' or 'admin'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [salesData, setSalesData] = useState({});

  // -----------extract the data form the json file locally
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // const response = await fetch('/data/Data.json'); // Adjust the path as per your project structure
  //       const response = await axios.get('/api/products'); // Assuming your backend endpoint is '/api/products'
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       const data = await response.json();
  //       setProducts(data);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  //   fetchData();
  // }, []);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/products'); // Ensure this URL matches your backend endpoint
      if (response.status !== 200) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      setProducts(response.data); // Set products state with fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, []);

  const updateProducts = (updatedProducts) => {
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
  };

  const updateSalesData = (saleAmount, productId) => {
    setSalesData(prevSalesData => ({
      ...prevSalesData,
      [productId]: (prevSalesData[productId] || 0) + saleAmount
    }));
  };

  const getTotalSales = () => {
    return Object.values(salesData).reduce((total, amount) => total + amount, 0);
  };

  const handleLogin = (username, password) => {
    if (username === 'admin' && password === 'password') {
      setIsLoggedIn(true);
      setRole('admin');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<User products={products} updateProducts={updateProducts} updateSalesData={updateSalesData} />} />
          <Route path="/admin" element={isLoggedIn ? <Admin products={products} updateProducts={updateProducts} totalSales={getTotalSales()} /> : <Login onLogin={handleLogin} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// ----------------expermmenting

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// axios.defaults.baseURL = 'http://localhost:5000'; // Set this base URL according to your backend server

// function App() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('/api/products'); // Ensure this URL matches your backend endpoint
//         if (response.status !== 200) {
//           throw new Error(`Request failed with status ${response.status}`);
//         }
//         setProducts(response.data); // Set products state with fetched data
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const saveData = async (newData) => {
//     try {
//       const response = await axios.post('/api/products', newData);
//       if (response.status !== 200) {
//         throw new Error(`Request failed with status ${response.status}`);
//       }
//       console.log('Data saved successfully');
//     } catch (error) {
//       console.error('Error saving data:', error);
//     }
//   };

//   const handleAddProduct = () => {
//     const newProduct = {
//       id: products.length + 1,
//       name: 'New Product',
//       description: 'Description of new product',
//       price: 100,
//       stock: 50,
//     };
//     const updatedProducts = [...products, newProduct];
//     setProducts(updatedProducts);
//     saveData(updatedProducts);
//   };

//   return (
//     <div>
//       <h1>Products</h1>
//       <button onClick={handleAddProduct}>Add Product</button>
//       {products.length > 0 ? (
//         <ul>
//           {products.map((product) => (
//             <li key={product.id}>
//               <h2>{product.name}</h2>
//               <p>{product.description}</p>
//               <p>Price: ${product.price}</p>
//               <p>Stock: {product.stock}</p>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No products available</p>
//       )}
//     </div>
//   );
// }

// export default App;

