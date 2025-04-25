import React, { useState, useCallback, useEffect } from "react";
import { Pagination, Row, Col, Table, Form } from "react-bootstrap";
import axios from "axios";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { FaRegTrashAlt, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

function Sales() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]); // For search functionality
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Search input state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [error, setError] = useState(null);
  const BaseUrl = process.env.REACT_APP_API_URL;

  // Fetch sales from API
  const fetchSales = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}/sale/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Auth-Token")}`,
        },
      });
      setSales(response.data.sales || []);
      setFilteredSales(response.data.sales || []);
    } catch (err) {
      setError("Failed to fetch sales.");
    } finally {
      setLoading(false);
    }
  }, [BaseUrl]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  // Handle Search Functionality
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = sales.filter(
      (sale) =>
        sale.title.toLowerCase().includes(query) ||
        sale.description.toLowerCase().includes(query) ||
        sale.address.toLowerCase().includes(query) ||
        sale.category.name.toLowerCase().includes(query) ||
        sale.zipcode.toLowerCase().includes(query)
    );
    setFilteredSales(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle Deletion of a Service
  const handleDeleteSale = async (id) => {
    alertify.confirm(
      "Delete Confirmation",
      `Are you sure you want to delete this sale?`,
      async function () {
        try {
          await axios.delete(`${BaseUrl}/sale/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("Auth-Token")}`,
            },
          });

          setSales((prev) => prev.filter((sale) => sale._id !== id));
          setFilteredSales((prev) => prev.filter((sale) => sale._id !== id));
          alertify.success("Sale deleted successfully!");
        } catch (error) {
          console.error("Error deleting sale:", error);
          alertify.error(
            error.response?.data?.message || "Failed to delete sale."
          );
        }
      },
      function () {
        alertify.error("Action canceled");
      }
    );
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const currentSales = filteredSales.slice(
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
          <h2 style={{ color: "#003f88" }}>All Sales</h2>
        </Col>

        <Col md={3}>
          <Form className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search sales..."
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
            <th>Price</th>
            <th>Category</th>
            <th>Zipcode</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentSales.length > 0 ? (
            currentSales.map((sale, index) => (
              <tr key={index}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{sale?.title}</td>
                <td>{sale?.description || ""}</td>
                <td>{sale?.address || ""}</td>
                <td>${sale?.price || ""}</td>
                <td>{sale?.category?.name || ""}</td>
                <td>{sale?.zipcode || ""}</td>
                <td>
                  <Link
                    href="#"
                    className="me-2"
                    onClick={() => handleDeleteSale(sale._id)}
                  >
                    <FaRegTrashAlt />
                  </Link>
                  <Link to={`/sale/${sale._id}`}>
                    <FaEye />
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                {loading ? "Loading..." : "No sales available"}
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

export default Sales;
