import React from "react";
import styles from "./ExampleCarouselImage.module.css";

const ExampleCarouselImage = ({ text, image }) => {
  return (
    <div
      className={styles.imageWrapper}
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/${image})` }}
    >
      <div className={styles.textOverlay}>
        <h3>{text}</h3>
      </div>
    </div>
  );
};

export default ExampleCarouselImage;
