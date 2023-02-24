import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { SnackbarProvider } from 'notistack';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <SnackbarProvider>
        <App />
    </SnackbarProvider>
);
