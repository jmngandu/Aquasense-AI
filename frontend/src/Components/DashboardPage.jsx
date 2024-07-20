import MarketMap from "../map/MarketMap";
export default function DashboardPage() {
  return (
    <>
      <div className="dashboardPage">
        <div className="nav-dash">
          <h1>AQUASENSE AI</h1>
          <h3>Waste locations</h3>
          <h3>Water Analytics</h3>
        </div>
        <div className="map-dash">
          <MarketMap />
        </div>
      </div>
    </>
  );
}
