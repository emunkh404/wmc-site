import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import styles from "./VideoCarousel.module.css";

const VideoCarousel = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numVisibleVideos, setNumVisibleVideos] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

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
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    setIsPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data.length - 1 : prevIndex - 1
    );
    setIsPlaying(false);
  };

  const handleVideoClick = (index) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const getVideoIndex = (index) => {
    return (currentIndex + index + data.length) % data.length;
  };

  const visibleVideos = Array.from({ length: numVisibleVideos }, (_, i) => {
    const videoIndex = getVideoIndex(i - Math.floor(numVisibleVideos / 2));
    const videoClass =
      videoIndex === currentIndex
        ? isPlaying
          ? styles.bigPlaying
          : styles.big
        : i === Math.floor(numVisibleVideos / 2) - 1 || i === Math.floor(numVisibleVideos / 2) + 1
        ? styles.medium
        : styles.small;

    // Update URL to use privacy-enhanced mode
    const videoUrl = data[videoIndex].videoUrl.replace("www.youtube.com", "www.youtube-nocookie.com");

    return (
      <div
        key={i}
        className={`${styles.videoWrapper} ${videoClass}`}
        onClick={() => handleVideoClick(videoIndex)}
      >
        <iframe
          src={videoUrl}
          title={`Video ${videoIndex}`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={videoIndex === currentIndex ? styles.activeVideo : styles.inactiveVideo}
          onPlay={handlePlay}
          onPause={handlePause}
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
        {currentIndex + 1} / {data.length}
      </div>
    </Container>
  );
};

export default VideoCarousel;
