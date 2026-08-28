// Global fail-safe: Intercept and suppress unhandled promise rejections from sandbox WebSocket/Vite proxy
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && (event.reason.message?.includes('websocket') || event.reason.message?.includes('vite'))) {
      event.preventDefault();
      console.warn(' intercepted and neutralized unhandled sandbox WebSocket exception:', event.reason.message);
    }
  });
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

