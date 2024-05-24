import React from 'react';
import { cardsData } from '../../../data/cardsData';
import styles from './OurServicesCards.module.css';

const OurServicesCards = () => {
  return (
    <div className={styles.cardsContainer}>
      {cardsData.map((card, index) => (
        <div className={styles.card} key={index}>
          <img src={card.image} alt={card.title} className={styles.cardImage} />
          <div className={styles.cardContent}>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <a href={card.link} className={styles.cardLink}>View More</a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OurServicesCards;
