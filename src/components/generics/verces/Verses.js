import React, { useState, useEffect } from 'react';
import { bibleVersesData } from '../../../data/bibleVersesData';
import styles from './Verses.module.css';

const Verses = () => {
  const [verse, setVerse] = useState({});

  useEffect(() => {
    generateRandomVerse();
  }, []);

  const generateRandomVerse = () => {
    const randomIndex = Math.floor(Math.random() * bibleVersesData.length);
    setVerse(bibleVersesData[randomIndex]);
  };

  return (
    <div className={styles.verseContainer}>
      <div className={styles.verseText}>
        <p>"{verse.verse}"</p>
        <p className={styles.reference}>- {verse.reference}</p>
      </div>
      <button className={styles.newVerseButton} onClick={generateRandomVerse}>
        Give a verce!
      </button>
    </div>
  );
};

export default Verses;
