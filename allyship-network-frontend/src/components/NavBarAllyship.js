import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { MdDashboard } from "react-icons/md";
import { logout } from "../redux/actions";
import { USER_ROLE_TYPES } from "../constants";
import Earnings from "./Earnings";

const mapStateToProps = (state) => {
  const { totalRegularBonus } = state.participant;
  const { role } = state.auth;
  return { role, totalRegularBonus };
};

const handleLogout = (props) => {
  // reset redux reducers
  props.logout();
  // clear local storage
  localStorage.clear();
  // redirect to signin page
  props.history.push("/signin");
};

const NavBarAllyship = (props) => {

  return (
    <Navbar bg="light" variant="light" className="mb-4 justify-content-between">
      <Nav>
        <Nav.Link as={Link} to="/participant-dashboard">
          <MdDashboard size="2em" /> Dashboard
        </Nav.Link>
      </Nav>
      {props.role === USER_ROLE_TYPES.participant ? (
        <Navbar.Text>
          Bonuses earned | <strong>$<Earnings /></strong>
        </Navbar.Text>
      ) : (
        ""
      )}
      <Nav>
        <Nav.Link onClick={() => handleLogout(props)}>
          Logout
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default connect(mapStateToProps, { logout })(NavBarAllyship);
