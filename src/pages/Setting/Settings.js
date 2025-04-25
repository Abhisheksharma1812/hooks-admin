import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Form, Button } from "react-bootstrap";

function Settings() {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    dob: "",
    gender: "",
    avatar: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const BaseUrl = process.env.REACT_APP_API_URL;

  // Safe decoding of user ID from localStorage
  const storedUser = localStorage.getItem("user");
  const Userdecoded = storedUser ? atob(storedUser) : null;

  // Fetch User Data
  const fetchUser = useCallback(async () => {
    if (!Userdecoded) {
      console.error("No user ID found in localStorage.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}/user/${Userdecoded}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("Auth-Token")}` },
      });
      console.log(response);

      if (response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  }, [BaseUrl, Userdecoded]);

  useEffect(() => {
    let isMounted = true; // Prevent memory leaks

    if (isMounted) {
      fetchUser();
    }

    return () => {
      isMounted = false;
    };
  }, [fetchUser]);

  // Handle input change
  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle avatar upload
   const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser((prev) => ({ ...prev, avatar: file }));
    }
  }; 

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("firstname", user.firstname);
    formData.append("lastname", user.lastname);
    formData.append("phone", user.phone);
    formData.append("dob", user.dob);
    formData.append("gender", user.gender);
    if (user.avatar instanceof File) {
      formData.append("avatar", user.avatar);
    }
//console.log(formData); return false;
    try {
   /*    const response = await axios.put(`${BaseUrl}/user/edit/${Userdecoded}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Auth-Token")}`,
        },
        withCredentials: true,
      });
 */
      const response = await axios.put(
        `${BaseUrl}/user/edit/${Userdecoded}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Auth-Token")}`,
          },
        }
      );
      console.log(response);
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Card body>
        <h2>Settings</h2>
        {message && <p className="text-success">{message}</p>}

        <Row>
          <Col md={4} className="text-center">
            <label className="d-block">
              <input type="file" accept="image/*" className="d-none" onChange={handleAvatarChange} />
              {user.avatar ? (
                <img
                  src={user.avatar instanceof File ? URL.createObjectURL(user.avatar) : user.avatar[0].url}
                  alt="Avatar"
                  className="rounded-circle border"
                  width={120}
                  height={120}
                />
              ) : (
                <div className="border p-4 rounded-circle text-center" style={{ width: 120, height: 120 }}>
                  Upload
                </div>
              )}
            </label>
          </Col>

          <Col md={8}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstname"
                  value={user.firstname}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastname"
                  value={user.lastname}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={user.dob}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select name="gender" value={user.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Form.Select>
              </Form.Group>

              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </Form>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default Settings;
