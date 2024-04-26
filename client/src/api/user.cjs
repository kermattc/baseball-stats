const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');

// mongodb user model
const User = require('./../models/user.cjs')

let refreshTokens = []

// middleware to check for authorization. checks access and refresh token
const authorization = (req, res, next) => {
    const accessToken = req.headers.authorization.split(" ")[1];
    const refreshToken = req.cookies.refresh_token;

    if (!accessToken && !refreshToken) {
        return res.status(401).send('Access denied. No token provided')
    }

    // verify access token
    try {
        const decoded = jwt.verify(accessToken, process.env.VITE_JWT_SECRET_ACCESS)

    } catch (error) {
        return (res.status(401).send("Token expired"))
    }

    // check that the refresh token exists, then verify it
    try {
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(400).send("Invalid token")
        }
        const decoded = jwt.verify(refreshToken, process.env.VITE_JWT_SECRET_REFRESH)
        req.username = decoded.username; // attach username to req body. might delete this later

        next();

    } catch (error) {
        return res.status(400).send('Invalid token')
    }
}

// generates access and refresh token
router.post('/getJWT', (req, res) => {
    const jwtSecretAccess = process.env.VITE_JWT_SECRET_ACCESS;
    const jwtSecretRefresh = process.env.VITE_JWT_SECRET_REFRESH;

    const username = req.body.username;

    let data = {
        username: username,
        signInTime: Date.now()
    };

    const accessToken = jwt.sign(
        data, 
        jwtSecretAccess, 
        {expiresIn: '10m'}
    );

    const refreshToken = jwt.sign(
        data,
        jwtSecretRefresh,
        {expiresIn: '15m'}
    );

    // append to list of refresh tokens
    refreshTokens.push(refreshToken)

    // assign refresh token in http-opnly cookie. max age will be 1 hour
    res
        .status(200)
        .cookie("refresh_token", refreshToken, {
            httpOnly: true,
            sameSite: 'strict', 
            secure: true,
            maxAge: 3600 * 1000  // refresh token expires in 1 hour (maxAge is in milliseconds)
        })
        .json({'message': 'Generated refresh and access tokens', access_token: accessToken})
});


// get username/email/password, hash password and upload to db
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
                // create new user. Hash the password via bcrypt
                const saltRounds = parseInt(process.env.VITE_SALT_ROUNDS);
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new User ({
                        username,
                        email,
                        password: hashedPassword
                    })
                    // save if successful
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

// login user. checks username/email and password from db
// returns status 200 if successful back to frontend
router.post('/login', (req, res) => {
    let {userOrEmail, password} = req.body;

    // remove whitespace
    userOrEmail = userOrEmail.trim();
    password = password.trim();

    if (userOrEmail == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Empty credentials supplied"
        })
    } else {
        // check if user exists via username or email
        User.find({$or: [
            {email: userOrEmail},
            {username: userOrEmail}
        ]})
        .then( data => {
            console.log("Data: ", data)
            if (data.length > 0) {
                console.log("Found username/email on server. Proceeding to check password")

                // compare hashed password
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    console.log("result: ", result)
                    if (result){
                        res.json({
                            status: "SUCCESS",
                            message: "Validated credentials. Proceed to generate JWT",
                            data: data
                        })
                    } else {
                        res.json({
                            status: "FAILED",
                            message: "Invalid credentails"
                        })
                    }})
                    .catch (err => {
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
            .catch (err => {
                res.json({
                    status: "FAILED",
                    message: "An error occurred"
                })
            }
        )
    } 
})

// remove the refresh token from the list to 'invalidate' it
router.post('/logout', authorization, (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    res.status(200).json("Successfully logged out")
})

// wip - get user's favourite players from db, send to front end
router.get('/getFavourites', authorization, (req, res) => {
    console.log("Authenticated and authorized")
    console.log("Send this user to mongodb and get the daters: ", req.username)

    res.status(200).json({message: "Debugging /getFavourites - Authentication successful", username: req.username})

})

// refresh the access token if the refresh token is still valid
router.post('/refresh', (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    const username = req.body.username;

    // error if refresh token expired or is not valid
    if (!refreshToken) return res.status(401).json("Refresh token expired")
    if (!refreshTokens.includes(refreshToken)) {
        console.log("Refresh tokn not valid")
        return res.status(403).json("Refresh token is not valid");
    }
    
    // verify refresh token if it exists
    jwt.verify(refreshToken, process.env.VITE_JWT_SECRET_REFRESH, (err) => {
        err && console.log(err);

        // invalidate refresh token by removing it from the list
        refreshTokens = refreshTokens.filter(token => token !== refreshToken);
        
        let data = {
            username: username,
            signInTime: Date.now()
        };

        const newAccessToken = jwt.sign(
            data,
            process.env.VITE_JWT_SECRET_ACCESS,
            {expiresIn: '10m'}
        )
        
        // create new refresh token for more security
        const newRefreshToken = jwt.sign(
            data,
            process.env.VITE_JWT_SECRET_REFRESH,
            {expiresIn: '15m'}
        );

        refreshTokens.push(newRefreshToken) // update existing valid refresh tokens

        res
            .status(200)
            .cookie("refresh_token", newRefreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                secure: true,
                maxAge: 3600 * 1000
            })
            .json({
                access_token: newAccessToken,
            }
        )
    })
})

module.exports = router;