import React, { useContext, useState } from 'react';
import { PrayerContext } from '../../contexts/prayerContext/PrayerContext';
import { UserContext } from '../../contexts/userContext/UserContext';
import { Accordion, Button, Container, Row, Col, Form, Modal, Badge, Dropdown, Alert, InputGroup } from 'react-bootstrap';
import NavBarGen from "../../components/generics/navbar/NavBarGen";
import styles from './PrayerPage.module.css';

const PrayerPage = () => {
  const { state: prayerState, createPrayerRequest, deletePrayerRequest, createComment, deleteComment, addPrayer } = useContext(PrayerContext);
  const { state: userState } = useContext(UserContext);

  const [showModal, setShowModal] = useState(false);
  const [newRequest, setNewRequest] = useState({ subject: '', description: '', dueDate: '' });
  const [newComment, setNewComment] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleCreateRequest = () => {
    if (!userState.userId) {
      setShowAlert(true);
      return;
    }

    const requestId = `request-${Date.now()}`;
    createPrayerRequest(requestId, { ...newRequest, submittedBy: userState.username, submittedByUserID: userState.userId, comments: {}, prayers: {} });
    setShowModal(false);
  };

  const handleCreateComment = (requestId) => {
    if (!userState.userId) {
      setShowAlert(true);
      return;
    }

    const commentId = `comment-${Date.now()}`;
    createComment(requestId, commentId, { author: userState.username, authorID: userState.userId, date: new Date().toISOString().split('T')[0], text: newComment });
    setNewComment('');
  };

  const handleJoinPrayer = (requestId) => {
    if (!userState.userId) {
      setShowAlert(true);
      return;
    }

    const prayerId = `prayer-${Date.now()}`;
    addPrayer(requestId, prayerId, { followerUserID: userState.userId, userName: userState.username });
  };

  const handleDeleteRequest = (requestId) => {
    deletePrayerRequest(requestId);
  };

  const handleDeleteComment = (requestId, commentId) => {
    deleteComment(requestId, commentId);
  };

  const hasUserJoined = (requestId) => {
    const prayers = prayerState.prayerRequests[requestId].prayers;
    return prayers && Object.values(prayers).some(prayer => prayer.followerUserID === userState.userId);
  };

  return (
    <>
      <NavBarGen />
      <Container className={styles.container}>
        {showAlert && (
          <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
            You must be logged in to perform this action.
          </Alert>
        )}
        <Row className="mb-4">
          <Col>
            <Button variant="outline-warning" className={styles.prayerRequestBtn} onClick={() => setShowModal(true)}>New Prayer Request</Button>
          </Col>
        </Row>
        <Accordion>
          {Object.keys(prayerState.prayerRequests || {}).map((requestId) => {
            const request = prayerState.prayerRequests[requestId];
            return (
              <Accordion.Item eventKey={requestId} key={requestId}>
                <Accordion.Header>
                  <div className={styles.headerContent}>
                    <span className={styles.requestSubject}>{request.subject}</span>                    
                    <div className={styles.dropdownToggle}>                      
                      <Dropdown>
                        <Dropdown.Toggle as="div" className={styles.dropdownToggle}>
                          <span>Praying: <Badge bg="danger" className={styles.dropdownBadge}>{Object.keys(request.prayers || {}).length}</Badge></span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {Object.values(request.prayers || {}).map((prayer, index) => (
                            <Dropdown.Item key={index}>{prayer.userName}</Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <span className={styles.date}>{request.dueDate}</span>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <div className={styles.description}>
                  <span>{request.submittedBy}: </span>
                    <span>{request.description}</span>
                  </div>
                  <div className={styles.comments}>
                    {Object.keys(request.comments || {}).map((commentId) => {
                      const comment = request.comments[commentId];
                      const commentClass = comment.authorID === userState.userId ? styles.right : styles.left;
                      return (
                        <div key={commentId} className={`${styles.comment} ${commentClass}`}>
                          <p><strong>{comment.author}</strong>: {comment.text}</p>
                          <p className={styles.date}>{comment.date}</p>
                          {(userState.role === 'admin' || userState.role === 'moderator' || userState.userId === comment.authorID) && (
                            <span className={styles.deleteButton} onClick={() => handleDeleteComment(requestId, commentId)}>x</span>
                          )}
                        </div>
                      );
                    })}
                    <InputGroup className="mb-3">
                      <Form.Control
                        placeholder="Type here"
                        aria-label="Type here"
                        aria-describedby="basic-addon2"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <Button variant="outline-primary" type="button" onClick={() => handleCreateComment(requestId)}>
                        Submit
                      </Button>
                    </InputGroup>
                  </div>
                  {!hasUserJoined(requestId) && (
                    <Button variant="outline-primary" onClick={() => handleJoinPrayer(requestId)}>Join Prayer</Button>
                  )}
                  {(userState.role === 'admin' || userState.role === 'moderator' || userState.userId === request.submittedByUserID) && (
                    <Button variant="outline-danger" onClick={() => handleDeleteRequest(requestId)}>Delete Request</Button>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Prayer Request</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Subject</Form.Label>
                <Form.Control type="text" value={newRequest.subject} onChange={(e) => setNewRequest({ ...newRequest, subject: e.target.value })} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" value={newRequest.description} onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Due Date</Form.Label>
                <Form.Control type="date" value={newRequest.dueDate} onChange={(e) => setNewRequest({ ...newRequest, dueDate: e.target.value })} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
            <Button variant="primary" onClick={handleCreateRequest}>Save</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default PrayerPage;
