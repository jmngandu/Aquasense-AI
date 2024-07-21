import React from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.css";

export default function Account() {
  return (
    <>
      <div className="account-info">
        <i className="fas fa-user-circle fa-3x"></i>
        <div className="more-info">
          <h3>Chiyembekezo Chilembwe </h3>

          <button className="log-out">
            <Link to="/" id="log-out">
              LOG OUT
            </Link>
          </button>
        </div>
      </div>
    </>
  );
}
