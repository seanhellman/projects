import React from "react";
import { Container, Row } from "react-bootstrap";
import Profile from "../components/Profile.js";

const ProfileView = props => (
  <Container>
    <Row>
      <Profile />
    </Row>
  </Container>
);

export default ProfileView;
