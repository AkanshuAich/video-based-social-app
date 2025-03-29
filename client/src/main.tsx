import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Log important environment information
console.log('Starting VoiceWave application...');
console.log('Environment:', import.meta.env.MODE);
console.log('Browser:', navigator.userAgent);

// Get root element and ensure it exists
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found in the document!');
} else {
  console.log('Root element found, rendering React application');
  createRoot(rootElement).render(<App />);
}

// Add unhandled error logging
window.addEventListener('error', (event) => {
  console.error('Unhandled error:', event.error);
});
