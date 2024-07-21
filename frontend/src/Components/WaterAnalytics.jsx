import React from "react";
import { Link } from "react-router-dom";
import MarketMap from "../map/MarketMap";
import "@fortawesome/fontawesome-free/css/all.css";
export default function WaterAnalytics() {
  return (
    <>
      <div className="dashboardPage">
        <div className="nav-dash">
          <div className="top-nav">
            <Link to="/Dashboard">
              <img src="src/assets/dashlogo.png" id="dashlogo" />
            </Link>
            <h1>AQUASENSE AI</h1>
            <h3>
              <Link to="/DisplayWastes" className="dashlink">
                <i className="fas fa-map-marker-alt fa-2x"></i>Waste locations
              </Link>
            </h3>
            <h3>
              <Link to="/WaterAnalytics" className="dashlink">
                <i className="fas fa-chart-line fa-2x"></i> Water Analytics
              </Link>
            </h3>
          </div>
          <button className="log-out">
            <Link to="/WaterShortages" id="log-out">
              Indicator Display Water Shortage
            </Link>
          </button>
        </div>
        <div className="map-dash">
          <MarketMap />
        </div>
      </div>
    </>
  );
}
