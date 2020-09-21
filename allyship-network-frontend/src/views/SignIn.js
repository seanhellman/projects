import React, { useState } from "react";
import { signIn, getDashboard, getParticipantInfo } from "../utils/fetch";
import { Alert } from "react-bootstrap";
import { useDispatch, connect } from "react-redux";
import { setAuthLoading, setAuth, setParticipantInfo } from "../redux/actions";

const mapStateToProps = (state) => {
  const { completeConsentForm } = state.participant;
  return { completeConsentForm };
};

const SignIn = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const dispatch = useDispatch();

  const handleInput = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(setAuthLoading(true));
    signIn(username, password)
      .then((data) => {
        if (!data || !data.access_token) {
          setShowAlert(true);
        } else {
          let userToken = data.access_token;
          getDashboard(username, userToken).then((data) => {
            data = data[0];
            if (!data || data.length === 0 || !data.user_role.user_role_desc) {
              setShowAlert(true);
            } else {
              let userRole = data.user_role.user_role_desc;
              let userId = data.id;
              dispatch(setAuth(userToken, username, userRole, userId));
              if (userRole === "admin") {
                props.history.push("/admin-dashboard");
              } else if (userRole === "monitor") {
                props.history.push("/moderator-dashboard");
              } else if (userRole === "participant") {
                getParticipantInfo(userId, userToken).then((data) => {
                  props.setParticipantInfo(data[0]);
                  const completeConsentForm = data[0].complete_consent_form;
                  const path = completeConsentForm
                    ? "/participant-dashboard"
                    : "/participant-dashboard/consent-form";
                  props.history.push(path);
                });
              }
            }
          });
          // window.location.reload();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="sign-in">
      <div className="header-image"></div>
      <h1 className="header-title">Sign In</h1>
      <form onSubmit={handleSubmit}>
        {showAlert && (
          <Alert variant="danger" className="alert-font">
            The username and password doesn't match or exist.
          </Alert>
        )}
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            autoComplete="username"
            value={username}
            onChange={handleInput}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            autoComplete="password"
            value={password}
            onChange={handleInput}
          />
        </div>
        <div className="form-group">
          <input type="submit" value="Sign In" />
        </div>
      </form>
    </div>
  );
};

export default connect(mapStateToProps, { setParticipantInfo })(SignIn);
