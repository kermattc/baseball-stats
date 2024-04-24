import React, { useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';


const Sidebar = () => {
    // get the current page pathname
    const location = useLocation();

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    
    const [userOrEmail, setUserOrEmail] = useState('');
    const [password, setPassword] = useState('');

    const toggleSidebar = () => {
    //   console.log("sidebar toggled")
      setIsSidebarCollapsed(!isSidebarCollapsed);      
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
                    userOrEmail: userOrEmail
                })
                .then(response => {
                    response.json({message: "JWT created!", response})
                    // console.log("Response: ", response)
                })
                .catch(error => {
                    console.log("Error: ", error, res);
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
                </div>
            </nav>
        </>
    )
}

export default Sidebar;