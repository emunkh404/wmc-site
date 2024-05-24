import React from "react";
import NavBarGen from "../../components/generics/navbar/NavBarGen";
import CarouselFade from "../../components/generics/carousel/CarouselFade";
import styles from "./Home.module.css";
import Banner from "../../components/generics/banner/Banner";
import FooterGen from "../../components/generics/footerGen/FooterGen";
import OurServicesCards from "../../components/customs/ourServicesCards/OurServicesCards";
import Verses from "../../components/generics/verces/Verses";

const Home = () => {
  return (
    <>
      <NavBarGen />
      <CarouselFade />
      <div className={styles.container}>        
        <Banner/>
        <OurServicesCards/>
        <Verses/>
      </div>
      <FooterGen/>
    </>
  );
};

export default Home;
