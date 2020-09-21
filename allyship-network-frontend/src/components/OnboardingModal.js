import React from "react";
import { Modal } from "react-bootstrap";
import OnboardingCarousel from "./OnboardingCarousel";

const OnboardingModal = (props) => {
  return (
    <Modal show={props.show} onHide={() => props.close()}>
      <Modal.Header closeButton>
        <Modal.Title>Modal title</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <OnboardingCarousel />
      </Modal.Body>
    </Modal>
  );
};

export default OnboardingModal;