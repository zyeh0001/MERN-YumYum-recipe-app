const express = require('express');
const path = require('path');
require('colors');
require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const PORT = process.env.PORT || 8000;

const app = express();
//Connect to database
const connectDB = require('./config/db');
connectDB();

app.use(express.json()); //api can accept raw json form
app.use(express.urlencoded({ extended: false })); //api can accept urlEncoded form

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello' });
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/recipes', require('./routes/recipeRoutes'));

//Serve Frontend
if (process.env.NODE_ENV === 'production') {
  // Set build folder as static
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // FIX: below code fixes app crashing on refresh in deployment
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the YumYum Recipe finder' });
  });
}

//Handle error
app.use(errorHandler);

app.listen(PORT, () => console.log('SERVER STARTED ON PORT' + PORT));
