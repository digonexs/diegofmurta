import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { ProductPage } from "./ProductPage";
import "./index.css";
import "./i18n";

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/produto/:slug" element={<ProductPage />} />
    </Routes>
  </BrowserRouter>
);
