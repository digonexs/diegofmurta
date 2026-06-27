import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n";

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

createRoot(document.getElementById("root")!).render(<App />);
