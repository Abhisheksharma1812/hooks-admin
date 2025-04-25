import React, { useState, useCallback, useEffect } from "react";
import {
  Table,
  Row,
  Col,
  Pagination,
  Alert,
  FormControl,
} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { FaEye, FaRegTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import moment from "moment";

import axios from "axios";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

const DatingUsers = () => {
  const [allUsers, setAllUsers] = useState([]); // Store all users
  const [filteredUsers, setFilteredUsers] = useState([]); // Store filtered users
  const [searchTerm, setSearchTerm] = useState(""); // Store search term
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Items per page
  const BaseUrl = process.env.REACT_APP_API_URL;

  // Get total pages
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Get users for the current page
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Fetch all users when the component mounts
  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}/user/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Auth-Token")}`,
        },
        params: {
          datingProfileCompletion: ["3","2"],
        },
      });
      console.log(response.data.users);
      setAllUsers(response.data.users); // Store all users
      setFilteredUsers(response.data.users); // Initially, filteredUsers = allUsers
    } catch (error) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  }, [BaseUrl]);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const handleDeleteUser = async (id) => {
    alertify.confirm(
      "Delete Confirmation",
      `Are you sure you want to delete this user?`,
      async function () {
        try {
          await axios.delete(`${BaseUrl}/user/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("Auth-Token")}`,
            },
          });

          setAllUsers((prev) => prev.filter((service) => service._id !== id));
          setFilteredUsers((prev) =>
            prev.filter((service) => service._id !== id)
          );
          alertify.success("User deleted successfully!");
        } catch (error) {
          console.error("Error deleting user:", error);
          alertify.error(
            error.response?.data?.message || "Failed to delete user."
          );
        }
      },
      function () {
        alertify.error("Action canceled");
      }
    );
  };

  const handleActiveStatus = async (id) => {
    try {
      const response = await axios.patch(
        `${BaseUrl}/user/${id}/active`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Auth-Token")}`,
          },
        }
      );
      alertify.success(response?.data?.message);

      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id
            ? { ...user, status: response?.data?.data?.status }
            : user
        )
      );
    } catch (error) {
      alertify.error("Failed to active/inactive user!");
      console.error("Error making user active/inactive:", error);
    }
  };

  const handleApproveFilter = (e) => {
    const searchValue = e.target.value.toLowerCase();
    let approvedUsers;
   
    if(searchValue !== "type"){
      approvedUsers = allUsers.filter((user) => user.profileType === searchValue);
    }else{
      approvedUsers = allUsers
    }
    setFilteredUsers(approvedUsers);
    setCurrentPage(1);
  };

  // Handle search input change
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = allUsers.filter((user) => {
      const firstName = user?.firstname?.toLowerCase() || "";
      const lastName = user?.lastname?.toLowerCase() || "";
      const email = user?.email?.toLowerCase() || "";
      const phone = user?.phone || "";

      return (
        firstName.includes(searchValue) ||
        lastName.includes(searchValue) ||
        email.includes(searchValue) ||
        phone.includes(searchValue)
      );
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  return (
    <div className="flex-grow-1">
      <div className="p-4">
        <Row className="mt-2">
          <Col md={9}>
            <h2 style={{ color: "#003f88" }}>Dating Users</h2>
          </Col>

          <Col md={3} className="d-flex">
            <FormControl
              type="text"
              placeholder="Search User"
              value={searchTerm}
              onChange={handleSearch}
              className="mb-3 me-2"
            />
            <Form.Select
              aria-label="Default select example"
              onChange={handleApproveFilter}
            >
              <option>Type</option>
              <option value="dating">Approved</option>
              <option value="normal">Pending Approval</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Error Message */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Loading Spinner */}
        <Table bordered hover responsive>
          <thead style={{ backgroundColor: "#003f88", color: "white" }}>
            <tr>
              <th>S.no</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Created At</th>
              <th colSpan={3}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>
                    {user?.firstname} {user?.lastname}
                  </td>
                  <td>{user?.email}</td>
                  <td>{user?.phone}</td>
                  <td>
                    {moment(user?.createdAt).format("MMMM D, YYYY h:mm A")}
                  </td>
                  <td colSpan={3}>
                    {/* Delete Button */}
                    <Link
                      href="#"
                      className="me-2"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <FaRegTrashAlt />
                    </Link>

                    <Link to={`/user/${user._id}`}>
                      <FaEye />
                    </Link>

                    <label className="switch">
                      <input
                        type="checkbox"
                        onChange={() => handleActiveStatus(user._id)}
                        checked={user.status === "Active" ? true : false}
                      />
                      <span className="slider"></span>
                    </label>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  {loading ? "Loading..." : "No users found"}
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination>
            <Pagination.Prev
              onClick={() =>
                currentPage > 1 && handlePageChange(currentPage - 1)
              }
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
    </div>
  );
};

export default DatingUsers;
