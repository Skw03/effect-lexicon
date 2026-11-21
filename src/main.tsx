import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import './styles.css';
const root = document.getElementById('root')!;
// A static host can reject aliases our portable router recognizes. Preserve its
// real 404 document during hydration and when returning to that initial URL.
const initialNotFoundPath = root.dataset.notFound === 'true' ? window.location.pathname : undefined;
const app = <React.StrictMode><BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><App initialNotFoundPath={initialNotFoundPath}/></BrowserRouter></React.StrictMode>;
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
