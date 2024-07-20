import { Link } from "react-router-dom";
import MarketMap from "../map/MarketMap";
export default function IndicatorDisplayWaterShortage() {
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
            <div className="botton-nav">
              <p>Indicator Display Water Shortage</p>
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
