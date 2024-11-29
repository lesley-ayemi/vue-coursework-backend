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




const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
