import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'
import Modal from 'react-modal';
import './index.css'
import { AuthProvider } from './components/AuthProvider.tsx';
import ErrorMessage from './components/ui/ErrorMessage';
import { I18nProvider } from './i18n/I18nContext.tsx';

function GlobalErrorHandler() {
  return <ErrorMessage />;
}

Modal.setAppElement('#root');

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <I18nProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
            <GlobalErrorHandler />
        </I18nProvider>
    </React.StrictMode>
);