const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

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
        {expiresIn: '10m'} // 10 minutes
    );

    const refreshToken = jwt.sign(
        data,
        jwtSecretRefresh,
        {expiresIn: '1d'}
    );

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

router.post('/refresh', (req, res) => {
    console.log()
    console.log("Request cookie: ", req.cookies?.refresh_token)

    if (req.cookies?.refresh_token) {
        const refreshToken = req.cookies.refresh_token;

        // verify refresh token
        jwt.verify(refreshToken, process.env.VITE_JWT_SECRET_REFRESH,
            (err, decoded) => {
                if (err) {
                    // wrong token
                    res.status(406).json({message: 'Unauthorized'})
                } else {
                    data = {
                        username: req.body.username,
                        signTime: Date.now()
                    }
                    const accessToken = jwt.sign(
                        data,
                        process.env.VITE_JWT_SECRET_ACCESS,
                        {expiresIn: '10m'}
                    )
                    res
                        .status(200)
                        .header('access_token', accessToken)
                        .json({'message': 'Access token refreshed'})
                }
            }
        )
    }
})

module.exports = router;