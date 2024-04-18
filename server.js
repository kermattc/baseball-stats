const express = require('express');
const app = express();


console.log("made it here");

app.get('/api/login', async(req, res) => {
    console.log('Request: ', req, ' Result: ', res)
    res.sendStatus(200)
})

const port = process.env.PORT || 3000
app.listen(port);
