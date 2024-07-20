import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";

export default function SignUpPage() {
  const iconStyle = {
    color: "blue",
  };
  return (
    <>
      <div className="sign-up">
        <div className="top-sign">
          <img src="src/assets/logo.png" id="log-logo" />
          <h1 id="log-title">AQUASENSE AI</h1>
        </div>

        <div className="botton-sign">
          <p id="google-sign" className="log-btn">
            <Link to="/Dashboard" className="linked">
              <FontAwesomeIcon
                icon={faGoogle}
                style={{ ...iconStyle, color: "green" }}
                className="sign-icon"
              />
              Continue with google
            </Link>
          </p>
          <p>Or</p>
          <p id="facebook-sign" className="log-btn">
            <Link to="/Dashboard" className="linked">
              <FontAwesomeIcon
                icon={faFacebook}
                style={{ color: "blue" }}
                className="sign-icon"
              />
              Continue with facebook
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
