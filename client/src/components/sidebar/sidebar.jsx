import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';


const Sidebar = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
      console.log("sidebar toggled")
      setIsSidebarCollapsed(!isSidebarCollapsed);
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

                    <h2 className="login-title">Login</h2>
                    <div className='login-container'>
                        <form>
                            <label>Username</label><br/>
                            <input type="text" name="name"/><br/>
                            <label>Password</label><br/>
                            <input type="text" id="password" name="password"/><br/>
                            <br/>
                            <input type="submit" value="Login"/>
                        </form>
                    </div>

                    <Link to="/register">Register</Link>
                </div>
            </nav>
        </>
    )
}

export default Sidebar;