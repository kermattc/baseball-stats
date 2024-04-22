// // import jwt from 'jsonwebtoken';

// const express = require('express');
// const jwt = require('jsonwebtoken');
// const router = express.Router();

// // export function getJWTToken(username) {
// //     const jwtSecretKey1 = process.env.VITE_JWT_SECRET_KEY
// //     const jwtSecretKey2 = import.meta.env.VITE_JWT_SECRET_KEY

// //     console.log("secret key 1: ", jwtSecretKey1)
// //     console.log("secret key 2: ", jwtSecretKey2)

// //     let data = {
// //         signInTime: Date.now(),
// //         username: username
// //     }

// //     // console.log("data: ", data)
// //     // const token = jwt.sign(data, jwtSecretKey)

// //     // console.log("Token: ", token)
// //     // return token;
// // }

// // export default { getJWTToken };

// router.post('/getJWTToken', (req, res) => {
//     const jwtSecretKey = process.env.VITE_JWT_SECRET_KEY
//     // const username = req.body.username

//     console.log("secret key : ", jwtSecretKey)

//     // let data = {
//     //     signInTime: Date.now(),
//     //     username: username
//     // }

//     // const token = jwt.sign(data, jwtSecretKey)
//     // res.status(200).json({ message: 'success', token });

// })

// module.exports = router;
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Configure body-parser middleware
// router.use(bodyParser.json());

router.post('/getJWTToken', (req, res) => {
    const jwtSecretKey = process.env.VITE_JWT_SECRET_KEY;
    const username = req.body.username;

    console.log("secret key : ", jwtSecretKey);

    let data = {
        signInTime: Date.now(),
        username: username
    };

    const token = jwt.sign(data, jwtSecretKey);
    res.status(200).json({ message: 'successfully created token', token });
});

module.exports = router;