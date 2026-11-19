import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Library } from './pages/Library';
import { EffectDetail } from './pages/EffectDetail';
import { NotFound } from './pages/NotFound';
import './styles.css';
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
  <a className="skip-link" href="#main">跳到主要内容</a>
  <header><div className="shell"><Link className="brand" to="/">动效词典 <span lang="en">Effect Lexicon</span></Link><span className="muted">看见效果，说清动效</span></div></header>
  <main id="main" className="shell"><Routes><Route path="/" element={<Library/>}/><Route path="/effects/:slug" element={<EffectDetail/>}/><Route path="*" element={<NotFound/>}/></Routes></main>
  <footer className="shell">动效词典 · 用真实演示，连接视觉与表达。</footer>
</BrowserRouter></React.StrictMode>);
