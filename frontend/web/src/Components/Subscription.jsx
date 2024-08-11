import React from "react";
import { Link } from "react-router-dom";
import MarketMap from "../map/MarketMap";
import "@fortawesome/fontawesome-free/css/all.css";
import SubscribeDetails from "./SubscribeDetails";
import logo from "../assets/logo.png";
export default function Subscription() {
  return (
    <>
      <div className="dashboardPage">
        <div className="nav-dash">
          <div className="top-nav">
            <Link to="/Dashboard">
              <img src={logo} id="dashlogo" />
            </Link>
            <h1>AQUASENSE AI</h1>
            <h3>
              <Link to="/Subscription" className="dashlink">
                <i className="fas fa-handshake fa-2x"></i>Subscription
              </Link>
            </h3>
            <h3>
              <Link to="/Dashboard" className="dashlink">
                <i className="fas fa-tachometer-alt fa-2x"></i>Dashboard
              </Link>
            </h3>
          </div>
          <button className="log-out">
            <Link to="/" id="log-out">
              LOG OUT
            </Link>
          </button>
        </div>
        <div className="map-dash">
          <SubscribeDetails />
        </div>
      </div>
    </>
  );
}
