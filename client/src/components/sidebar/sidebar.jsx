import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';

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
                <form>
                    <label>Username</label><br/>
                    <input type="text" name="name"/><br/>
                    <label>Password</label><br/>
                    <input type="text" id="password" name="password"/><br/>
                    <input type="submit" value="Login"/>
                </form>
            </nav>
        </>
    )
}

export default Sidebar;