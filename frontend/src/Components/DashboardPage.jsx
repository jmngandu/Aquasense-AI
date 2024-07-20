import MarketMap from "../map/MarketMap";
import { Link } from "react-router-dom";
export default function DashboardPage() {
  return (
    <>
      <div className="dashboardPage">
        <div className="nav-dash">
          <div className="top-nav">
            <h1>AQUASENSE AI</h1>
            <h3>Waste locations</h3>
            <h3>Water Analytics</h3>
          </div>
          <div className="botton-nav">
            <button>
              <Link to="/" className="log-out">
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
