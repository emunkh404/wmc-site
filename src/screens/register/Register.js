import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/userContext/UserContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import styles from './RegisterPage.module.css';
import NavBarGen from '../../components/generics/navbar/NavBarGen';

const Register = () => {
  const emailRef = useRef(null);
  const navigate = useNavigate();
  const { signupUser } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  // Email validation function
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // Form validation function
  const validateForm = () => {
    if (!email || !password || !rePassword || !username) {
      setError('Please fill in all fields.');
      return false;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    if (password !== rePassword) {
      setError('Passwords do not match.');
      return false;
    }
    setError('');
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const result = await signupUser(email, password, username);
      if (result.success) {
        navigate('/login');
      } else {
        setError(result.error);
      }
    }
  };

  return (
    <>
      <NavBarGen/>
      <Container className={styles.root}>
        <div className={styles.formContainer}>
          <h1 className={styles.formTitle}>Sign Up</h1>
          {error && <Alert variant="danger" className={styles.errorMessage}>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ref={emailRef}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicRePassword">
              <Form.Label>Repeat Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Repeat Password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="outline-primary" type="submit" className="w-100">
              Sign Up
            </Button>
          </Form>
        </div>
      </Container>
    </>
  );
};

export default Register;
