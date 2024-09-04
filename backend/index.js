const express = require('express');
const config = require('./config');
const cors = require('cors');
const morgan = require('morgan');
const sequelize = require('./config/database');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middleware (should be after all routes)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
