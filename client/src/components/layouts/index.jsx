import React from 'react';
import Sidebar from '../sidebar/sidebar.jsx';
import '../../styles/main.css';

const Layout = ({ children }) => {
    return (
        <>
            <div className="sidebar-container">
                <Sidebar/>
            </div>
            <div className="main-content"> { children } </div>
        </>
    )
}

export default Layout;