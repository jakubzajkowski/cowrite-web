import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryProvider } from './lib/query';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>
);
