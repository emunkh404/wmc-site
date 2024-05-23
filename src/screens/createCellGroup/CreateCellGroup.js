import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CellGroupContext } from "../../contexts/cellGroupContext/CellGroupContext";
import { UserContext } from "../../contexts/userContext/UserContext";
import NavBarGen from "../../components/generics/navbar/NavBarGen";

const CreateCellGroup = () => {
  const { state: cellGroupState, createCellGroup } = useContext(CellGroupContext);
  const { state: userState, fetchUsers } = useContext(UserContext);
  const [zoneId, setZoneId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [leaderId, setLeaderId] = useState("");
  const [assistantId, setAssistantId] = useState("");
  const [location, setLocation] = useState("");
  const [totalMembers, setTotalMembers] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const groupId = `group-${Date.now()}`;
    const groupData = {
      name: groupName,
      leaderId,
      assistantId,
      leader: "Type Cell group leader name",
      assistant: "Type Cell group assistant name",
      location,
      totalMembers: parseInt(totalMembers, 10),
      attendance: { thisWeek: 0 },
    };

    try {
      await createCellGroup(zoneId, groupId, groupData);
      navigate("/manage-members");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <NavBarGen />
      <Container>
        <h1>Create New Cell Group</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="zoneId">
            <Form.Label>Select Zone</Form.Label>
            <Form.Control
              as="select"
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              required
            >
              <option value="">Choose...</option>
              {Object.keys(cellGroupState.zones).map((zoneKey) => (
                <option key={zoneKey} value={zoneKey}>
                  {cellGroupState.zones[zoneKey].zoneName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="groupName">
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="leader">
            <Form.Label>Select Leader</Form.Label>
            <Form.Control
              as="select"
              value={leaderId}
              onChange={(e) => setLeaderId(e.target.value)}
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
          <Form.Group controlId="assistant">
            <Form.Label>Select Assistant</Form.Label>
            <Form.Control
              as="select"
              value={assistantId}
              onChange={(e) => setAssistantId(e.target.value)}
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
          <Form.Group controlId="location">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="totalMembers">
            <Form.Label>Total Members</Form.Label>
            <Form.Control
              type="number"
              value={totalMembers}
              onChange={(e) => setTotalMembers(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Create Cell Group
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default CreateCellGroup;
