import MarketMap from "../map/MarketMap";
import { Link } from "react-router-dom";
export default function DashboardPage() {
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
                Waste locations
              </Link>
            </h3>
            <h3>
              <Link to="/WaterAnalytics" className="dashlink">
                Water Analytics
              </Link>
            </h3>
          </div>
          <div className="botton-nav">
            <button className="log-out">
              <Link to="/" id="log-out">
                LOG OUT
              </Link>
            </button>
          </div>
        </div>
        <div className="map-dash">
          <MarketMap />
        </div>
      </div>
    </>
  );
}
