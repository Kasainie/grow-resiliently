import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <App />
    </ThemeProvider>
  </StrictMode>,
);

// Register service worker for offline support and PWA functionality
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
    .then((registration) => {
      console.log('Service Worker registered successfully:', registration);
    })
    .catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
}

