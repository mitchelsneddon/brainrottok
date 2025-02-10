import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";

fetch("/config.json")
  .then((res) => res.json())
  .then((config) => {
    window.REACT_APP_CONFIG = config;

    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    reportWebVitals();
  })
  .catch((error) => {
    console.error("Failed to load config.json", error);
  });
