import React, { createContext, useReducer, useEffect } from 'react';
import instance from '../../axios-wmc-services'; // Import custom Axios instance

export const PrayerContext = createContext();

const initialState = {
  prayerRequests: {},
  loading: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_PRAYER_REQUESTS_SUCCESS':
      return { ...state, prayerRequests: action.payload.prayerRequests, loading: false };
    case 'FETCH_PRAYER_REQUESTS_FAIL':
      return { ...state, error: action.payload.error, loading: false };
    case 'START_REQUEST':
      return { ...state, loading: true };
    case 'REQUEST_FAIL':
      return { ...state, error: action.payload.error, loading: false };
    default:
      return state;
  }
};

const PrayerStore = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchPrayerRequests = async () => {
    dispatch({ type: 'START_REQUEST' });
    try {
      const response = await instance.get('/prayerRequests.json');
      dispatch({ type: 'FETCH_PRAYER_REQUESTS_SUCCESS', payload: { prayerRequests: response.data } });      
    } catch (error) {
      dispatch({ type: 'FETCH_PRAYER_REQUESTS_FAIL', payload: { error: error.message } });
    }
  };

  useEffect(() => {
    fetchPrayerRequests();
  }, []);

  const createPrayerRequest = async (requestId, requestData) => {
    dispatch({ type: 'START_REQUEST' });
    try {
      await instance.put(`/prayerRequests/${requestId}.json`, requestData);
      fetchPrayerRequests();
    } catch (error) {
      dispatch({ type: 'REQUEST_FAIL', payload: { error: error.message } });
    }
  };

  const deletePrayerRequest = async (requestId) => {
    dispatch({ type: 'START_REQUEST' });
    try {
      await instance.delete(`/prayerRequests/${requestId}.json`);
      fetchPrayerRequests();
    } catch (error) {
      dispatch({ type: 'REQUEST_FAIL', payload: { error: error.message } });
    }
  };

  const createComment = async (requestId, commentId, commentData) => {
    dispatch({ type: 'START_REQUEST' });
    try {
      await instance.put(`/prayerRequests/${requestId}/comments/${commentId}.json`, commentData);
      fetchPrayerRequests();
    } catch (error) {
      dispatch({ type: 'REQUEST_FAIL', payload: { error: error.message } });
    }
  };

  const deleteComment = async (requestId, commentId) => {
    dispatch({ type: 'START_REQUEST' });
    try {
      await instance.delete(`/prayerRequests/${requestId}/comments/${commentId}.json`);
      fetchPrayerRequests();
    } catch (error) {
      dispatch({ type: 'REQUEST_FAIL', payload: { error: error.message } });
    }
  };

  const addPrayer = async (requestId, prayerId, prayerData) => {
    dispatch({ type: 'START_REQUEST' });
    try {
      await instance.put(`/prayerRequests/${requestId}/prayers/${prayerId}.json`, prayerData);
      fetchPrayerRequests();
    } catch (error) {
      dispatch({ type: 'REQUEST_FAIL', payload: { error: error.message } });
    }
  };

  return (
    <PrayerContext.Provider value={{ state, fetchPrayerRequests, createPrayerRequest, deletePrayerRequest, createComment, deleteComment, addPrayer }}>
      {children}
    </PrayerContext.Provider>
  );
};

export default PrayerStore;
