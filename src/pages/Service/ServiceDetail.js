import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Card, Row, Col, Spinner, Image } from "react-bootstrap";
import axios from "axios";
import "alertifyjs/build/css/alertify.css";

const BaseUrl = process.env.REACT_APP_API_URL;

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchService = useCallback(async () => {
    try {
      const response = await axios.get(`${BaseUrl}/service/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("Auth-Token")}` },
      });
      setService(response.data.service);
    } catch (error) {
      console.error("Error fetching service:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  return (
    <Container className="py-4">
      <h2>Service Detail</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : service ? (
        <Card className="shadow-lg p-4">
          <Row>
            <Col md={4} className="text-center">
              <Image
                src={service.photo?.[0]?.url || "https://via.placeholder.com/200"}
                alt={service.title}
                width="200"
                height="200"
                className="border p-1 rounded"
              />
            </Col>
            <Col md={8}>
              <h3>{service.title}</h3>
              <p><strong>Category:</strong> {service.category?.name}</p>
              <p><strong>Phone:</strong> {service.phone}</p>
              <p><strong>Email:</strong> {service.email}</p>
              <p><strong>Address:</strong> {service.address}, {service.city_state}, {service.zipcode}</p>
              <p><strong>Description:</strong> {service.description}</p>
              <hr />
              <h5>Provider Information:</h5>
              <Row className="align-items-center">
                <Col md={2}>
                  <Image
                    src={service.user_id?.avatar?.[0]?.url || "https://via.placeholder.com/50"}
                    width="50"
                    height="50"
                    className="rounded-circle"
                  />
                </Col>
                <Col md={8}>
                  <p><strong>{service.user_id?.firstname} {service.user_id?.lastname}</strong></p>
                  <p>{service.user_id?.email}</p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      ) : (
        <p>Service not found.</p>
      )}
    </Container>
  );
};

export default ServiceDetail;
