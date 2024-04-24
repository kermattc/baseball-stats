const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');

// mongodb user model
const User = require('./../models/user.cjs')

// sign up
router.post('/register', (req, res) => {
    let {username, email, password} = req.body;
    console.log("username: ", username)

    // remove whitespace
    username = username.trim();
    email = email.trim();
    password = password.trim();

    // check for empty fields
    if (username == "" || email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Empty input fields"
        })
    } else if (!/^[a-zA-Z0-9]*$/.test(username)) {
        res.json({
            status: "FAILED",
            message: "Invalid username entered"
        })
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email"
        })
    } else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password is too short"
        })
    } else {
        // check if user already exists
        User.find({email}).then(result => {
            if (result.length) {
                res.json({
                    status: "FAILED",
                    message: "User with provided email already exists"
                })
            } else {
                // create new user. Hash the password using bcrypt
                const saltRounds = parseInt(process.env.VITE_SALT_ROUNDS);
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new User ({
                        username,
                        email,
                        password: hashedPassword
                    })

                    newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "Register successful",
                            data: result
                        })
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "AN error occurred while creating your account"
                        })
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.json({
                        status: "FAILED",
                        message: "An error occured while hashing password"
                    })
                })

            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error occurred while checking for existing user"
            })
        })
    }
})

// sign in 
router.post('/login', (req, res) => {
    let {username, email, password} = req.body;

    // remove whitespace
    username = username.trim();
    email = email.trim();
    password = password.trim();

    if (email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Empty credentials supplied"
        })
    } else {
        // check if user exists
        User.find({email})
        .then(data => {
            // console.log("Finding email, returns data. Data: ", data)
            if (data.length > 0) {
                // User exists
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if (result) {
                        res.json({
                            status: "SUCCESS",
                            message: "Sign in successful",
                            data: data
                        })
                    } else {
                        res.json({
                            status: "FAILED",
                            message: "Invalid credentials"
                        })
                    }
                }) 
                .catch(err => {
                    console.log(err)
                    res.json({
                        status: "FAILED",
                        message: "An error occurred"
                    })
                })
            } else {
                res.json({
                    status: "FAILED",
                    message: "Invalid credentials"
                })
            }
        })
        .catch(err => {
            res.json({
                status: "FAILED",
                message: "An error occurred"
            })
        })
    }
})

// middleware to check for cookie
const authorization = (req, res, next) => {
    console.log("token: ", req.cookies.access_token)
    // console.log("cookie: ", req.headers.cookie)
    // console.log("token? : ", req.headers.cookie['access_token'])

    const token = req.cookies.access_token;
    // console.log("Token: ", token)
    if (!token) {
        console.log("No token")
        return res.sendStatus(403); // 403 = forbidden, unauthorized
    }

    // verify token and get data
    try {
        const data = jwt.verify(token, process.env.VITE_JWT_SECRET_KEY)
        console.log("Data: ", data)

        return next();
    } catch (error) {
        console.log("Unable to verify token", error)
        return res.sendStatus(403);
    }
}

router.post('/login', (req, res) => {
    res.status(200).json({message: "Still working on login, but this works"})

})

router.post('/logout', authorization, (req, res) => {
    res.status(200).json({message: "Still working on login, but this works"})

})


router.get('/getFavourites', authorization, (req, res) => {
    console.log("Authenticated and authorized")
    console.log("Send this user to mongodb and get the daters: ", req.body)
    // check jwt for username
    // use the username to go to mongodb and get the favourite players
    res.status(200).json({message: "Debugging /getFavourites - Authentication successful"})

})

// getting data from JWT
router.post('/protected', authorization, (req, res) => {
    return res.json({user: req.username})
})

module.exports = router;
