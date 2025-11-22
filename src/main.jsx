import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/index.scss";
import App from "./app/App.jsx";
import { BrowserRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";

const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.classList.toggle("dark", savedTheme === "dark");

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <BrowserRouter>
      {/* <StrictMode> */}
      <App />
      {/* </StrictMode> */}
    </BrowserRouter>
  </HelmetProvider>
);
