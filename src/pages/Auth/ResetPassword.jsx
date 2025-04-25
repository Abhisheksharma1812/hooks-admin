import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import LoginLogo from "../../images/Applogo.png";
import uIcon from "../../images/s-fill.png";

function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [resultMessage, setResultMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState("");
  const BaseUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const validateForm = () => {
    const { password, confirmPassword } = formData;
    const newErrors = {};
    if (!password || password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    return newErrors;
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setResultMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0)
      return setErrors(validationErrors);

    try {
      setLoading(true);
      const token = window.location.pathname.split("/")[2];
      const response = await axios.post(`${BaseUrl}/user/reset-password`, {
        token,  // Add the token to the request
        newPassword: formData.password,
      });

      const result = response.data;
      if (result.success) {
        setResultMessage("Password has been reset successfully!");
        setMessageType("success");
      } else {
        throw new Error(result.message || "Reset failed");
      }
    } catch (error) {
      setResultMessage(
        error.response?.data?.message || "Something went wrong."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100" style={{ minHeight: "100%" }}>
      <Card className="shadow rounded" style={{ maxWidth: "60%", margin: "auto" }}>
        <Card.Body>
          <Row className="d-flex" style={{ margin: "-16px" }}>
            {/* Left Side */}
            <Col
              md={5}
              className="bg-dark text-white text-center d-flex"
              style={{
                minHeight: "100%",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={LoginLogo}
                alt="Logo"
                className="img-fluid"
                style={{ maxWidth: "80%" }}
              />
              <img
                src={uIcon}
                alt="User Icon"
                className="img-fluid mt-3"
                style={{ maxWidth: "80%" }}
              />
            </Col>

            {/* Right Side */}
            <Col md={6} className="mx-3" style={{ padding: "20px 20px 40px 0px" }}>
              <h4 className="mb-2 mt-3 text-black fw-bold">Reset Your Password</h4>
              <small className="text-muted">Enter your new password below.</small>

              <div className="mt-4">
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter new password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm new password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      isInvalid={!!errors.confirmPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 mt-3"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : "Reset Password"}
                  </Button>

                  {resultMessage && (
                    <div
                      className={`mt-3 text-center ${
                        messageType === "success" ? "text-success" : "text-danger"
                      }`}
                    >
                      {resultMessage}
                    </div>
                  )}
                </Form>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ResetPassword;