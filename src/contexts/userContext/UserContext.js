import React, { createContext, useReducer, useEffect } from 'react';
import instance from '../../axios-wmc-services'; // Import custom Axios instance

export const UserContext = createContext();
const API_KEY = process.env.REACT_APP_WEB_API_KEY;

const initialState = {
  saving: false,
  loggingIn: false,
  loading: true,
  error: null,
  token: null,
  userId: null,
  expireDate: null,
  role: null,
  username: null,
  users: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loggingIn: false,
        loading: false,
        error: null,
        token: action.payload.token,
        userId: action.payload.userId,
        expireDate: action.payload.expireDate,
        role: action.payload.role,
        username: action.payload.username,
      };
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        saving: false,
        loading: false,
        error: null,
        token: action.payload.token,
        userId: action.payload.userId,
        expireDate: action.payload.expireDate,
        role: action.payload.role,
        username: action.payload.username,
      };
    case 'LOGIN_FAIL':
    case 'SIGNUP_FAIL':
      return {
        ...state,
        loggingIn: false,
        saving: false,
        loading: false,
        error: action.payload.error,
        token: null,
        userId: null,
        expireDate: null,
        role: null,
        username: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        token: null,
        userId: null,
        expireDate: null,
        role: null,
        username: null,
      };
    case 'START_LOGIN':
    case 'START_SIGNUP':
      return {
        ...state,
        loggingIn: true,
        saving: true,
        loading: true,
        error: null,
      };
    case 'FETCH_USERS_SUCCESS':
      return {
        ...state,
        loading: false,
        users: action.payload.users,
      };
    case 'FETCH_USERS_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

const UserStore = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');
      if (token && userId) {
        try {
          const userResponse = await instance.get(`/users/${userId}.json?auth=${token}`);
          const role = userResponse.data.role;
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              token,
              userId,
              expireDate: new Date(localStorage.getItem('expireDate')),
              role,
              username,
            },
          });
        } catch (error) {
          dispatch({ type: 'LOGIN_FAIL', payload: { error: error.message } });
        }
      } else {
        dispatch({ type: 'LOGIN_FAIL', payload: { error: 'No user logged in' } });
      }
    };
    checkUser();
  }, []);

  const loginUser = async (email, password) => {
    dispatch({ type: 'START_LOGIN' });
    try {
      const response = await instance.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
        { email, password, returnSecureToken: true }
      );
      const { idToken, localId, expiresIn } = response.data;

      // Fetch user role and username from Firebase Realtime Database
      const userResponse = await instance.get(`/users/${localId}.json?auth=${idToken}`);
      const role = userResponse.data.role;
      const username = userResponse.data.username;

      const expireDate = new Date(new Date().getTime() + expiresIn * 1000);

      localStorage.setItem('token', idToken);
      localStorage.setItem('userId', localId);
      localStorage.setItem('expireDate', expireDate);
      localStorage.setItem('username', username);

      dispatch({ type: 'LOGIN_SUCCESS', payload: { token: idToken, userId: localId, expireDate, role, username } });
      return { success: true };
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error.message);
      dispatch({ type: 'LOGIN_FAIL', payload: { error: error.response ? error.response.data.error.message : error.message } });
      return { success: false, error: error.response ? error.response.data.error.message : error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expireDate');
    localStorage.removeItem('username');

    dispatch({ type: 'LOGOUT' });
  };

  const signupUser = async (email, password, username, role = 'user') => {
    dispatch({ type: 'START_SIGNUP' });
    try {
      console.log("Signup payload:", { email, password, returnSecureToken: true });

      const response = await instance.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
        { email, password, returnSecureToken: true }
      );

      console.log("Signup response:", response);

      const { idToken, localId, expiresIn } = response.data;
      const expireDate = new Date(new Date().getTime() + expiresIn * 1000);

      // Store the token, userId, expireDate, and username in local storage
      localStorage.setItem('token', idToken);
      localStorage.setItem('userId', localId);
      localStorage.setItem('expireDate', expireDate);
      localStorage.setItem('username', username);

      // Store user data with role and username in Firebase Realtime Database
      await instance.put(`/users/${localId}.json?auth=${idToken}`, { email, username, role });

      dispatch({ type: 'SIGNUP_SUCCESS', payload: { token: idToken, userId: localId, expireDate, role, username } });
      return { success: true };
    } catch (error) {
      console.error("Signup error:", error.response ? error.response.data : error.message);
      dispatch({ type: 'SIGNUP_FAIL', payload: { error: error.response ? error.response.data.error.message : error.message } });
      return { success: false, error: error.response ? error.response.data.error.message : error.message };
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const idToken = localStorage.getItem('token');
      await instance.patch(`/users/${userId}.json?auth=${idToken}`, { role: newRole });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response.data.error.message };
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await instance.get('/users.json');
      dispatch({ type: 'FETCH_USERS_SUCCESS', payload: { users: response.data } });
    } catch (error) {
      dispatch({ type: 'FETCH_USERS_FAIL', payload: { error: error.message } });
    }
  };

  return (
    <UserContext.Provider value={{ state, loginUser, logout, signupUser, updateUserRole, fetchUsers, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserStore;
