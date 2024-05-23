import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../contexts/userContext/UserContext';
import styles from './LoginOut.module.css';

export default function LoginOut() {
  const { state, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      {state.token ? (
        <button className={styles.logoutButton} onClick={logout}>
          Logout
        </button>
      ) : (
        <button className={styles.button} onClick={handleLogin}>
          Login
        </button>
      )}
    </div>
  );
}
