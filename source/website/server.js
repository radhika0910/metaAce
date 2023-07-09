import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 3000;

// Middleware to parse request bodies and cookies
app.use(bodyParser.json());
app.use(cookieParser());

// Connect to the MongoDB database
async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb+srv://demo:Radhika123456@3dviewer.fs33ycy.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit the process with a failure code
  }
}

app.use(express.json());

import alienRouter from './routes/user.get.route.js';
app.use('/aliens', alienRouter);

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const token = req.headers.authorization || req.query.token || req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, 'secretKey');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

// Authentication endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Your authentication logic here
  // Example: Check if the username and password match a user in the database

  // If authentication is successful, generate a token
  const token = jwt.sign({ username }, 'secretKey');

  // Return the token as a response
  res.json({ token });
});

// Protected route example
app.get('/api/dashboard', authenticateToken, (req, res) => {
  res.send('Welcome to the dashboard');
});

// Start the server and connect to the database
async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1); // Exit the process with a failure code
  }
}

startServer();
