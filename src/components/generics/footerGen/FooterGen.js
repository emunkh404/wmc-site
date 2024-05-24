import React from 'react';
import styles from './FooterGen.module.css';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const FooterGen = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.address}>
        <p>Church Address: 790 S Carlinspring rd, Arlington, VA, 22204</p>
      </div>
      <div className={styles.socialMedia}>
        <a href="https://www.facebook.com/yourchurch" target="_blank" rel="noopener noreferrer">
          <FaFacebook className={styles.icon} />
        </a>
        <a href="https://www.instagram.com/yourchurch" target="_blank" rel="noopener noreferrer">
          <FaInstagram className={styles.icon} />
        </a>
        <a href="https://www.youtube.com/yourchurch" target="_blank" rel="noopener noreferrer">
          <FaYoutube className={styles.icon} />
        </a>
      </div>
    </footer>
  );
};

export default FooterGen;
