import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { videoData } from "../../data/videosData"; // Ensure this file contains your video data
import styles from "./WorshipSongs.module.css";

const VideoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numVisibleVideos, setNumVisibleVideos] = useState(1);

  const updateNumVisibleVideos = () => {
    const width = window.innerWidth;
    if (width < 768) {
      setNumVisibleVideos(1);
    } else if (width < 1200) {
      setNumVisibleVideos(3);
    } else {
      setNumVisibleVideos(5);
    }
  };

  useEffect(() => {
    updateNumVisibleVideos();
    window.addEventListener('resize', updateNumVisibleVideos);
    return () => window.removeEventListener('resize', updateNumVisibleVideos);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videoData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? videoData.length - 1 : prevIndex - 1
    );
  };

  const getVideoIndex = (index) => {
    return (currentIndex + index + videoData.length) % videoData.length;
  };

  const visibleVideos = Array.from({ length: numVisibleVideos }, (_, i) => {
    const videoClass =
      i === Math.floor(numVisibleVideos / 2)
        ? styles.big
        : i === Math.floor(numVisibleVideos / 2) - 1 || i === Math.floor(numVisibleVideos / 2) + 1
        ? styles.medium
        : styles.small;

    return (
      <div
        key={i}
        className={`${styles.videoWrapper} ${videoClass}`}
        onClick={() => {
          if (i === 0) prevSlide();
          else if (i === numVisibleVideos - 1) nextSlide();
        }}
      >
        <iframe
          src={videoData[getVideoIndex(i - Math.floor(numVisibleVideos / 2))].videoUrl}
          title={`Video ${i}`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={i === Math.floor(numVisibleVideos / 2) ? styles.activeVideo : styles.inactiveVideo}
        ></iframe>
      </div>
    );
  });

  return (
    <Container className={styles.container}>
      <div className={styles.carousel}>
        <button className={styles.navButton} onClick={prevSlide}>&lt;</button>
        {visibleVideos}
        <button className={styles.navButton} onClick={nextSlide}>&gt;</button>
      </div>
      <div className={styles.indicator}>
        {currentIndex + 1} / {videoData.length}
      </div>
    </Container>
  );
};

export default VideoCarousel;