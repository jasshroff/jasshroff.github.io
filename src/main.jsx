import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'

if (!window.__vite__injectQuery) {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <HelmetProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </HelmetProvider>
    </StrictMode>
  );
} else {
  console.warn('Duplicate __vite__injectQuery detected, skipping render to avoid error');
}
