import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/index.scss";
import App from "./app/App.jsx";
import { BrowserRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.classList.toggle("dark", savedTheme === "dark");
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 10_000,      
      gcTime: 30 * 60 * 1000,
    },
  },
})


createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {/* <StrictMode> */}
          <App />
        {/* </StrictMode> */}
      </QueryClientProvider>
    </BrowserRouter>
  </HelmetProvider>
);
