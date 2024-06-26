import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* Suppress warnings about memorization to fix later, maybe*/}
    <Provider store={store} stabilityCheck="never">
      <App />
    </Provider>
  </React.StrictMode>
);
