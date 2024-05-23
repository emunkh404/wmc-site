import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/userContext/UserContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import styles from './LoginPage.module.css';

const Login = () => {
  const emailRef = useRef(null);
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateForm = () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return false;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const result = await loginUser(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    }
  };

  return (
    <Container className={styles.root}>
      <div className={styles.formContainer}>
        <h1 className={styles.formTitle}>Login</h1>
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

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Login;
