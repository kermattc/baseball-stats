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

    if (!refreshToken) {
        return res.status(401).send('Access denied. No refresh token provided')
    }

    // verify access token
    try {
        const decoded = jwt.verify(accessToken, process.env.VITE_JWT_SECRET_ACCESS)

        req.username = decoded.username;
        next();
    } catch (error) {
        // check that the refresh token exists, then verify it
        try {
            if (!refreshTokens.includes(refreshToken)) {
                return res.status(400).json({message: "Refresh token invalid"})
            }
            console.log("MAde it here 4")

            const decoded = jwt.verify(refreshToken, process.env.VITE_JWT_SECRET_REFRESH)
            req.username = decoded.username; // attach username to req body. might delete this later

            console.log("Refresh token validated. Username: ", req.username)
            next();

            } catch (error) {
                return res.status(400).send('Refresh token expired')
            }
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
        {expiresIn: '15s'}
    );

    const refreshToken = jwt.sign(
        data,
        jwtSecretRefresh,
        {expiresIn: '1h'}
    );

    // append to list of refresh tokens
    refreshTokens.push(refreshToken)

    console.log("Refresh tokens at creation: ", refreshTokens)

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
                        password: hashedPassword,
                        favPlayers: []
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

// get the user's favourite baseball players and send them back as a list
router.get('/getFavourites', authorization, (req, res) => {
    console.log("Refresh tokens still here? ", refreshTokens)
    console.log("Send this user to mongodb and get the daters: ", req.username)

    // res.status(200).json({username: req.username})
    User.find({
        username: req.username
    })
    .then ( data => {
        const user = data[0]
        console.log("data: ", data)
        console.log("fav players? ", user.favPlayers)
        res
            .status(200)
            .json({
                status: "SUCCESS",
                favPlayers: user.favPlayers,
                username: req.username
            }
        )
    })
    .catch(err => {
        console.log("Err: ", err)
        res.status(500).json({ status: "FAILED", message: "Internal server error" });
    });
})

// get a player name and add it to the list of the user's favourite players in the db
router.post('/addFavourite', authorization, (req, res) => {
    const username = req.username
    const favPlayer = req.body.favPlayer
    console.log("Add this player to favourites: ", favPlayer)

    User.find({
        username: username
    })
    .then ( data => {
        const user = data[0]

        User.updateOne(
            { _id: user._id},
            { $push: {favPlayers: favPlayer}}
        )
        .then(res.status(200).json({status: "SUCCESS", message: "Added player to favourites"}))
        .catch( error =>{
            console.log("error: ", error)
            res.status(500).json({status: "FAILIED", message: "Encountered error while adding player to favourites."})
        })
    })
})

// get a player name and remove it from the user's list of favourite players in the db
router.post('/removeFavourite', authorization, (req, res) => {
    const username = req.username
    const player = req.body.player
    console.log("Remove this player from favourites: ", player)

    User.find({
        username: username
    })
    .then ( data => {
        const user = data[0]

        User.updateOne(
            { _id: user._id},
            { $pull: {favPlayers: player}}
        )
        .then(res.status(200).json({status: "SUCCESS", message: "Removed player from favourites"}))
        .catch( error => {
            console.log("error: ", error)
            res.status(500).json({status: "FAILIED", message: "Encountered error while removing player from favourites."})
        })
    })
})

// refresh the access token if the refresh token is still valid
router.post('/refresh', (req, res) => {
    console.log("Made it to refresh")
    const refreshToken = req.cookies.refresh_token;
    const username = req.body.username;

    // error if refresh token expired or is not valid
    if (!refreshToken) {
        console.log("no refresh token")
        return res.status(401).json("Refresh token expired")
    }
    if (!refreshTokens.includes(refreshToken)) {
        console.log("Refresh token not valid")
        return res.status(403).json("Refresh token is not valid");
    }

    console.log(jwt.verify(refreshToken, process.env.VITE_JWT_SECRET_REFRESH))
  
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
            {expiresIn: '15s'}
        )
        
        // create new refresh token for more security
        const newRefreshToken = jwt.sign(
            data,
            process.env.VITE_JWT_SECRET_REFRESH,
            {expiresIn: '1h'}
        );

        refreshTokens.push(newRefreshToken) // update existing valid refresh tokens

        console.log("Finished refreshing. New refresh tokens list: ", refreshTokens)
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