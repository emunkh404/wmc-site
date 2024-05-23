import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CellGroupContext } from "../../contexts/cellGroupContext/CellGroupContext";
import { UserContext } from "../../contexts/userContext/UserContext";
import NavBarGen from "../../components/generics/navbar/NavBarGen";

const CreateZone = () => {
  const { createZone } = useContext(CellGroupContext);
  const { state: userState, fetchUsers } = useContext(UserContext);
  const [zoneName, setZoneName] = useState("");
  const [zoneLeaderId, setZoneLeaderId] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const zoneId = `zone-${Date.now()}`;
    const zoneData = { zoneName, zoneLeaderId, zoneLeader: "Type Zone leader name here" };

    try {
      await createZone(zoneId, zoneData);
      navigate("/manage-members");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <NavBarGen />
      <Container>
        <h1>Create New Zone</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="zoneName">
            <Form.Label>Zone Name</Form.Label>
            <Form.Control
              type="text"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="zoneLeader">
            <Form.Label>Select Zone Leader</Form.Label>
            <Form.Control
              as="select"
              value={zoneLeaderId}
              onChange={(e) => setZoneLeaderId(e.target.value)}
              required
            >
              <option value="">Choose...</option>
              {Object.keys(userState.users).map((userId) => (
                <option key={userId} value={userId}>
                  {userState.users[userId].email}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            Create Zone
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default CreateZone;
