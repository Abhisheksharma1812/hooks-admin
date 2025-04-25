import React, { useState, useCallback, useEffect } from "react";
import { Pagination, Table, Row, Col, Form } from "react-bootstrap";
import axios from "axios";
import { FaRegTrashAlt, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const BaseUrl = process.env.REACT_APP_API_URL;

  // Calculate pages based on filtered results
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const currentEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}/event/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Auth-Token")}`,
        },
      });
      setEvents(response.data.events || []);
      setFilteredEvents(response.data.events || []); // Set filtered data initially
    } catch (err) {
      setError("Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  }, [BaseUrl]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDeleteEvent = async (id) => {
    alertify.confirm(
      "Delete Confirmation",
      `Are you sure you want to delete this event?`,
      async function () {
        try {
          await axios.delete(`${BaseUrl}/event/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("Auth-Token")}`,
            },
          });

          setEvents((prev) => prev.filter((service) => service._id !== id));
          setFilteredEvents((prev) =>
            prev.filter((service) => service._id !== id)
          );
          alertify.success("Event deleted successfully!");
        } catch (error) {
          console.error("Error deleting user:", error);
          alertify.error(
            error.response?.data?.message || "Failed to delete event."
          );
        }
      },
      function () {
        alertify.error("Action canceled");
      }
    );
  };

  // Search handler
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = events.filter(
      (event) =>
        event?.name?.toLowerCase().includes(value) ||
        event?.address?.toLowerCase().includes(value) ||
        event?.city_state?.toLowerCase().includes(value) ||
        event?.zipcode?.toLowerCase().includes(value)
    );

    setFilteredEvents(filtered);
    setCurrentPage(1); // Reset to first page after search
  };

  return (
    <div className="p-4">
      <Row className="mt-2">
        <Col md={9}>
          <h2 style={{ color: "#003f88" }}>All Events</h2>
        </Col>

        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Events Table */}
      <Table bordered hover responsive>
        <thead style={{ backgroundColor: "#003f88", color: "white" }}>
          <tr>
            <th>S.no</th>
            <th>Name</th>
            <th>Address</th>
            <th>City</th>
            <th>Zipcode</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEvents.length > 0 ? (
            currentEvents.map((event, index) => (
              <tr key={index}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{event?.name || ""}</td>
                <td>{event?.address || ""}</td>
                <td>{event?.city_state || ""}</td>
                <td>{event?.zipcode || ""}</td>
                <td>
                  <Link
                    href="#"
                    className="me-2"
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    <FaRegTrashAlt />
                  </Link>

                  <Link to={`/event/${event._id}`}>
                    <FaEye />
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                {loading ? "Loading..." : "No events available"}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
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
    </div>
  );
}

export default Events;
