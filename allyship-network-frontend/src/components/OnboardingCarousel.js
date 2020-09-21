import React from "react";
import { Carousel } from "react-bootstrap";
import { ONBOARDING_CONTENT } from "../constants";

const ONE_MINUTE = 60000;

const OnboardingCarousel = () => {
  const carouselItems = ONBOARDING_CONTENT.map((content, index) => {
    return (
      <Carousel.Item key={`onboarding-slide-${index+1}`}>
        <img
          className="d-block w-100"
          src="https://www.solidbackgrounds.com/images/2560x1440/2560x1440-gray-solid-color-background.jpg"
          alt={`onboarding-slide-${index+1}`}
        />
        <Carousel.Caption>
          <h3>{content.heading}</h3>
          <p>{content.paragraph}</p>
        </Carousel.Caption>
      </Carousel.Item>
    );
  });
  return <Carousel interval={ONE_MINUTE}>{carouselItems}</Carousel>;
};

export default OnboardingCarousel;
