// const express = require('express');
// const fs = require('fs-extra');
// const path = require('path');

// const app = express();
// const PORT = process.env.PORT || 5000;
// const DATA_FILE = path.join(__dirname, 'data', 'Data.json');

// app.use(express.json());

// // Read all products
// // Endpoint to serve Data.json
// app.get('/api/products', (req, res) => {
//     try {
//       const dataPath = path.join(__dirname, 'data', 'Data.json'); // Adjust path as per your file structure
//       const data = fs.readFileSync(dataPath, 'utf-8');
//       res.json(JSON.parse(data));
//     } catch (error) {
//       console.error('Error reading Data.json:', error);
//       res.status(500).json({ error: 'Failed to read data' });
//     }
//   });

// // Add a new product
// app.post('/api/products', async (req, res) => {
//   try {
//     const newProduct = req.body;
//     const products = await fs.readJson(DATA_FILE);
//     newProduct.id = products.length + 1; // Replace with better ID generation
//     products.push(newProduct);
//     await fs.writeJson(DATA_FILE, products, { spaces: 2 });
//     res.status(201).json(newProduct);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// // Update a product
// app.put('/api/products/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedProduct = req.body;
//     const products = await fs.readJson(DATA_FILE);
//     const index = products.findIndex(p => p.id === parseInt(id));
//     if (index === -1) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     products[index] = { ...products[index], ...updatedProduct };
//     await fs.writeJson(DATA_FILE, products, { spaces: 2 });
//     res.json(products[index]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// // Delete a product
// app.delete('/api/products/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const products = await fs.readJson(DATA_FILE);
//     const updatedProducts = products.filter(p => p.id !== parseInt(id));
//     if (products.length === updatedProducts.length) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     await fs.writeJson(DATA_FILE, updatedProducts, { spaces: 2 });
//     res.json({ message: 'Product deleted' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


// // ----------currently working reaad the data from the file running the file,
// const express = require('express');
// const cors = require('cors');
// const app = express();
// const path = require('path');
// const fs = require('fs');

// // Use CORS middleware
// app.use(cors());

// app.get('/api/products', (req, res) => {
//   try {
//     const dataPath = path.join(__dirname, 'public', 'data', 'Data.json'); // Adjust the path to Data.json
//     const data = fs.readFileSync(dataPath, 'utf-8');
//     res.json(JSON.parse(data));
//   } catch (error) {
//     console.error('Error reading Data.json:', error);
//     res.status(500).json({ error: 'Failed to read data' });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// --------------------------- this is sample checking code..............
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// const PORT = 5000;

// app.use(bodyParser.json());
// app.use(cors());

// const dataFilePath = path.join(__dirname, 'public', 'data', 'Data.json');

// // Endpoint to get products
// app.get('/api/products', (req, res) => {
//   fs.readFile(dataFilePath, 'utf8', (err, data) => {
//     if (err) {
//       return res.status(500).json({ error: 'Failed to read data file' });
//     }
//     res.json(JSON.parse(data));
//   });
// });

// // Endpoint to save products
// app.post('/api/products', (req, res) => {
//   const newData = req.body;

//   fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2), 'utf8', (err) => {
//     if (err) {
//       return res.status(500).json({ error: 'Failed to write data file' });
//     }
//     res.status(200).json({ message: 'Data saved successfully' });
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


//--------------------experinmenting newly
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

const dataFilePath = path.join(__dirname, 'public', 'data', 'Data.json');

// Endpoint to get products
app.get('/api/products', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data file' });
    }
    res.json(JSON.parse(data));
  });
});

// Endpoint to save products
app.post('/api/products', (req, res) => {
  const newData = req.body;

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data file' });
    }

    let products = JSON.parse(data);
    products.push(newData);

    fs.writeFile(dataFilePath, JSON.stringify(products, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to write data file' });
      }
      res.status(200).json({ message: 'Data saved successfully' });
    });
  });
});

// Endpoint to update product stock
app.put('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const updatedProduct = req.body;

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data file' });
    }

    const products = JSON.parse(data);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    products[productIndex] = updatedProduct;

    fs.writeFile(dataFilePath, JSON.stringify(products, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to write data file' });
      }
      res.status(200).json(updatedProduct);
    });
  });
});

// Endpoint to delete product
app.delete('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data file' });
    }

    let products = JSON.parse(data);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    products.splice(productIndex, 1);

    fs.writeFile(dataFilePath, JSON.stringify(products, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to write data file' });
      }
      res.status(200).json({ message: 'Product deleted successfully' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

