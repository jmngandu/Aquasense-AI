export default function SubscribeDetails() {
  return (
    <>
      <div className="subscription-page">
        <div className="top-sub-panel">
          <h2>Subscription</h2>
          <div className="sub-nav">
            <button className="sub-btn">For individuals</button>
            <button className="sub-btn">For companies</button>
          </div>
        </div>
        <div className="botton-sub-panel">
          <div className="left-sub-page sub-pages">
            <h3>individuals</h3>
            <h1>
              $0<small className="small">/month</small>
            </h1>
          </div>
          <div className="right-sub-page sub-pages">
            <h3>companies</h3>
            <h1>
              $100<small className="small">/month</small>
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
