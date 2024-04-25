const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');

// mongodb user model
const User = require('./../models/user.cjs')

// middleware to check for cookie
const authorization = (req, res, next) => {
    // const accessToken = req.headers.authorization.split(' ')[1];
    const accessToken = req.headers.authorization.split(" ")[1];
    // console.log("This the access token? ", req.headers.authorization)
    const refreshToken = req.cookies.refresh_token;

    console.log("Access token: ", accessToken)
    console.log("Refresh token: ", refreshToken);

    if (!accessToken && !refreshToken) {
        return res.status(401).send('Access denied. No token provided')
    }

    // verify access token
    try {
        const decoded = jwt.verify(accessToken, process.env.VITE_JWT_SECRET_ACCESS)
        console.log("Decoded access token: ", decoded)

        // req.username = decoded.username;

    } catch (error) {
        console.log("Error: ", error)
        return (res.status(401).send("Token expired"))
    }

    // verify refresh token
    try {
        const decoded = jwt.verify(refreshToken, process.env.VITE_JWT_SECRET_REFRESH)
        req.username = decoded.username;
        // const accessToken = jwt.sign({username: decoded.username}, process.env.VITE_JWT_SECRET_REFRESH)

        next();

        // res
        //     .status(200)
        //     .cookie("refresh_token", refreshToken, {
        //         httpOnly: true,
        //         sameSite: 'strict', 
        //         secure: true,
        //         maxAge: 3600 * 1000  // refresh token expires in 1 hour (maxAge is in milliseconds)
        //     })
        //     .header('access_token', accessToken)
    } catch (error) {
        console.log("Error: ", error)
        return res.status(400).send('Invalid token')
    }
}

let refreshTokens = []

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
        // {expiresIn: '10m'} // 10 minutes
        {expiresIn: '10m'}
    );

    const refreshToken = jwt.sign(
        data,
        jwtSecretRefresh,
        {expiresIn: '15m'}
    );

    // append to list of tokens
    refreshTokens.push(refreshToken)

    console.log("refresh tokens: ", refreshTokens)
    // assign refresh token in http-opnly cookie. max age will be 1 hour
    res
        .status(200)
        // .header('Authorization', accessToken)
        .cookie("refresh_token", refreshToken, {
            httpOnly: true,
            sameSite: 'strict', 
            secure: true,
            maxAge: 3600 * 1000  // refresh token expires in 1 hour (maxAge is in milliseconds)
        })
        .json({'message': 'Generated refresh and access tokens', access_token: accessToken})
});


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

// remove the refresh token from the list
router.post('/logout', authorization, (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    // console.log("Refresh token check - should be empty i think: ", refreshTokens)
    // res.json({status: "FAILED", message: "Still working on logout, but this works"})
    res.status(200).json("Successfully logged out")
})

router.get('/getFavourites', authorization, (req, res) => {
    console.log("Authenticated and authorized")
    console.log("Send this user to mongodb and get the daters: ", req.username)
    // check jwt for username
    // use the username to go to mongodb and get the favourite players
    res.status(200).json({message: "Debugging /getFavourites - Authentication successful", username: req.username})

})

// getting data from JWT
router.post('/protected', authorization, (req, res) => {
    return res.json({user: req.username})
})

// refresh the access token if the refresh token is still valid
router.post('/refresh', (req, res) => {
    // console.log("Refresh tokens: ", refreshTokens)
    const refreshToken = req.cookies.refresh_token;
    const username = req.body.username;

    // error if refresh token expired or is not valid
    if (!refreshToken) return res.status(401).json("Refresh token expired")
    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json("Refresh token is not valid");
    }
    
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

        console.log("Created new access token: ", newAccessToken)
        // create new refresh token for more security
        const newRefreshToken = jwt.sign(
            data,
            process.env.VITE_JWT_SECRET_REFRESH,
            {expiresIn: '15m'}
        );

        refreshTokens.push(newRefreshToken)

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
    // refresh the access token if valid

})

module.exports = router;