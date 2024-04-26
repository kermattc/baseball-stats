import { toggleLogin, updateUsername } from '../../store/reducers/loginStatus.js'

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

import { Link, useLocation } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';

const Sidebar = () => {
    const axiosJWT = axios.create();

    const dispatch = useDispatch();
    const loggedIn = useSelector((state) => state.login.loggedIn);
    const usernameOrEmail = useSelector((state) => state.login.username);

    // get the current page pathname
    const location = useLocation();

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    
    const [userOrEmail, setUserOrEmail] = useState(''); // not sure about this yet
    const [password, setPassword] = useState('');

    // refresh access token
    const refreshToken = async() => {
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
            })
        } catch (error) {
            console.log("Unable to refresh token: ", error)
        }
    }

    // interceptor for refreshing token
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
                refreshToken();
            }
        }
    )

    // toggle boolean from redux store
    const handleLogin = () => {
        dispatch(toggleLogin());
    }

    // updated after user successfully logs in
    const updateUserOrEmail = (userOrEmail) => {
        dispatch(updateUsername(userOrEmail))
    }
    
    // hide/unhide sidebar
    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);      
    }
    
    // perform login. If successful, get jwt's for access and refresh tokens
    const loginUser = (event) => {
        event.preventDefault();
        axios.post('/user/login',  {
            userOrEmail: userOrEmail,
            password: password
        })
        .then(response => {
            if (response.data.status === 'SUCCESS') {
                axios.post('/user/getJWT', {
                    username: userOrEmail
                })
                .then(response => {
                    const accessToken = response.data.access_token;
                    localStorage.setItem('access_token', accessToken);

                    setUserOrEmail(userOrEmail)

                    handleLogin();
                    updateUserOrEmail(userOrEmail)
                })
                .catch(error => {
                    console.log("Error: ", error, response);
                });
            } else {
                console.log("Login failed. Response: ", response.data.message)
            }
        }).catch (error => {
            console.log("Error: ", error)
        })
    }

    // log out user. Invalidates the refresh token the user logged in with
    const onLogout = (event) => {
        event.preventDefault();

        const token = localStorage.getItem('jwt');

        axios.post('/user/logout', {
            userOrEmail: userOrEmail
        }, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.data.status === 'SUCCESS') {
                console.log("Logout successful")
            } else {
                console.log("Logout failed. Response: ", response.data.message);
            }
        })
        .catch(error => {
            console.log("Error: ", error, response);
        })
    }

    return (
        <>
            <div className='navbar'>
                <Link to='#' className='menu-bars'>
                    <FaIcons.FaBars onClick={toggleSidebar}/>
                </Link>

            </div>

            <nav className={isSidebarCollapsed ? 'nav-menu active' : 'nav-menu' }>
                <div className='nav-menu-contents'>
                    
                    <Link to='#' className='menu-bars'>
                        <AiIcons.AiOutlineClose onClick={toggleSidebar}/>
                    </Link>


                    <Link to="/" className={`nav-link ${location.pathname === '/' ?  'disabled': ''}`}>Home</Link>
                    <br/>
                    <Link to="/favourites" className={`nav-link ${location.pathname === '/favourites' ? 'disabled': ''}`}>Favourites</Link>

                    {loggedIn ? 
                        <>
                            <h2>Hello {usernameOrEmail}!</h2>
                            <button onClick={onLogout}>Logout</button>
                        </> 
                    : 
                    <>
                        <h2 className="login-title">Login</h2>
                        <div className='login-container'>
                            <form>
                                <label>Username or Email</label><br/>
                                <input type="text" name="name" value={userOrEmail} onChange={(e) => setUserOrEmail(e.target.value)}/><br/>
                                <label>Password</label><br/>
                                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/><br/>
                                <br/>
                                <input type="submit" value="Login" onClick={(e) => loginUser(e)}/>
                            </form>
                        </div>
    
    
    
                        { location.pathname === '/register' ? null :     
                            <>
                                <h5>Don't have an account?</h5>
                                <Link to="/register" className={`nav-link ${location.pathname === '/register' ? 'disabled': ''}`}>Register</Link>
                            </> 
                        }
                    </>
                }
                </div>
            </nav>
        </>
    )
}

export default Sidebar;