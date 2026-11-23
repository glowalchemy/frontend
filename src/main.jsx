import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchBanners } from './api/catalog';

// Kick off the hero-banner request before React mounts: the hero image is the
// LCP element, and starting URL discovery ~100ms earlier shortens the whole
// API -> image chain. Only on the homepage, and failures are ignored (the
// slider fetches again if this attempt never resolved).
if (typeof window !== 'undefined' && window.location.pathname === '/') {
  fetchBanners({ position: 'home_hero' }).catch(() => {});
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      className="toast-container"
      toastClassName="toast-item"
      bodyClassName="toast-body"
    />
  </React.StrictMode>
);
