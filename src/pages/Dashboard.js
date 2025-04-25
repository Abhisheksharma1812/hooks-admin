import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FaUsers, FaShoppingCart, FaDollarSign } from "react-icons/fa";
import axios from "axios";

const DashboardContent = () => {
  // State for storing user count and other data
  const [userCount, setUserCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);

  // Fetch data from API when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/all`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("Auth-Token")}`,
            },
          }
        );

        // Set the user count dynamically
        setUserCount(userResponse.data.users.length);

        const eventsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/event/all`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("Auth-Token")}`,
            },
          }
        );

        setEventCount(eventsResponse.data.events.length); // Set event count
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this will run on mount only

  // Cards data with dynamic values
  const cards = [
    {
      title: "Total Users",
      value: userCount, // Dynamic value
      icon: <FaUsers size={30} style={{ color: "#003f88" }} />,
      color: "#e3f2fd",
    },
    {
      title: "Total Events",
      value: eventCount, // Dynamic value
      icon: <FaShoppingCart size={30} style={{ color: "#003f88" }} />,
      color: "#bbdefb",
    },
    {
      title: "Total Revenue",
      value: "0", // Dynamic value
      icon: <FaDollarSign size={30} style={{ color: "#003f88" }} />,
      color: "#90caf9",
    },
  ];

  return (
    <div>
      <h2 className="mb-4" style={{ color: "#003f88" }}>
        Dashboard Overview
      </h2>
      <Row>
        {cards.map((card, index) => (
          <Col md={4} className="mb-4" key={index}>
            <Card
              style={{
                borderLeft: `5px solid ${card.color}`,
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Card.Body className="d-flex align-items-center">
                <div className="me-3">{card.icon}</div>
                <div>
                  <Card.Title>{card.title}</Card.Title>
                  <Card.Text style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    {card.value}
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DashboardContent;
