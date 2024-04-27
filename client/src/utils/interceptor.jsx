import axios from 'axios';
import { jwtDecode } from "jwt-decode";


// refresh access token
export const refreshToken = async() => {
    try {
        await axios.post("/user/refresh", {
            username: usernameOrEmail
        })
        .then(response => {
            const accessToken = response.data.access_token;
            localStorage.setItem('access_token', accessToken);
        })
        .catch(error => {
            console.log("Error - can't refresh access token ", error)
            handleLogin(false)
        })
    } catch (error) {
        console.log("Unable to refresh token: ", error)
        handleLogin(false)
    }
}

// interceptor for refreshing token
export const setupInterceptors = () => {
    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(
        async (config) => {
            console.log("config: ", config)
            if (config.url ==='/user/login') {  // skip login
                return config;
            }
            // check for expired access token and refresh if it is expired
            let currentDate = new Date();
            const decodedToken = jwtDecode(localStorage.getItem('jwt'));
            if (decodedToken.exp * 1000 < currentDate.getTime()) {
                await refreshToken();
            }
            return config;
        }
    )
}