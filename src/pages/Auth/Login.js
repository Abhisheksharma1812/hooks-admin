import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../assets/css/cst-style.css";
import LoginLogo from "../../images/Applogo.png";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [resultMessage, setResultMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const BaseUrl = process.env.REACT_APP_API_URL;

  const handleChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear specific field error
    if (resultMessage) setResultMessage(null);
  };

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) newErrors.email = "Enter a valid email.";
    if (!data.password || data.password.length < 8) newErrors.password = "Password must be at least 8 characters.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);


    const formDataToSend = new FormData();
    formDataToSend.append("email", formData.email); // ✅ Add email
    formDataToSend.append("password", formData.password); // ✅ Add password
    formDataToSend.append("mode", "website"); 
    
    try {
      setLoading(true);
     
      const response = await axios.post(`${BaseUrl}/user/login`,formDataToSend, {
        headers: {"Content-Type": "application/json" },
      });
  
      const result = response.data;

      if (result.success) {
        localStorage.setItem("Auth-Token", result.accessToken);
        localStorage.setItem("user", btoa(result.user._id));
        setResultMessage("Auth-Token", result.accessToken);
        setMessageType("success");
        navigate("/");
      }else {
        throw new Error("Invalid credentials.");
      }
    } catch (error) {
      console.log("Error response:", error.response);

      // ✅ Handle API error messages
      if (error.response) {
        const { status, data } = error.response;
        setResultMessage(data.message || `Error ${status}: Something went wrong.`);
      } else {
        setResultMessage("An error occurred. Please try again.");
      }
  
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <Container fluid>
      <Row className="d-flex justify-content-center align-items-center h-100">
        <Col>
          <Card className="bg-dark text-white my-5 mx-auto card-login">
            <Card.Body className="p-5 flex-column">
              <img src={LoginLogo} alt="Login Logo" className="LoginLogo" />
              <p className="text-white-50 mb-5">Please enter your login and password!</p>
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="validationEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="validationPassword" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                </Form.Group>

              <div className="d-flex flex-column align-items-start mt-3">
                {/*   <Form.Check
                    type="checkbox"
                    id="remember-me"
                    label="Remember me"
                    onChange={handleCheckboxChange}
                    checked={rememberMe}
                  />  */} 
                  <Button type="submit" className="mt-3 px-5" size="lg" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Login"}
                  </Button>
                </div>

                {resultMessage && (
                  <div
                    className={`mt-3 ${messageType === "success" ? "text-success" : "text-danger"}`}
                  >
                    {resultMessage}
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
