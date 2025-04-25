import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  return (
    <div className="full-page">
      <div className="side-bar">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      </div>
      <div className="body-content">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="body-containerAll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;