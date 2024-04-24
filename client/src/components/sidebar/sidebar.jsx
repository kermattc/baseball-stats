import { toggleLogin, updateUsername } from '../../store/reducers/loginStatus.js'

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';


const Sidebar = () => {
    const dispatch = useDispatch();
    const loggedIn = useSelector((state) => state.login.loggedIn);
    const usernameOrEmail = useSelector((state) => state.login.username);

    // get the current page pathname
    const location = useLocation();

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    
    const [userOrEmail, setUserOrEmail] = useState('');
    const [password, setPassword] = useState('');

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
    const loginUser = () => {
        event.preventDefault();
        // verify user exists in database
        console.log("TODO: Implement login in backend. Username: ", userOrEmail, " password: ", password);

        axios.post('/user/login',  {
            userOrEmail: userOrEmail,
            password: password
        })
        .then(response => {
            if (response.data.status === 'SUCCESS') {
                console.log("User exists in database. Generating JWT")
                axios.post('/jwt/getJWT', {
                    username: userOrEmail
                })
                .then(response => {
                    console.log("Login successful. JWT created ")
                    const jwt = response.access_token;
                    localStorage.setItem('jwt: ', jwt);

                    setUserOrEmail(userOrEmail)

                    handleLogin();
                    updateUserOrEmail(userOrEmail)
                })
                .catch(error => {
                    console.log("Error: ", error, response);
                });
            } else if (response.data.status === 'FAILED') {
                console.log("Login failed. Response: ", response.data.message)
            }
        }).catch (error => {
            console.log("Error: ", error)
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
                                <input type="submit" value="Login" onClick={() => loginUser()}/>
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