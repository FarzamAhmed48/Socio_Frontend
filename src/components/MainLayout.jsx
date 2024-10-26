import React from "react";
import Profile from "./Profile";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";

const MainLayout = () => {
  return (
    <div className="grid grid-cols-4">
      <div>
        <LeftSidebar />
      </div>
      <div className="md:col-span-2 col-span-4">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
