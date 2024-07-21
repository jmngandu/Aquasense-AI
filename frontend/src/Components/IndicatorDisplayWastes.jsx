import { Link } from "react-router-dom";
import MarketMap from "../map/MarketMap";
import "@fortawesome/fontawesome-free/css/all.css";
export default function IndicatorDisplayWastes() {
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
              <Link to="/Dashboard" className="dashlink">
                <i className="fas fa-tachometer-alt fa-2x"></i>Dashboard
              </Link>
            </h3>
          </div>
          <div className="botton-nav">
            <div className="botton-nav">
              <p>Indicator Display Wastes</p>
            </div>
          </div>
        </div>
        <div className="map-dash">
          <MarketMap />
        </div>
      </div>
    </>
  );
}
