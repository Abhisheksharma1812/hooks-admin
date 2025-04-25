import React, { useState } from "react";
import { Nav, Accordion } from "react-bootstrap";
import {
  FaTachometerAlt,
  FaUsers,
  FaTrophy,
  FaPowerOff,
  FaUsersCog,
  FaCogs,
  FaMoneyCheck,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ showSidebar, setShowSidebar }) => {
  const location = useLocation().pathname;
  const isServicePage = location.includes("/service");
  const isSalePage = location.includes("/sale");
  const isEventPage = location.includes("/event");
  const isUserPage = location.includes("/user");
  const isBoostPage = location.includes("/boost");
  const isDatingsPage = location.includes("/dating");
  const navigate = useNavigate();

  //alert(location);
  const sidebarStyle = {
    backgroundColor: "#072139",
    height: "100vh",
    color: "white",
    paddingTop: "20px",
    fontSize: "16px",
    fontWeight: "500",
    // boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
  };

  const linkStyle = {
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "white",
    borderRadius: "4px",
    marginBottom: "8px",
    // transition: "background-color 0.3s ease",
    width: "300px",
  };

  const linkHoverStyle = {
    backgroundColor: "#0056b3",
    cursor: "pointer",
  };

  const submenuLinkStyle = {
    padding: "8px 40px",
    color: "white",
    textDecoration: "none",
    fontSize: "14px",
    transition: "color 0.3s ease",
  };

  const [isLoggedin, setIsLoggedin] = useState(false);

  const logout = () => {
    localStorage.removeItem("token-info");
    localStorage.removeItem("Auth-Token");
    setIsLoggedin(false);
    navigate("/login");
  };

  return (
    <div
      className={`sidebar ${showSidebar ? "visible" : "hidden"}`}
      style={{
        width: showSidebar ? "100%" : "0",
        transition: "width 0.1s ease",
        overflowX: "hidden",
        backgroundColor: "rgb(7, 33, 57)",
        color: "#fff",
        height: "100%",
      }}
    >
      <div style={sidebarStyle}>
        <Nav className="flex-column">
          <Nav.Link
            className={`text-white ${location === "/" ? "current-tab" : ""}`}
            as={Link}
            to="/"
            style={linkStyle}
          >
            <FaTachometerAlt className="me-3" />
            Dashboard
          </Nav.Link>

          <Accordion className="text-white">
            <Accordion.Item
              eventKey="0"
              style={{ backgroundColor: "rgb(7, 33, 57)", border: "none" }}
            >
              <Accordion.Header>
                <FaUsers className="me-3" />
                Users
              </Accordion.Header>
              <Accordion.Body>
                <Nav.Link
                  className={`text-white ${
                    location === "/users/all" ? "current-tab" : ""
                  }`}
                  as={Link}
                  to="/users/all"s
                  style={submenuLinkStyle}
                >
                  All Users
                </Nav.Link>
                <Nav.Link
                  className={`text-white ${
                    location === "/users/dating" ? "current-tab" : ""
                  }`}
                  as={Link}
                  to="/users/dating"
                  style={submenuLinkStyle}
                >
                  Dating
                </Nav.Link>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Nav.Link
            className={`text-white ${
              location === "/events" || isEventPage ? "current-tab" : ""
            }`}
            as={Link}
            to="/events"
            style={linkStyle}
          >
            <FaTrophy className="me-3" />
            Events
          </Nav.Link>

          <Nav.Link
            className={`text-white ${
              location === "/services" || isServicePage ? "current-tab" : ""
            }`}
            as={Link}
            to="/services"
            style={linkStyle}
          >
            <FaUsersCog className="me-3" />
            Services
          </Nav.Link>

          <Nav.Link
            className={`text-white ${
              location === "/sales" || isSalePage ? "current-tab" : ""
            }`}
            as={Link}
            to="/sales"
            style={linkStyle}
          >
            <FaUsersCog className="me-3" />
            Sales
          </Nav.Link>

          <Nav.Link
            className={`text-white ${
              location === "/datings" || isDatingsPage ? "current-tab" : ""
            }`}
            as={Link}
            to="/datings"
            style={linkStyle}
          >
            <FaUsersCog className="me-3" />
            Datings
          </Nav.Link>

          <Accordion className="text-white">
            <Accordion.Item
              eventKey="0"
              style={{ backgroundColor: "rgb(7, 33, 57)", border: "none" }}
            >
              <Accordion.Header>
                <FaCogs className="me-3" />
                Settings
              </Accordion.Header>
              <Accordion.Body>
                <Nav.Link
                  className={`text-white ${
                    location === "/settings" ? "current-tab" : ""
                  }`}
                  as={Link}
                  to="/settings"
                  style={submenuLinkStyle}
                >
                  Settings
                </Nav.Link>
                <Nav.Link
                  className={`text-white ${
                    location === "/security" ? "current-tab" : ""
                  }`}
                  as={Link}
                  to="/security"
                  style={submenuLinkStyle}
                >
                  Security
                </Nav.Link>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Nav.Link href="#" onClickCapture={logout} style={linkStyle}>
            <FaPowerOff className="me-3" />
            Logout
          </Nav.Link>
        </Nav>

        <style>{`
        .custom-accordion .accordion-header {
          background-color: transparent !important;
          color: white !important;
          border: none;
          position: relative;
        }

        .custom-accordion .accordion-header::after {
          content: "▼";
          position: absolute;
          right: 15px;
          color: white;
        }

        .scrollable-dropdown {
          max-height: 150px;
          overflow-y: auto;
          background-color: rgb(7, 33, 57);
          border-left: 2px solid white;
          padding-left: 20px;
        }

        .submenu-link {
          color: white !important;
          font-size: 14px;
          display: block;
          padding: 8px 10px;
          transition: background 0.3s;
        }

        .submenu-link:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
      </div>
    </div>
  );
};

export default Sidebar;
