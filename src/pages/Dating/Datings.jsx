import React, { useState, useCallback, useEffect } from "react";
import { Pagination, Table, Row, Col, Form, Image } from "react-bootstrap";
import axios from "axios";
import { FaRegTrashAlt, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import moment from "moment";

function Datings() {
  const [datings, setDatings] = useState([]);
  const [filteredDatings, setFilteredDatings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const BaseUrl = process.env.REACT_APP_API_URL;

  // Calculate pages based on filtered results
  const totalPages = Math.ceil(filteredDatings.length / itemsPerPage);
  const currentDatings = filteredDatings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Fetch events from API
  const fetchDatings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}/dating/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Auth-Token")}`,
        },
      });
      setDatings(response.data.datings || []);
      setFilteredDatings(response.data.datings || []); // Set filtered data initially
    } catch (err) {
      setError("Failed to fetch datings.");
    } finally {
      setLoading(false);
    }
  }, [BaseUrl]);

  useEffect(() => {
    fetchDatings();
  }, [fetchDatings]);

  const handleDeleteDating = async (id) => {
    alertify.confirm(
      "Delete Confirmation",
      `Are you sure you want to delete this dating?`,
      async function () {
        try {
          await axios.delete(`${BaseUrl}/dating/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("Auth-Token")}`,
            },
          });

          setDatings((prev) => prev.filter((dating) => dating._id !== id));
          setFilteredDatings((prev) =>
            prev.filter((dating) => dating._id !== id)
          );
          alertify.success("Dating deleted successfully!");
        } catch (error) {
          console.error("Error deleting dating:", error);
          alertify.error(
            error.response?.data?.message || "Failed to delete dating."
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

    const filtered = datings.filter(
      (dating) =>
        dating?.name?.toLowerCase().includes(value) ||
        dating?.address?.toLowerCase().includes(value) ||
        dating?.city_state?.toLowerCase().includes(value) ||
        dating?.zipcode?.toLowerCase().includes(value)
    );

    setFilteredDatings(filtered);
    setCurrentPage(1); // Reset to first page after search
  };

  return (
    <div className="p-4">
      <Row className="mt-2">
        <Col md={9}>
          <h2 style={{ color: "#003f88" }}>All Datings</h2>
        </Col>

        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search datings..."
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
            <th>User</th>
            <th>Date</th>
            <th>Dating Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentDatings.length > 0 ? (
            currentDatings.map((dating, index) => (
              <tr key={index}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>
                  <Image
                    src={dating?.user?.avatar[0]?.url}
                    roundedCircle
                    className="me-2"
                    width="25"
                    height="25"
                  />
                  {dating?.user?.firstname + " " + dating?.user?.lastname || ""}
                  <Link to={`/user/${dating?.user?._id}`} className="ms-2">
                    <FaEye />
                  </Link>
                </td>
                <td>
                  <Image
                    src={dating?.dating?.avatar[0]?.url}
                    roundedCircle
                    className="me-2"
                    width="25"
                    height="25"
                  />
                  {dating?.dating?.firstname + " " + dating?.dating?.lastname ||
                    ""}
                  <Link to={`/user/${dating?.dating?._id}`} className="ms-2">
                    <FaEye />
                  </Link>
                </td>
                <td>{dating?.type.toUpperCase() || ""}</td>
                <td>
                  {moment(dating?.createdAt).format("MMMM D, YYYY h:mm A") ||
                    ""}
                </td>
                <td>
                  <Link
                    href="#"
                    className="me-2"
                    onClick={() => handleDeleteDating(dating._id)}
                  >
                    <FaRegTrashAlt />
                  </Link>

                  {/* <Link to={`/dating/${dating._id}`}>
                    <FaEye />
                  </Link> */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                {loading ? "Loading..." : "No datings available"}
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

export default Datings;
