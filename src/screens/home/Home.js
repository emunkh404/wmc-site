import React from "react";
import styles from "./Home.module.css";
import NavBarGen from "../../components/generics/navbar/NavBarGen";

export default function Home() {
  return (
    <div className={styles.container}>
      <NavBarGen />
    </div>
  );
}
