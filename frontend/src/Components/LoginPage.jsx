import React from "react";

export default function LoginPage() {
  return (
    <>
      <div className="LoginPage">
        <h1>AQUASENSE AI</h1>
        <form className="form-section">
          <div className="email-sect group-log">
            <h3 className="input-title">Email</h3>
            <input
              type="email"
              placeholder="Gmail account"
              name="email"
              className="input"
              id="input-email"
            />
          </div>
          <div className="password-sect group-log">
            <h3 className="input-title">Password</h3>
            <input
              type="password"
              placeholder="password"
              name="password"
              className="input"
              id="input-password"
            />
          </div>

          <div className="register-input">
            <button id="login-btn" className="log-btn">
              Login
            </button>
            <button className="log-btn">Register</button>
          </div>
        </form>
      </div>
    </>
  );
}
