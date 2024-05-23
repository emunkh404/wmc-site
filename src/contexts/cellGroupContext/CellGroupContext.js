import React, { createContext, useReducer, useEffect } from "react";
import instance from "../../axios-wmc-services";

export const CellGroupContext = createContext();

const initialState = {
  loading: true,
  saving: false,
  error: null,
  zones: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
        zones: action.payload.zones,
      };
    case "FETCH_FAIL":
    case "UPDATE_FAIL":
    case "DELETE_FAIL":
    case "CREATE_FAIL":
      return {
        ...state,
        loading: false,
        saving: false,
        error: action.payload.error,
      };
    case "START_FETCH":
    case "START_UPDATE":
    case "START_DELETE":
    case "START_CREATE":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "UPDATE_SUCCESS":
    case "DELETE_SUCCESS":
    case "CREATE_SUCCESS":
      return {
        ...state,
        loading: false,
        saving: false,
        error: null,
      };
    default:
      return state;
  }
};

const CellGroupStore = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchZones = async () => {
      dispatch({ type: "START_FETCH" });
      try {
        const response = await instance.get("/attendanceRecords.json");
        dispatch({ type: "FETCH_SUCCESS", payload: { zones: response.data } });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: { error: error.message } });
      }
    };
    fetchZones();
  }, []);

  const updateCellGroupData = async (zoneId, groupId, groupData) => {
    dispatch({ type: "START_UPDATE" });
    try {
      await instance.patch(`/attendanceRecords/${zoneId}/cellGroups/${groupId}.json`, groupData);
      dispatch({ type: "UPDATE_SUCCESS" });
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL", payload: { error: error.message } });
    }
  };

  const updateZoneData = async (zoneId, zoneData) => {
    dispatch({ type: "START_UPDATE" });
    try {
      await instance.patch(`/attendanceRecords/${zoneId}.json`, zoneData);
      dispatch({ type: "UPDATE_SUCCESS" });
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL", payload: { error: error.message } });
    }
  };

  const createZone = async (zoneId, zoneData) => {
    dispatch({ type: "START_CREATE" });
    try {
      await instance.put(`/attendanceRecords/${zoneId}.json`, zoneData);
      dispatch({ type: "CREATE_SUCCESS" });
    } catch (error) {
      dispatch({ type: "CREATE_FAIL", payload: { error: error.message } });
    }
  };

  const deleteZone = async (zoneId) => {
    dispatch({ type: "START_DELETE" });
    try {
      await instance.delete(`/attendanceRecords/${zoneId}.json`);
      dispatch({ type: "DELETE_SUCCESS" });
    } catch (error) {
      dispatch({ type: "DELETE_FAIL", payload: { error: error.message } });
    }
  };

  const createCellGroup = async (zoneId, groupId, groupData) => {
    dispatch({ type: "START_CREATE" });
    try {
      await instance.put(`/attendanceRecords/${zoneId}/cellGroups/${groupId}.json`, groupData);
      dispatch({ type: "CREATE_SUCCESS" });
    } catch (error) {
      dispatch({ type: "CREATE_FAIL", payload: { error: error.message } });
    }
  };

  const deleteCellGroup = async (zoneId, groupId) => {
    dispatch({ type: "START_DELETE" });
    try {
      await instance.delete(`/attendanceRecords/${zoneId}/cellGroups/${groupId}.json`);
      dispatch({ type: "DELETE_SUCCESS" });
    } catch (error) {
      dispatch({ type: "DELETE_FAIL", payload: { error: error.message } });
    }
  };

  const saveWeeklyReport = async (reportData) => {
    dispatch({ type: "START_UPDATE" });
    try {
      await instance.patch(`/attendanceRecords/report.json`, reportData);
      dispatch({ type: "UPDATE_SUCCESS" });
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL", payload: { error: error.message } });
    }
  };

  return (
    <CellGroupContext.Provider value={{ state, dispatch, updateCellGroupData, updateZoneData, createZone, deleteZone, createCellGroup, deleteCellGroup, saveWeeklyReport }}>
      {children}
    </CellGroupContext.Provider>
  );
};

export default CellGroupStore;
