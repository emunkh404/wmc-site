import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import LazyLoad from "react-lazyload";
import NavBarGen from "../../components/generics/navbar/NavBarGen";
import { worshipSongsData } from "../../data/videosData";
import styles from "./WorshipSongs.module.css";

const WorshipSongs = () => {
  return (
    <>
      <NavBarGen />
      <Container className={styles.container}>
        <h1 className={styles.header}>Worship Songs</h1>
        <Row>
          {worshipSongsData.map((song, index) => (
            <Col md={6} lg={4} key={index} className="mb-4">
              <LazyLoad height={200} offset={100}>
                <Card>
                  <Card.Body>
                    <Card.Title>{song.title}</Card.Title>
                    <div className={styles.videoWrapper}>
                      <iframe
                        width="100%"
                        height="315"
                        src={song.videoUrl}
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={song.title}
                      ></iframe>
                    </div>
                  </Card.Body>
                </Card>
              </LazyLoad>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default WorshipSongs;
