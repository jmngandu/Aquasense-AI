import React from "react";
import { Link } from "react-router-dom";
import MarketMap from "../map/MarketMap";
export default function WaterAnalytics() {
  return (
    <>
      <div className="dashboardPage">
        <div className="nav-dash">
          <div className="top-nav">
            <img src="src/assets/dashlogo.png" id="dashlogo" />
            <h1>AQUASENSE AI</h1>
            <h3>
              <Link to="/DisplayWastes" className="dashlink">
                Waste locations
              </Link>
            </h3>
            <h3>
              <Link to="/WaterAnalytics" className="dashlink">
                Water Analytics
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
