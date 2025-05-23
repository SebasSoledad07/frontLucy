import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import { ClienteProvider } from './Context/ClienteContext';
import { AuthProvider } from './Context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ClienteProvider>
          <App />
        </ClienteProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
