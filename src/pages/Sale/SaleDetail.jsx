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

const SaleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [boots, setBoots] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSale = useCallback(async () => {
    try {
      const response = await axios.get(`${BaseUrl}/sale/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Auth-Token")}`,
        },
      });
      setSale(response.data.sale);
      setBoots(response?.data?.sale?.boost);
    } catch (error) {
      console.error("Error fetching sale:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSale();
  }, [fetchSale]);

  return (
    <Container className="py-4">
      <h2>
        Sale Detail
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
      ) : sale ? (
        <>
          <Card className="shadow-lg p-4">
            <Row>
              <Col md={4} className="text-center">
                <Carousel>
                  {sale.photo?.map((photo, index) => (
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
                  {sale.title}
                  <span className="float-end">
                    <FaHeart />
                    {sale?.likes?.length}
                  </span>
                </h3>
                <p>
                  <strong>Category:</strong> {sale.category?.name}
                </p>
                <p>
                  <strong>Price:</strong> ${sale?.price}
                </p>
                <p>
                  <strong>Phone:</strong> {sale?.phone}
                </p>
                <p>
                  <strong>Email:</strong> {sale?.email}
                </p>
                <p>
                  <strong>Address:</strong> {sale?.address}, {sale?.city_state},{" "}
                  {sale?.zipcode}
                </p>
                <p>
                  <strong>Description:</strong> {sale?.description}
                </p>
                <hr />
                <h5>Provider Information:</h5>
                <Row className="align-items-center">
                  <Col md={2}>
                    <Image
                      src={
                        sale.user_id?.avatar?.[0]?.url ||
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
                        {sale.user_id?.firstname} {sale.user_id?.lastname}
                      </strong>
                    </p>
                    <p>{sale.user_id?.email}</p>
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
        <p>Sale not found.</p>
      )}
    </Container>
  );
};

export default SaleDetail;
