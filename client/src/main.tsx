import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'
import Modal from 'react-modal';
import './index.css'
import { AuthProvider } from './components/AuthProvider.tsx';
import ErrorMessage from './components/ui/ErrorMessage';

function GlobalErrorHandler() {
  return <ErrorMessage />;
}

Modal.setAppElement('#root');

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
        <GlobalErrorHandler />
    </React.StrictMode>
);