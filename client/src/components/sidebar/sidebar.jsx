import { toggleLogin, updateUsername } from '../../store/reducers/loginStatus.js'

import React, { useState, useEffect } from 'react';
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
    
    const [userOrEmail, setUserOrEmail] = useState('');
    const [password, setPassword] = useState('');


    const refreshToken = async() => {
        try {
            await axios.post("/user/refresh", {
                username: usernameOrEmail
            })
            .then(response => {
                // console.log("Refreshed access token. Response: ", response)
                // console.log("New access token: ", response.data.access_token)
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
            let currentDate = new Date();
            const decodedToken = jwtDecode(localStorage.getItem('jwt'));
            if (decodedToken.exp * 1000 < currentDate.getTime()) {
                refreshToken();
            }
        }
    )

    useEffect(() => {
        refreshToken();
    }, [])


    const handleLogin = () => {
        dispatch(toggleLogin());
    }

    const toggleSidebar = () => {
    //   console.log("sidebar toggled")
      setIsSidebarCollapsed(!isSidebarCollapsed);      
    }

    const updateUserOrEmail = (userOrEmail) => {
        dispatch(updateUsername(userOrEmail))
    }
    
    const loginUser = (event) => {
        event.preventDefault();
        // verify user exists in database
        // console.log("TODO: Implement login in backend. Username: ", userOrEmail, " password: ", password);

        axios.post('/user/login',  {
            userOrEmail: userOrEmail,
            password: password
        })
        .then(response => {
            if (response.data.status === 'SUCCESS') {
                console.log("User exists in database. Generating JWT")
                axios.post('/user/getJWT', {
                    username: userOrEmail
                })
                .then(response => {
                    console.log("Login successful. JWT created ", response)
                    const accessToken = response.access_token;
                    localStorage.setItem('access_token', accessToken);

                    setUserOrEmail(userOrEmail)

                    handleLogin();
                    updateUserOrEmail(userOrEmail)
                    window.location.reload();
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

    const onLogout = (event) => {
        event.preventDefault();

        const token = localStorage.getItem('access_token');

        axios.post('/user/logout', {
            userOrEmail: userOrEmail
        }, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status === 200) {
                handleLogin();
                window.location.reload();
                console.log("Logout successful")
            } else {
                console.log("Logout failed. Response: ", response);
                console.log("response status: ", response.status)
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

// const verifyToken = (token) => { console.log(jwt_decode(token)); };
// export default { Sidebar, verifyToken };
export default Sidebar;