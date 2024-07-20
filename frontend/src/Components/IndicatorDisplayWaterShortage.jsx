export default function IndicatorDisplayWaterShortage() {
  return (
    <>
      <div className="dashboardPage">
        <div className="nav-dash">
          <div className="top-nav">
            <img src="src/assets/dashlogo.png" id="dashlogo" />
            <h1>AQUASENSE AI</h1>
            <h3>
              <Link to="/DisplayWastes">Waste locations</Link>
            </h3>
            <h3>
              <Link to="/WaterAnalytics">Water Analytics</Link>
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
