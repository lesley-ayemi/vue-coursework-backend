// Import required modules
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');
const { MongoClient } = require('mongodb');

// Create an Express application
const app = express();

// MongoDB Atlas connection
const MONGO_URI = 'mongodb+srv://lesley:Lesleyp1@backend-store.lprk2.mongodb.net/'; //  MongoDB Atlas URI
const client = new MongoClient(MONGO_URI);

let productsCollection;
let ordersCollection;

// Connect to MongoDB Atlas
(async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    const database = client.db('webstore'); //  Database name
    productsCollection = database.collection('products'); //  collection name
    ordersCollection = database.collection('orders'); //  collection name
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas:', err);
  }
})();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(morgan("short"));

const staticMiddleware = express.static(path.join(__dirname, '../coursework/dist'));
app.use('/vue-coursework', staticMiddleware); // Serve static files under the base URL

app.get('/vue-coursework/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../coursework/dist', 'index.html'));
});

// Use a middleware to log errors if static files cannot be served
app.use((req, res, next) => {
  staticMiddleware(req, res, (err) => {
    if (err) {
      console.error(`Error serving static file: ${err.message}`);
      res.status(500).send('Internal Server Error while serving static files.');
    } else {
      next();
    }
  });

// Catch-all route to handle SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../coursework/dist', 'index.html'));
});


app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body;
    console.log('Received order:', order); // Log the incoming order for debugging

    if (!order.customer || !order.items || !order.total) {
      console.error('Invalid order data:', order);
      return res.status(400).json({ success: false, message: 'Invalid order data' });
    }


    ordersCollection.insertOne(order);
    res.json({ success: true, message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
});


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
