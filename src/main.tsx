import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "react-photo-view/dist/react-photo-view.css";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@store";
import { PhotoProvider } from "react-photo-view";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ReduxProvider store={store}>
        <PhotoProvider>
          <App />
        </PhotoProvider>
      </ReduxProvider>
    </BrowserRouter>
  </React.StrictMode>
);
