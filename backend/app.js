const path = require('path');

const express = require('express');
const db = require('./db');


const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  // Set CORS headers so that the React SPA is able to communicate with this server
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/products', productRoutes);
app.use('/', authRoutes);

db.initDb((err, client) => {
  if (err) {
    console.log('DB connection failed couldnt start server')
  } else {
    console.log('Server started on port', process.env.BACKEND_PORT)
    app.listen(process.env.BACKEND_PORT || 3100);
  }
});

