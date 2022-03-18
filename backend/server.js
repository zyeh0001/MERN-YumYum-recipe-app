const express = require('express');
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

//Handle error
app.use(errorHandler);

app.listen(PORT, () => console.log('SERVER STARTED ON PORT' + PORT));
