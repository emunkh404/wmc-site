import React, { useContext, useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Table,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CellGroupContext } from "../../contexts/cellGroupContext/CellGroupContext";
import { UserContext } from "../../contexts/userContext/UserContext";
import instance from "../../axios-wmc-services";
import NavBarGen from "../../components/generics/navbar/NavBarGen";
import AttendanceChart from "../../components/customs/attendanceChart/AttendanceChart";
import styles from "./CellGroupManager.module.css";

const CellGroupManager = () => {
  const {
    state: cellGroupState,
    dispatch,
    deleteZone,
    deleteCellGroup,
    updateCellGroupData,
    updateZoneData,
    saveWeeklyReport,
  } = useContext(CellGroupContext);
  const { state: userState } = useContext(UserContext);
  const navigate = useNavigate();

  const [selectedZoneDelete, setSelectedZoneDelete] = useState([]);
  const [selectedGroupDelete, setSelectedGroupDelete] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editField, setEditField] = useState(null);
  const [attendanceData, setAttendanceData] = useState({
    labels: [],
    data: [],
  });

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    calculateSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellGroupState.zones]);

  const calculateSummary = () => {
    let totalMembers = 0;
    let totalAttendance = 0;
    let labels = [];
    let data = [];

    if (cellGroupState.zones) {
      Object.keys(cellGroupState.zones).forEach((zoneKey) => {
        if (zoneKey !== "report") {
          const zone = cellGroupState.zones[zoneKey];
          if (zone.cellGroups) {
            Object.keys(zone.cellGroups).forEach((groupKey) => {
              const group = zone.cellGroups[groupKey];
              totalMembers += parseInt(group.totalMembers || 0, 10);
              totalAttendance += parseInt(group.attendance?.thisWeek || 0, 10);
            });
          }
        }
      });

      const report = cellGroupState.zones.report || {};
      const weeklyAttendance = report.weeklyAttendance || {};

      labels = Object.keys(weeklyAttendance);
      data = Object.values(weeklyAttendance);
    }

    setAttendanceData({ labels, data });

    if (cellGroupState.zones && cellGroupState.zones.report) {
      cellGroupState.zones.report.totalMembers = totalMembers;
      cellGroupState.zones.report.totalAttendance = totalAttendance;
    }
  };

  const handleDeleteSelected = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    for (const zoneId of selectedZoneDelete) {
      await handleDeleteZone(zoneId);
    }
    for (const [zoneId, groupId] of selectedGroupDelete) {
      await handleDeleteCellGroup(zoneId, groupId);
    }
    setSelectedZoneDelete([]);
    setSelectedGroupDelete([]);
    refreshData();
  };

  const handleDeleteZone = async (zoneId) => {
    try {
      await deleteZone(zoneId);
      setSelectedZoneDelete(selectedZoneDelete.filter((id) => id !== zoneId));
    } catch (error) {
      console.error("Error deleting zone:", error);
    }
  };

  const handleDeleteCellGroup = async (zoneId, groupId) => {
    try {
      await deleteCellGroup(zoneId, groupId);
      setSelectedGroupDelete(
        selectedGroupDelete.filter(
          ([zId, gId]) => zId !== zoneId || gId !== groupId
        )
      );
    } catch (error) {
      console.error("Error deleting cell group:", error);
    }
  };

  const handleInlineEdit = async (zoneId, groupId, field, value) => {
    let updatedGroupData = {
      ...cellGroupState.zones[zoneId].cellGroups[groupId],
    };
    if (field.includes("attendance")) {
      updatedGroupData.attendance = {
        ...updatedGroupData.attendance,
        [field.split(".")[1]]: value,
      };
    } else {
      updatedGroupData[field] = value;
    }

    await updateCellGroupData(zoneId, groupId, updatedGroupData);
    setEditField(null);
    refreshData();
  };

  const handleZoneInlineEdit = async (zoneId, field, value) => {
    const updatedZoneData = { ...cellGroupState.zones[zoneId], [field]: value };
    await updateZoneData(zoneId, updatedZoneData);
    setEditField(null);
    refreshData();
  };

  const handleZoneCheckboxChange = (zoneId) => {
    setSelectedZoneDelete((prev) =>
      prev.includes(zoneId)
        ? prev.filter((id) => id !== zoneId)
        : [...prev, zoneId]
    );
  };

  const handleGroupCheckboxChange = (zoneId, groupId) => {
    setSelectedGroupDelete((prev) =>
      prev.some(([zId, gId]) => zId === zoneId && gId === groupId)
        ? prev.filter(([zId, gId]) => zId !== zoneId || gId !== groupId)
        : [...prev, [zoneId, groupId]]
    );
  };

  const refreshData = async () => {
    try {
      const response = await instance.get("/attendanceRecords.json");
      dispatch({ type: "FETCH_SUCCESS", payload: { zones: response.data } });
    } catch (error) {
      dispatch({ type: "FETCH_FAIL", payload: { error: error.message } });
    }
  };

  const renderEditableField = (zoneId, groupId, field, value) => {
    const isEditable =
      userState.role === "admin" ||
      userState.role === "moderator" ||
      (field === "attendance.thisWeek" &&
        (cellGroupState.zones[zoneId].cellGroups[groupId].leaderId ===
          userState.userId ||
          cellGroupState.zones[zoneId].cellGroups[groupId].assistantId ===
            userState.userId));

    if (
      isEditable &&
      editField &&
      editField.zoneId === zoneId &&
      editField.groupId === groupId &&
      editField.field === field
    ) {
      return (
        <input
          type="text"
          defaultValue={value}
          onBlur={(e) =>
            handleInlineEdit(zoneId, groupId, field, e.target.value)
          }
          autoFocus
        />
      );
    } else if (isEditable) {
      return (
        <span onClick={() => setEditField({ zoneId, groupId, field })}>
          {value}
        </span>
      );
    } else {
      return <span>{value}</span>;
    }
  };

  const renderZoneEditableField = (zoneId, field, value) => {
    const isEditable =
      userState.role === "admin" || userState.role === "moderator";

    if (
      isEditable &&
      editField &&
      editField.zoneId === zoneId &&
      editField.field === field
    ) {
      return (
        <input
          type="text"
          defaultValue={value}
          onBlur={(e) => handleZoneInlineEdit(zoneId, field, e.target.value)}
          autoFocus
        />
      );
    } else if (isEditable) {
      return (
        <span onClick={() => setEditField({ zoneId, field })}>{value}</span>
      );
    } else {
      return <span>{value}</span>;
    }
  };

  const handleSaveWeeklyReport = async () => {
    try {
      const date = new Date().toISOString().split("T")[0];
      const report = {
        totalMembers: cellGroupState.zones.report.totalMembers,
        weeklyAttendance: {
          ...cellGroupState.zones.report.weeklyAttendance,
          [date]: cellGroupState.zones.report.totalAttendance,
        },
      };
      await saveWeeklyReport(report);
      refreshData();
    } catch (error) {
      console.error("Error saving weekly report:", error);
    }
  };

  return (
    <>
      <NavBarGen />
      <Container className={styles.container}>
        <h1>
          Total Members:{" "}
          {renderZoneEditableField(
            "report",
            "totalMembers",
            cellGroupState.zones?.report?.totalMembers
          )}
        </h1>
        <h2>This Week: {cellGroupState.zones?.report?.totalAttendance}</h2>
        {cellGroupState.error && (
          <Alert variant="danger">{cellGroupState.error}</Alert>
        )}
        {cellGroupState.loading && <Alert variant="info">Loading...</Alert>}
        <Row className="mb-4">
          <Col>
            {cellGroupState.zones &&
              Object.keys(cellGroupState.zones)
                .filter((key) => key !== "report")
                .map((zoneKey, index) => (
                  <div
                    key={zoneKey}
                    className={styles.zoneContainer}
                    style={{ backgroundColor: index % 2 ? "#f0f0f0" : "#ffffff" }}
                  >
                    <h4>
                      <Form.Check
                        type="checkbox"
                        inline
                        className="me-2"
                        checked={selectedZoneDelete.includes(zoneKey)}
                        onChange={() => handleZoneCheckboxChange(zoneKey)}
                      />
                      Zone:{" "}
                      {renderZoneEditableField(
                        zoneKey,
                        "zoneName",
                        cellGroupState.zones[zoneKey].zoneName
                      )}{" "}
                      Leader:{" "}
                      {renderZoneEditableField(
                        zoneKey,
                        "zoneLeader",
                        cellGroupState.zones[zoneKey].zoneLeader
                      )}
                    </h4>
                    <Table striped bordered hover className={styles.table}>
                      <thead>
                        <tr>
                          <th></th>
                          <th>Cell Group</th>
                          <th>Location</th>
                          <th>Leader</th>
                          <th>Assistant</th>
                          <th>Members</th>
                          <th>Attendance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cellGroupState.zones[zoneKey].cellGroups &&
                          Object.keys(
                            cellGroupState.zones[zoneKey].cellGroups
                          ).map((groupKey) => {
                            const group =
                              cellGroupState.zones[zoneKey].cellGroups[
                                groupKey
                              ];
                            return (
                              <tr key={groupKey}>
                                <td>
                                  <Form.Check
                                    type="checkbox"
                                    inline
                                    className="me-2"
                                    checked={selectedGroupDelete.some(
                                      ([zId, gId]) =>
                                        zId === zoneKey && gId === groupKey
                                    )}
                                    onChange={() =>
                                      handleGroupCheckboxChange(
                                        zoneKey,
                                        groupKey
                                      )
                                    }
                                  />
                                </td>
                                <td data-label="Cell Group">
                                  {renderEditableField(
                                    zoneKey,
                                    groupKey,
                                    "name",
                                    group.name
                                  )}
                                </td>
                                <td data-label="Location">
                                  {renderEditableField(
                                    zoneKey,
                                    groupKey,
                                    "location",
                                    group.location
                                  )}
                                </td>
                                <td data-label="Leader">
                                  {renderEditableField(
                                    zoneKey,
                                    groupKey,
                                    "leader",
                                    group.leader
                                  )}
                                </td>
                                <td data-label="Assistant">
                                  {renderEditableField(
                                    zoneKey,
                                    groupKey,
                                    "assistant",
                                    group.assistant
                                  )}
                                </td>
                                <td data-label="Members">
                                  {renderEditableField(
                                    zoneKey,
                                    groupKey,
                                    "totalMembers",
                                    group.totalMembers || 0
                                  )}
                                </td>
                                <td data-label="Attendance">
                                  {renderEditableField(
                                    zoneKey,
                                    groupKey,
                                    "attendance.thisWeek",
                                    group.attendance?.thisWeek || 0
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  </div>
                ))}
          </Col>
        </Row>
        {(userState.role === "admin" || userState.role === "moderator") && (
          <>
            <Row className="mb-4">
              <Col>
                <Button
                  variant="success"
                  className="me-2"
                  onClick={() => navigate("/create-zone")}
                >
                  Create New Zone
                </Button>
                <Button
                  variant="primary"
                  onClick={() => navigate("/create-cell-group")}
                >
                  Create New Cell Group
                </Button>
                <Button
                  variant="danger"
                  className="ms-2"
                  onClick={handleDeleteSelected}
                >
                  Delete Selected
                </Button>
                <Button
                  variant="primary"
                  className="ms-2"
                  onClick={handleSaveWeeklyReport}
                >
                  Save Weekly Report
                </Button>
              </Col>
            </Row>
          </>
        )}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete the selected zones and cell groups?
            This action cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
        <AttendanceChart data={attendanceData} />
      </Container>
    </>
  );
};

export default CellGroupManager;
