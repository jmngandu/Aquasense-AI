import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SubscribeDetails() {
  const subscribe = () => toast("Subscribed!");

  const currentp = () => toast("More features added!");

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
            <div className="upper-sub-sect">
              <h3>Free tier</h3>
              <h1>
                $0<small className="small">/month</small>
              </h1>
              <ul>
                <li>Acces to user waste locations</li>
              </ul>
            </div>
            <div className="lower-sub-sect">
              <button onClick={subscribe} className="sub-btns">
                <Link to="/Subscription" id="subscribe-btn sub-btn">
                  Subscribe
                </Link>
              </button>
              <ToastContainer />
            </div>
          </div>
          <div className="right-sub-page sub-pages">
            <div className="upper-sub-sect">
              <h3>Monthly Subscription</h3>
              <h1>
                $100<small className="small">/month</small>
              </h1>
              <ul>
                <li>Acces to user waste locations</li>
                <li>Access to AI insights on waste locations</li>
                <li>Access to AI powered water analytics</li>
              </ul>
            </div>
            <div className="lower-sub-sect">
              <button onClick={currentp} className="sub-btns">
                <Link to="/Subscription" id="currentp-btn sub-btn">
                  Current Plan
                </Link>
              </button>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
