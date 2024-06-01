import React, { useState } from "react";
import { Container, Row, Col, ButtonGroup, Button } from "react-bootstrap";
import VideoCarousel from "./VideoCarousel";
import {
  anniversarySongs,
  otherData,
  eastCoastData, 
  missionData,
} from "../../data/videosData"; // Ensure this file contains your video data
import NavBarGen from "../../components/generics/navbar/NavBarGen";
import FooterGen from "../../components/generics/footerGen/FooterGen";

const categories = [
  { name: "Mission Songs", data: missionData },
  { name: "Anniversary Songs", data: anniversarySongs },
  { name: "Conference Songs", data: eastCoastData },  
  { name: "Other Songs", data: otherData },
];

const VideoCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  return (
    <>
    <NavBarGen/>
    <Container>
      <Row className="my-3">
        <Col>
          <ButtonGroup>
            {categories.map((category, index) => (
              <Button
                key={index}
                onClick={() => setSelectedCategory(category)}
                variant={
                  selectedCategory.name === category.name
                    ? "outline-primary"
                    : "outline-info"
                }
              >
                {category.name}
              </Button>
            ))}
          </ButtonGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <VideoCarousel data={selectedCategory.data} />
        </Col>
      </Row>
    </Container>
    <FooterGen/>
    </>
  );
};

export default VideoCategories;
