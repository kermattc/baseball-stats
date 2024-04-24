const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/getJWT', (req, res) => {
    const jwtSecretKey = process.env.VITE_JWT_SECRET_KEY;
    const username = req.body.username;

    let data = {
        username: username,
        signInTime: Date.now()
    };

    const token = jwt.sign(data, jwtSecretKey, {expiresIn: '1h'});

    // return cookie with token
    res
        .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .json({message: "JWT successfully created"})

    // res.status(200).json({ message: 'successfully created token', token});
});

module.exports = router;