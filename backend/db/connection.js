const mongoose = require('mongoose');
require('dotenv').config();

const connection = async () => {
  try {
    await mongoose.connect(process.env.REACT_API);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connection;
