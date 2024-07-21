import React from "react";
import { Link } from "react-router-dom";

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
              Continue with google
            </Link>
          </p>
          <p>Or</p>
          <p id="facebook-sign" className="log-btn">
            <Link to="/Dashboard" className="linked">
              Continue with facebook
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
