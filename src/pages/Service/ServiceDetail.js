import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Card,
  Row,
  Col,
  Spinner,
  Image,
  Table,
  Carousel,
} from "react-bootstrap";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import "alertifyjs/build/css/alertify.css";
import moment from "moment";

const BaseUrl = process.env.REACT_APP_API_URL;

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [boots, setBoots] = useState(null);

  const fetchService = useCallback(async () => {
    try {
      const response = await axios.get(`${BaseUrl}/service/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Auth-Token")}`,
        },
      });
      setService(response.data.service);
      setBoots(response?.data?.service?.boost);
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
      <h2>
        Service Detail
        <Button
          variant="primary"
          className="float-end"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </h2>
      {loading ? (
        <Spinner animation="border" />
      ) : service ? (
        <>
          <Card className="shadow-lg p-4">
            <Row>
              <Col md={4} className="text-center">
                <Carousel>
                  {service.photo?.map((photo, index) => (
                    <Carousel.Item key={index}>
                      <Image
                        className="d-block w-100"
                        src={photo.url}
                        alt={`Slide ${index + 1}`}
                        style={{ height: "300px", objectFit: "cover" }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </Col>
              <Col md={8}>
                <h3>
                  {service.title}
                  <span className="float-end">
                    <FaHeart />
                    {service?.likes?.length}
                  </span>
                </h3>
                <p>
                  <strong>Category:</strong> {service.category?.name}
                </p>
                <p>
                  <strong>Phone:</strong> {service.phone}
                </p>
                <p>
                  <strong>Email:</strong> {service.email}
                </p>
                <p>
                  <strong>Address:</strong> {service.address},{" "}
                  {service.city_state}, {service.zipcode}
                </p>
                <p>
                  <strong>Description:</strong> {service.description}
                </p>
                <hr />
                <h5>Provider Information:</h5>
                <Row className="align-items-center">
                  <Col md={2}>
                    <Image
                      src={
                        service.user_id?.avatar?.[0]?.url ||
                        "https://via.placeholder.com/50"
                      }
                      width="50"
                      height="50"
                      className="rounded-circle"
                    />
                  </Col>
                  <Col md={8}>
                    <p>
                      <strong>
                        {service.user_id?.firstname} {service.user_id?.lastname}
                      </strong>
                    </p>
                    <p>{service.user_id?.email}</p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>

          <Card className="shadow-lg p-4 mt-4">
            <Row>
              <Col md={12} className="text-center">
                <h5>Boots</h5>
                <Table bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Plan</th>
                      <th>Price</th>
                      <th>Transaction ID</th>
                      <th>Valid From</th>
                      <th>Valid To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boots.length > 0 ? (
                      boots.map((boost, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{boost?.boostType}</td>
                          <td>${boost?.price}</td>
                          <td>{boost?.transactionId}</td>
                          <td>
                            {moment(boost?.createdAt).format(
                              "MMMM D, YYYY h:mm A"
                            )}
                          </td>
                          <td>
                            {moment(boost?.validTo).format(
                              "MMMM D, YYYY h:mm A"
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6}>No boost.</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Card>
        </>
      ) : (
        <p>Service not found.</p>
      )}
    </Container>
  );
};

export default ServiceDetail;
