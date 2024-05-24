import React, { useState, useEffect } from "react";
import { Container, Row, Col, Carousel, Pagination } from "react-bootstrap";

import instance from "../../axios-wmc-services"; // Your custom axios instance for authenticated requests

import styles from "./About.module.css"; // Import the CSS module
import NavBarGen from "../../components/generics/navbar/NavBarGen";

const About = () => {
  const [images, setImages] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const imagesPerPage = 3;

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await instance.get("/s3-bucket-url");
      const imageUrls = response.data; // Assuming response.data is an array of image URLs
      setImages(imageUrls);
      setTotalPages(Math.ceil(imageUrls.length / imagesPerPage));
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const paginatedImages = images.slice(
    (activePage - 1) * imagesPerPage,
    activePage * imagesPerPage
  );

  return (
    <>
      <NavBarGen />
      <Container className={styles.container}>
        <Row>
          <Col>
            <h1 className={styles.header}>WMC History</h1>
            <p className={styles.text}>
              Welcome to the WMC History page. Here we share the story of our
              journey, our milestones, and the incredible experiences that have
              shaped our community.
            </p>
            <p className={styles.text}>
              Founded in 2003, WMC has grown from a small local group into a
              vibrant community of thousands. Our mission is to support and
              empower individuals through various programs, events, and
              initiatives.
            </p>
            <p className={styles.text}>
              We are proud of our rich history and the countless lives we have
              touched over the years. Join us as we continue to make a positive
              impact in the world.
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Carousel>
              {paginatedImages.map((image, index) => (
                <Carousel.Item key={index}>
                  <img
                    className={`d-block w-100 ${styles.carouselImage}`}
                    src={image}
                    alt={`Slide ${index + 1}`}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <Pagination>
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === activePage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default About;
