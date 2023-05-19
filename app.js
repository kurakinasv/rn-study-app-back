const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');

const initRoutes = require('./routes');

const app = express();

app.use(express.json({ extended: true }));

initRoutes(app);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
  } catch (e) {
    console.log('Server Error', e.message);
    process.exit(1);
  }
};

start();
