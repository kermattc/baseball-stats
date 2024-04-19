// import React, { useState } from 'react';

// import {
//   CDBSidebar,
//   CDBSidebarContent,
//   CDBSidebarFooter,
//   CDBSidebarHeader,
//   CDBSidebarMenu,
// } from 'cdbreact';

// const old-Sidebar = () => {

//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

//   const toggleSidebar = () => {
//     event.preventDefault();
//     console.log("sidebar toggled")
//     setIsSidebarCollapsed(!isSidebarCollapsed);
//   }

//   return (
//     <CDBSidebar style={{ minHeight: '100vh'}} textColor="#fff" backgroundColor="#333">
//       {/* prefix={<i className="fa fa-bars fa-large"></i> } */}
//       <CDBSidebarHeader prefix={<i onClick={toggleSidebar} className="fa fa-bars fa-large"></i> }>
//         <a className="text-decoration-none" style={{ color: 'inherit' }}>
//           Login
//         </a>
//       </CDBSidebarHeader>

//       <CDBSidebarContent className="sidebar-content">
//         <CDBSidebarMenu>
//           {isSidebarCollapsed ?             
//             <form> 
//             <label>Username</label><br/>
//             <input type="text" name="name"/><br/>
//             <label>Password</label><br/>
//             <input type="text" id="password" name="password"/><br/>
//             <input type="submit" value="Login"/>
//             </form> 
//           : null}

//         </CDBSidebarMenu>
//       </CDBSidebarContent>

//       <CDBSidebarFooter style={{ textAlign: 'center' }}>
//         <div
//           style={{
//             padding: '20px 5px',
//           }}
//         >
//           Yeehaw I'm a footer
//         </div>
//       </CDBSidebarFooter>
//     </CDBSidebar>
//   );
// };

// export default old-Sidebar;
