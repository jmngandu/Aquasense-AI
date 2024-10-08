import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./Components/LoginPage";
import DashboardPage from "./Components/DashboardPage";
import SignUpPage from "./Components/SignUpPage";
import IndicatorDisplayWastes from "./Components/IndicatorDisplayWastes";
import IndicatorDisplayWaterShortage from "./Components/IndicatorDisplayWaterShortage";
import WaterAnalytics from "./Components/WaterAnalytics";
import Subscription from "./Components/Subscription";
import { NotFound } from "./Components/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Dashboard" element={<DashboardPage />} />
        <Route path="/SignUp" element={<SignUpPage />} />
        <Route path="/DisplayWastes" element={<IndicatorDisplayWastes />} />
        <Route path="/WaterAnalytics" element={<WaterAnalytics />} />
        <Route path="/Subscription" element={<Subscription />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/WaterShortages"
          element={<IndicatorDisplayWaterShortage />}
        />
      </Routes>
    </>
  );
}

export default App;
