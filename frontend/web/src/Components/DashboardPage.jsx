import MarketMap from "../map/MarketMap";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.css";
import Account from "./Account";
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
                <i className="fas fa-map-marker-alt fa-2x"></i>Waste locations
              </Link>
            </h3>
            <h3>
              <Link to="/WaterAnalytics" className="dashlink">
                <i className="fas fa-chart-line fa-2x"></i> Water Analytics
              </Link>
            </h3>
            <h3>
              <Link to="/Subscription" className="dashlink">
                <i className="fas fa-handshake fa-2x"></i>Subscription
              </Link>
            </h3>
          </div>
          <div className="botton-nav">
            <Account />
          </div>
        </div>
        <div className="map-dash">
          <MarketMap />
        </div>
      </div>
    </>
  );
}
