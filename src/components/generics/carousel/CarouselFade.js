import React from "react";
import { Carousel } from "react-bootstrap";
import { carouselData } from "../../../data/carouselData";
import styles from "./CarouselFade.module.css";

const CarouselFade = () => {
  return (
    <Carousel fade>
      {carouselData.map((slide, index) => (
        <Carousel.Item key={index}>
          <div
            className={styles.imageWrapper}
            style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/${slide.image})` }}
          >
            <div className={styles.textOverlay}>
              <h3>{slide.text}</h3>
            </div>
          </div>
          <Carousel.Caption className={styles.carouselCaption}>
            <h3>{slide.label}</h3>
            <p>{slide.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CarouselFade;
