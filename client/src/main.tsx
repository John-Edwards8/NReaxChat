import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'
import Modal from 'react-modal';
import './index.css'
import { AuthProvider } from './components/AuthProvider.tsx';
import { useErrorStore } from './stores/errorStore';
import ErrorMessage from './components/ui/ErrorMessage';

function GlobalErrorHandler() {
    const { message, variant, clearError } = useErrorStore();
  
    return (
      <ErrorMessage
        message={message}
        variant={variant}
        className="text-center font-semibold"
        onClose={clearError}
      />
    );
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