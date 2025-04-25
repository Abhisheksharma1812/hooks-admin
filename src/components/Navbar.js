import React, { useState } from "react";
import { Navbar, Container, Button } from "react-bootstrap";

const CustomNavbar = ({ toggleSidebar }) => {
  return (
    <Navbar
      bg="bg-body-tertiary"
      expand="lg"
      style={{ boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)" }}
    >
      <Container fluid>
        <Button variant="light" onClick={toggleSidebar} className="me-2">
          ☰
        </Button>
        <Navbar.Brand href="#">Admin Dashboard</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
