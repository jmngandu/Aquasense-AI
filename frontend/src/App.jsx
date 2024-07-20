import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./Components/LoginPage";
import DashboardPage from "./Components/DashboardPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Dashboard" element={<DashboardPage />} />
      </Routes>
    </>
  );
}

export default App;
