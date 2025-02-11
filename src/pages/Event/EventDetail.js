import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Card, Row, Col, Spinner, Image } from "react-bootstrap";
import axios from "axios";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

const BaseUrl = process.env.REACT_APP_API_URL;

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = useCallback(async () => {
    try {
      const response = await axios.get(`${BaseUrl}/event/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("Auth-Token")}` },
      });

      setEvent(response.data.event);
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return (
    <Container className="py-4">
      <h2>Event Detail</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : event ? (
        <Card className="shadow-lg p-4">
          <Row>
            <Col md={4} className="text-center">
              <Image
                src={event.photo?.[0]?.url || "https://via.placeholder.com/200"}
                alt={event.name}
                width="200"
                height="200"
                className="border p-1 rounded"
              />
            </Col>
            <Col md={8}>
              <h3>{event.name}</h3>
              <p><strong>Date:</strong> {new Date(event.date).toDateString()}</p>
              <p><strong>Time:</strong> {event.time}</p>
              <p><strong>Location:</strong> {event.address}, {event.city_state}, {event.zipcode}</p>
              <p><strong>Description:</strong> {event.description}</p>
              <hr />
              <h5>Organized by:</h5>
              <Row className="align-items-center">
                <Col md={2}>
                  <Image
                    src={event.user_id?.avatar?.[0]?.url || "https://via.placeholder.com/50"}
                    width="50"
                    height="50"
                    className="rounded-circle"
                  />
                </Col>
                <Col md={8}>
                  <p><strong>{event.user_id?.firstname} {event.user_id?.lastname}</strong></p>
                  <p>{event.user_id?.email}</p>
                </Col>
              </Row>
              {/* <Button variant="primary" className="mt-3" onClick={() => navigate(-1)}>
                Go Back
              </Button> */}
            </Col>
          </Row>
        </Card>
      ) : (
        <p>Event not found.</p>
      )}
    </Container>
  );
};

export default EventDetail;
