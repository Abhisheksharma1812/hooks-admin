import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import { isTokenExpired } from './utils/token';

import Dashboard from "./pages/Dashboard";
import Users from "./pages/User/Users";
import DatingUsers from "./pages/User/DatingUsers";
import UserDetail from "./pages/User/UserDetail";
import Events from "./pages/Event/Events";
import EventDetail from "./pages/Event/EventDetail";
import Services from "./pages/Service/Services";
import ServiceDetail from "./pages/Service/ServiceDetail";
import Sales from "./pages/Sale/Sales";
import SaleDetail from "./pages/Sale/SaleDetail";
import Settings from "./pages/Setting/Settings";
import Boosts from "./pages/Boost/Boosts";
import Datings from "./pages/Dating/Datings";

import Login from "./pages/Auth/Login";
import ResetPassword from "./pages/Auth/ResetPassword";
import NotFound from "./pages/PageNotFound";
import Security from "./pages/Setting/Security";


const RequireAuth = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("Auth-Token");


  if (!isAuthenticated || isTokenExpired(localStorage.getItem("Auth-Token"))) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicOnlyRoute = () => {
  const isAuthenticated = !!localStorage.getItem("Auth-Token");

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Layout */}

        <Route element={<AuthLayout />}>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />{" "}
            {/* Login page only visible to unauthenticated users */}
          </Route>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* Main Layout (Protected Routes) */}
        <Route
          element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="users">
            <Route path="all" element={<Users />} />
            <Route path="dating" element={<DatingUsers />} />
          </Route>
          <Route path="/user/:id" element={<UserDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/sale/:id" element={<SaleDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/security" element={<Security />} />
          <Route path="/boots" element={<Boosts />} />
          <Route path="/datings" element={<Datings />} />
        </Route>

        {/* Catch-All Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
