const UserRouter = require('./client/src/api/user.cjs');
const JWTRouter = require('./client/src/api/jwt.cjs');

const express = require('express');
const dotenv = require('dotenv'); // for reading environment variables
dotenv.config();

const app = express();
app.use(express.json())

const mongoose = require('mongoose');
mongoose.connect(process.env.VITE_MONGODB_URI)

console.log("Server's running");

// use the 'user' api defined in /api/user.cjs
app.use('/user', UserRouter)
app.use('/jwt', JWTRouter)

const port = process.env.PORT || 3001
app.listen(port);
