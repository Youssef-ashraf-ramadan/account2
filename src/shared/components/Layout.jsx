import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import SideNav from "./SideNav";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(window.innerWidth >= 1200);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1200);
  const location = useLocation();

  const toggleSideNav = () => setIsSideNavOpen(prev => !prev);

  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth >= 1200;
      setIsLargeScreen(isLarge);
      setIsSideNavOpen(isLarge);
    };

    handleResize(); // Initial run
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const contentClass = isLargeScreen
    ? isSideNavOpen
      ? "with-sidenav"
      : "full-width"
    : "";

  const isHomePage = location.pathname === "/";
  const isPOSPage = location.pathname === "/pos";
  const homePageClass = isHomePage ? "homx-page" : "";
  const posPageClass = isPOSPage ? "pos-page" : "";

  return (
    <>
      {!isPOSPage && (
        <Navbar
          toggleSideNav={toggleSideNav}
          isSideNavOpen={isSideNavOpen}
          isLargeScreen={isLargeScreen}
        />
      )}
      {!isPOSPage && (
        <SideNav isOpen={isSideNavOpen} toggleSideNav={toggleSideNav} />
      )}
      {!isLargeScreen && isSideNavOpen && !isPOSPage && (
        <div 
          className="sidenav-overlay active" 
          onClick={toggleSideNav}
        />
      )}
      <div className={`content_wrapper ${contentClass} ${homePageClass} ${posPageClass}`}>
        {isPOSPage ? (
          <Outlet />
        ) : (
          <div className="container-fluid">
            <Outlet />
          </div>
        )}
      </div>

      <style jsx>{`
        .pos-page {
          padding: 0 !important;
          margin: 0 !important;
          min-height: 100vh !important;
        }
        
        .pos-page .content_wrapper {
          padding: 0 !important;
          margin: 0 !important;
        }
      `}</style>
    </>
  );
};

export default Layout;
