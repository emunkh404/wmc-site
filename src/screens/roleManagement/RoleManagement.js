import React, { useState, useContext } from 'react';
import instance from '../../axios-wmc-services'; // Import custom Axios instance
import { UserContext } from '../../contexts/userContext/UserContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

const RoleManagement = () => {
  const { state, updateUserRole } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [message, setMessage] = useState(null);

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (state.role === 'moderator' && newRole === 'admin') {
      setMessage({ type: 'danger', text: 'Moderators cannot assign admin role' });
      return;
    }
    try {
      const userId = await getUserIdByEmail(email);
      if (!userId) {
        setMessage({ type: 'danger', text: 'User not found' });
        return;
      }

      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        setMessage({ type: 'success', text: 'User role updated successfully' });
      } else {
        setMessage({ type: 'danger', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: error.message });
    }
  };

  const getUserIdByEmail = async (email) => {
    try {
      const idToken = localStorage.getItem('token');
      const response = await instance.get(`/users.json?auth=${idToken}`);
      const userData = response.data;
      const userId = Object.keys(userData).find(key => userData[key].email === email);
      return userId;
    } catch (error) {
      console.error('Error fetching user ID:', error);
      return null;
    }
  };

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header as="h5">Role Management</Card.Header>
        <Card.Body>
          {message && <Alert variant={message.type}>{message.text}</Alert>}
          <Form onSubmit={handleUpdateRole}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter user's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRole">
              <Form.Label>New Role</Form.Label>
              <Form.Control as="select" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                {state.role === 'admin' && <option value="admin">Admin</option>}
              </Form.Control>
            </Form.Group>

            <Button variant="outline-primary" type="submit" className="w-100">
              Update Role
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RoleManagement;
