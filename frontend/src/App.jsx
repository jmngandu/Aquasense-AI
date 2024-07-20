import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./Components/LoginPage";
import DashboardPage from "./Components/DashboardPage";
import SignUpPage from "./Components/SignUpPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Dashboard" element={<DashboardPage />} />
        <Route path="/SignUp" element={<SignUpPage />} />
      </Routes>
    </>
  );
}

export default App;
