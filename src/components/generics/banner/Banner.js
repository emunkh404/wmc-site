import React from "react";
import styles from "./Banner.module.css";

const Banner = () => {
  return (
    <div className={styles.banner}>
      <div className={styles.textContainer}>
        <h1>2 Timothy 2:15</h1>
        <p>Do your best to present yourself to God as one approved, a worker who does not need to be ashamed and who correctly handles the word of truth.</p>
      </div>
    </div>
  );
};

export default Banner;
