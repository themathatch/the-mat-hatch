import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        {/* Custom Styled Toaster for Dark Purple & Neon Cyan Theme */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#130C25',
              color: '#FFFFFF',
              border: '1px solid #2A1F45',
            },
            success: {
              iconTheme: {
                primary: '#00F0FF',
                secondary: '#130C25',
              },
            },
            error: {
              iconTheme: {
                primary: '#FF0055',
                secondary: '#130C25',
              },
            },
          }}
        />
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);