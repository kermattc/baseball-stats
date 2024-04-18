import React from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';

const Sidebar = () => {
  return (
    // <div style={{ minHeight: '100vh' }}>
      <CDBSidebar style={{ minHeight: '100vh'}} textColor="#fff" backgroundColor="#333">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a className="text-decoration-none" style={{ color: 'inherit' }}>
            Login
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <form> 
              <label>Username</label><br/>
              <input type="text" name="name"/><br/>
              <label>Password</label><br/>
              <input type="text" id="password" name="password"/><br/>
              <input type="submit" value="Login"/>
            </form>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: 'center' }}>
          <div
            style={{
              padding: '20px 5px',
            }}
          >
            Sidebar Footer
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
    // </div>
  );
};

export default Sidebar;
