const express = require('express');
const dotenv = require('dotenv'); // for reading environment variables

const app = express();

dotenv.config();

const mongoose = require('mongoose');
mongoose.connect(process.env.VITE_MONGODB_URI)

console.log("made it here");

app.get('/api/login', async(req, res) => {
    console.log('Request: ', req, ' Result: ', res)
    res.sendStatus(200)
})

const port = process.env.PORT || 3000
app.listen(port);
