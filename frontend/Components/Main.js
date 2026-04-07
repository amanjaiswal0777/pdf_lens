import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dragdrop from "./Dragdrop";
import "./style.css";

const LOGO_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Main = ({ setToken }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    window.sessionStorage.removeItem("token");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("authToken");
    setToken(null);
    navigate("/login");
  };

  return (
    <div className="page-wrapper">
      <div className="orb orb--purple" />
      <div className="orb orb--blue" />
      <div className="orb orb--violet" />
      <div className="grid-overlay" />

      <div className="card main-card">
        <div className="main-card__topbar">
          <div className="logo">
            <div className="logo__icon">{LOGO_ICON}</div>
            <span className="logo__name">PDF_Lens</span>
          </div>

          <button type="button" className="link-btn link-btn--accent" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="heading-block">
          <h1>PDF Lens AI</h1>
          <p>Upload a PDF to generate a summary and keywords.</p>
        </div>

        <div className="main-section">
          <Dragdrop setResult={setResult} setLoading={setLoading} />
        </div>

        {loading && (
          <div className="main-status">
            <span className="spinner" />
            <p>Processing PDF...</p>
          </div>
        )}

        {result && (
          <div className="result main-result">
            <h2>Summary</h2>
            <p>{result.summary}</p>

            <h2>Keywords</h2>
            <div className="keywords">
              {result.keywords.map((k, i) => (
                <span key={i}>{k}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
