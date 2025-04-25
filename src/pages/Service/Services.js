import React, { useState, useCallback, useEffect } from "react";
import { Pagination, Row, Col, Table, Form } from "react-bootstrap";
import axios from "axios";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { FaRegTrashAlt, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

function Services() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]); // For search functionality
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Search input state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [error, setError] = useState(null);
  const BaseUrl = process.env.REACT_APP_API_URL;

  // Fetch services from API
  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}/service/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Auth-Token")}`,
        },
      });
      setServices(response.data.services || []);
      setFilteredServices(response.data.services || []);
    } catch (err) {
      setError("Failed to fetch services.");
    } finally {
      setLoading(false);
    }
  }, [BaseUrl]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Handle Search Functionality
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = services.filter(
      (service) =>
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.address.toLowerCase().includes(query) ||
        service.category.name.toLowerCase().includes(query) ||
        service.zipcode.toLowerCase().includes(query)
    );
    setFilteredServices(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle Deletion of a Service
  const handleDeleteService = async (id) => {
    alertify.confirm(
      "Delete Confirmation",
      `Are you sure you want to delete this service?`,
      async function () {
        try {
          await axios.delete(`${BaseUrl}/service/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("Auth-Token")}`,
            },
          });

          setServices((prev) => prev.filter((service) => service._id !== id));
          setFilteredServices((prev) =>
            prev.filter((service) => service._id !== id)
          );
          alertify.success("Service deleted successfully!");
        } catch (error) {
          console.error("Error deleting service:", error);
          alertify.error(
            error.response?.data?.message || "Failed to delete service."
          );
        }
      },
      function () {
        alertify.error("Action canceled");
      }
    );
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const currentServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4">
      <Row className="mt-2">
        <Col md={9}>
          <h2 style={{ color: "#003f88" }}>All Services</h2>
        </Col>

        <Col md={3}>
          <Form className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </Form>
        </Col>
      </Row>

      {/* Services Table */}
      <Table bordered hover responsive>
        <thead style={{ backgroundColor: "#003f88", color: "white" }}>
          <tr>
            <th>S.no</th>
            <th>Title</th>
            <th>Description</th>
            <th>Address</th>
            <th>Category</th>
            <th>Zipcode</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentServices.length > 0 ? (
            currentServices.map((service, index) => (
              <tr key={index}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{service?.title}</td>
                <td>{service?.description || ""}</td>
                <td>{service?.address || ""}</td>
                <td>{service?.category?.name || ""}</td>
                <td>{service?.zipcode || ""}</td>
                <td>
                  <Link
                    href="#"
                    className="me-2"
                    onClick={() => handleDeleteService(service._id)}
                  >
                    <FaRegTrashAlt />
                  </Link>
                  <Link to={`/service/${service._id}`}>
                    <FaEye />
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                {loading ? "Loading..." : "No services available"}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <Pagination.Prev
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={`page-${index + 1}`}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() =>
              currentPage < totalPages && handlePageChange(currentPage + 1)
            }
            disabled={currentPage === totalPages}
          />
        </Pagination>
      )}
    </div>
  );
}

export default Services;
