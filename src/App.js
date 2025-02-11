import React, { useEffect,useState } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/User/Users";
import  UserDetail from "./pages/User/UserDetail";
import Events from "./pages/Event/Events";
import EventDetail from "./pages/Event/EventDetail";
import Services from "./pages/Service/Services";
import ServiceDetail from "./pages/Service/ServiceDetail";
import Settings from "./pages/Settings";
import Login from './pages/Auth/Login';

const App = () => {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
};

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("Auth-Token");

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== "/login") {
      navigate("/login");
    }
   if (isAuthenticated && location.pathname === "/login") {
      navigate("/");
    }
   }, [isAuthenticated, location.pathname, navigate]);

   const isLoginPage = location.pathname === "/login";
   const isNotFoundPage = location.pathname === "*";
   const [showSidebar, setShowSidebar] = useState(true);

   const toggleSidebar = () => setShowSidebar((prev) => !prev);

  return (
 
    <div className="full-page">

      {isLoginPage  || isNotFoundPage ? "" : <div className="side-bar"><Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar}  /></div> }
     
       <div className="body-content">
       {isLoginPage || isNotFoundPage ? "" :<Navbar toggleSidebar={toggleSidebar}  /> }
   
   <div className="body-containerAll">
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/user/:id" element={<UserDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/service/:id" element={<ServiceDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          </div>
       </div>
     </div>



//     <div style={{ backgroundColor: "#f8f9fa", height: "100vh" }}>
// {isLoginPage || isNotFoundPage ? "" :<Navbar /> }
//     <Container fluid>
//       <Row>
//         <Col xs={2} className="p-0">
//         {isLoginPage  || isNotFoundPage ? "" : <div className="side-bar"><Sidebar /></div> }
//         </Col>
//         <Col xs={10} className="p-4">
//         <Routes>
//             <Route path="/login" element={<Login />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/users" element={<Users />} />
//             <Route path="/settings" element={<Settings />} />
//           </Routes>
//         </Col>
//       </Row>
//     </Container>
//   </div>

  );
};

export default App;
