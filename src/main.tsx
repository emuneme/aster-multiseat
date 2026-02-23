/// <reference types="vite-plugin-pwa/client" />
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary';
import './index.css'

import { registerSW } from 'virtual:pwa-register';

// Register Service Worker explicitly for the PWA
registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HelmetProvider>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </HelmetProvider>
    </React.StrictMode>,
)
