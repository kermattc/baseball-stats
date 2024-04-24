import React, { useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';


const Sidebar = () => {
    // get the current page pathname
    const location = useLocation();

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const toggleSidebar = () => {
    //   console.log("sidebar toggled")
      setIsSidebarCollapsed(!isSidebarCollapsed);      
    }

    const loginUser = () => {
        event.preventDefault();
        // verify user exists in database
        console.log("TODO: Implement login in backend. Username: ", username, " password: ", password);

        axios.post('/jwt/getJWT', {
            username: username
        }).then(response => {
            response.json({message: "JWT created!", response})
            // console.log("Response: ", response)
        })
        .catch(error => {
            console.log("Error: ", error, res);
        });
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
                    <Link to="/favourites" className={`nav-link ${location.pathane === '/favourites' ? 'disabled': ''}`}>Favourites</Link>

                    <h2 className="login-title">Login</h2>
                    <div className='login-container'>
                        <form>
                            <label>Username</label><br/>
                            <input type="text" name="name" value={username} onChange={(e) => setUsername(e.target.value)}/><br/>
                            <label>Password</label><br/>
                            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/><br/>
                            <br/>
                            <input type="submit" value="Login" onClick={() => loginUser()}/>
                        </form>
                    </div>


                    <Link to="/register" className='nav-link'>Register</Link>
                </div>
            </nav>
        </>
    )
}

export default Sidebar;