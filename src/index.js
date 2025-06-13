import React from "react";
import ReactDOM from "react-dom/client";
import { AuthContextProvider } from "Contexts/Toast-Context";
import { GlobalStyle } from "./GlobalStyle";   // ← добавили

import "@csstools/normalize.css";

import "bootstrap/dist/css/bootstrap.min.css";

import "index.css";

import App from "App";

import reportWebVitals from "reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
      <GlobalStyle />
    <App />
  </AuthContextProvider>
);

reportWebVitals();


