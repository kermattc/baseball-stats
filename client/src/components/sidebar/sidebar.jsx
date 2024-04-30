import { updateLogin, updateUsername } from '../../store/reducers/loginStatus.js'
import { setupInterceptors } from '../../utils/interceptor.jsx'

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { Link, useLocation } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sidebar = () => {

    const dispatch = useDispatch();
    const loggedIn = useSelector((state) => state.login.loggedIn);
    const usernameOrEmail = useSelector((state) => state.login.username);

    useEffect(() => {
        setupInterceptors(usernameOrEmail);
    }, [usernameOrEmail])
    
    // get the current page pathname
    const location = useLocation();

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    
    const [userOrEmail, setUserOrEmail] = useState(''); // not sure about this yet
    const [password, setPassword] = useState('');

    // toggle boolean from redux store
    const handleLogin = (loginStatus) => {
        dispatch(updateLogin(loginStatus));
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
                    handleLogin(true);
                    updateUserOrEmail(userOrEmail)

                    toast.success(`Login successful!`, {
                        position: "top-center",
                        hideProgressBar: true,
                        // closeOnClick: true,
                        theme: 'dark'
                    })
                })
                .catch(error => {
                    console.log("Error: ", error, response);
                    toast.error(`Something went wrong. Sorry!`, {
                        position: "top-center",
                        hideProgressBar: true,
                        // closeOnClick: true,
                        theme: 'dark'
                    })
                });
            } else {
                console.log("Login failed. Response: ", response.data.message)
                toast.error(`Invalid Credentials`, {
                    position: "top-center",
                    hideProgressBar: true,
                    // closeOnClick: true,
                    theme: 'dark'
                })
            }
        }).catch (error => {
            console.log("Error: ", error)
            toast.error(`Something went wrong. Sorry!`, {
                position: "top-center",
                hideProgressBar: true,
                // closeOnClick: true,
                theme: 'dark'
            })
        })
    }

    // log out user. Invalidates the refresh token the user logged in with
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
                toast.success(`Logout successful!`, {
                    position: "top-center",
                    hideProgressBar: true,
                    // closeOnClick: true,
                    theme: 'dark'
                })
                    // window.location.reload();
                handleLogin(false);

                 // console.log("Logout successful")
                
            } else {
                console.log("Logout failed. Response: ", response);
                console.log("response status: ", response.status)
                toast.error(`Something went wrong. Sorry!`, {
                    position: "top-center",
                    hideProgressBar: true,
                    closeOnClick: true,
                    theme: 'dark'
                })
            }
        })
        .catch(error => {
            console.log("Error: ", error);
            handleLogin(false);
            toast.error(`Something went wrong. Sorry!`, {
                position: "top-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: 'dark'
            })
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
            <ToastContainer/>
        </>
    )
}

export default Sidebar;