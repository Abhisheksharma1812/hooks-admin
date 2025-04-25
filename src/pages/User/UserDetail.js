import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Row, Col, Spinner, Image } from "react-bootstrap";
import axios from "axios";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const BaseUrl = process.env.REACT_APP_API_URL;

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(`${BaseUrl}/user/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Auth-Token")}`,
        },
      });

      //   const userData = response.data.user;
      //   if (userData.subscription && Array.isArray(userData.subscription)) {
      //     userData.subscription = userData.subscription[0]; // Take only the first subscription
      //   }

      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus =
      currentStatus === "normal" || currentStatus === ""
        ? "Approve"
        : "Unapprove";

    alertify.confirm(
      "Change Status",
      `Are you sure you want to ${newStatus} this user?`,
      async function () {
        try {
          await axios.put(
            `${BaseUrl}/user/${userId}/status`,
            { profileType: currentStatus === "normal" ? "dating" : "normal" },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("Auth-Token")}`,
              },
            }
          );
          alertify.success(`User status updated to ${newStatus}`);
          fetchUser();
        } catch (error) {
          alertify.error("Failed to update user status!");
          console.error("Error updating user status:", error);
        }
      },
      function () {
        alertify.error("Action canceled");
      }
    );
  };

  return (
    <div className="flex-grow-1">
      <div className="p-4">
        <h2>User Detail</h2>
        {loading ? (
          <Spinner animation="border" />
        ) : user ? (
          <>
            <Card className="shadow-lg p-4">
              <Row className="align-items-center">
                <Col md={2} className="text-center">
                  <Image
                    src={
                      user.avatar
                        ? user.avatar[0].url
                        : "https://via.placeholder.com/150"
                    }
                    alt={user.name}
                    roundedCircle
                    width="150"
                    height="150"
                    className="border p-1"
                  />
                </Col>
                <Col md={8} flex>
                  <h4>
                    {user.firstname} {user.lastname}
                  </h4>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Gender:</strong> {user.gender}
                  </p>
                  <p>
                    <strong>Phone:</strong> {user.phone}
                  </p>
                  <p>
                    <strong>Profile Type:</strong> {user.profileType}
                  </p>

                  {(user?.datingProfileCompletion === 3 || user?.datingProfileCompletion === 2) && (
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() =>
                        toggleUserStatus(user._id, user.profileType)
                      }
                    >
                      {user.profileType === "normal" ? "Approve" : "Unapprove"}
                    </Button>
                  )}
                </Col>
              </Row>

              {user.meta?.length > 0 && (
                <>
                  <hr />
                  <h5 className="text-primary">Dating Profile</h5>
                  <div>
                    <Row className="mt-2">
                      {user.meta.find(
                        (meta) => meta.metaKey === "datingProfile"
                      ) && (
                        <>
                          <>
                            <strong>Dating Profile:</strong>
                          </>
                          <Col>
                            {user.meta
                              .find((meta) => meta.metaKey === "datingProfile")
                              .value.map((item, index) =>
                                item.type === "image" ? (
                                  <Image
                                    key={index}
                                    src={item.url}
                                    width={100}
                                    height={100}
                                    className="me-2"
                                    alt="Dating Profile Image"
                                  />
                                ) : null
                              )}
                          </Col>
                        </>
                      )}

                      {user.meta.find(
                        (meta) => meta.metaKey === "userDocuments"
                      ) && (
                        <>
                          <strong>Documents:</strong>
                          <Col>
                            {user.meta
                              .find((meta) => meta.metaKey === "userDocuments")
                              .value.map((item, index) =>
                                item.type === "image" ? (
                                  <Image
                                    key={index}
                                    src={item.url}
                                    width={100}
                                    height={100}
                                    className="me-2"
                                    alt="Dating Profile Image"
                                  />
                                ) : null
                              )}
                          </Col>
                        </>
                      )}
                    </Row>

                    <Row className="mt-2">
                      {user.meta.find(
                        (meta) => meta.metaKey === "dating_name"
                      ) && (
                        <Col md={6}>
                          <strong>Rank:</strong>{" "}
                          {
                            user.meta.find(
                              (meta) => meta.metaKey === "dating_name"
                            ).value
                          }
                        </Col>
                      )}

                      {user.meta.find(
                        (meta) => meta.metaKey === "religious"
                      ) && (
                        <Col md={6}>
                          <strong>Rank:</strong>{" "}
                          {
                            user.meta.find(
                              (meta) => meta.metaKey === "religious"
                            ).value
                          }
                        </Col>
                      )}
                    </Row>

                    <Row className="mt-2">
                      {user.meta.find(
                        (meta) => meta.metaKey === "searchAge"
                      ) && (
                        <Col md={6}>
                          <strong>Age:</strong>{" "}
                          {
                            user.meta.find(
                              (meta) => meta.metaKey === "searchAge"
                            ).value
                          }
                        </Col>
                      )}

                      {user.meta.find(
                        (meta) => meta.metaKey === "interestedIn"
                      ) && (
                        <Col md={6}>
                          <strong>Interested In:</strong>{" "}
                          {
                            user.meta.find(
                              (meta) => meta.metaKey === "interestedIn"
                            ).value
                          }
                        </Col>
                      )}
                    </Row>

                    <Row className="mt-2">
                      {user.meta.find((meta) => meta.metaKey === "rank") && (
                        <Col md={6}>
                          <strong>Rank:</strong>{" "}
                          {
                            user.meta.find((meta) => meta.metaKey === "rank")
                              .value
                          }
                        </Col>
                      )}

                      {user.meta.find((meta) => meta.metaKey === "aboutme") && (
                        <Col md={6}>
                          <strong>About:</strong>{" "}
                          {
                            user.meta.find((meta) => meta.metaKey === "aboutme")
                              .value
                          }
                        </Col>
                      )}
                    </Row>

                    <Row className="mt-2">
                      {user.meta.find((meta) => meta.metaKey === "miles") && (
                        <Col md={6}>
                          <strong>Miles:</strong>{" "}
                          {
                            user.meta.find((meta) => meta.metaKey === "miles")
                              .value
                          }
                        </Col>
                      )}
                    </Row>
                  </div>
                </>
              )}

              {user.subscriptions && user.subscriptions.length > 0 && (
                <>
                  <hr />
                  <h5 className="text-primary">Subscription Details</h5>
                  <div>
                    <Row>
                      <Col md={6}>
                        <strong>Status:</strong> {user.subscriptions[0].status}
                      </Col>
                      <Col md={6}>
                        <strong>Membership ID:</strong>{" "}
                        {user.subscriptions[0].membership_id}
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={6}>
                        <strong>Start Date:</strong>{" "}
                        {user.subscriptions[0].start_date}
                      </Col>
                      <Col md={6}>
                        <strong>End Date:</strong>{" "}
                        {user.subscriptions[0].end_date}
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col>
                        <strong>Price:</strong> ${user.subscriptions[0].price}
                      </Col>
                    </Row>
                  </div>
                </>
              )}
            </Card>
          </>
        ) : (
          <p>User not found.</p>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
