import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Guide } from './pages/Guide';
import { Library } from './pages/Library';
import { EffectDetail } from './pages/EffectDetail';
import { NotFound } from './pages/NotFound';
import './styles.css';
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
  <a className="skip-link" href="#main">跳到主要内容</a>
  <header><div className="shell"><Link className="brand" to="/">动效词典 <span lang="en">Effect Lexicon</span></Link><nav aria-label="主导航"><Link to="/guide">描述指南</Link></nav></div></header>
  <main id="main" className="shell"><Routes><Route path="/" element={<Library/>}/><Route path="/effects/:slug" element={<EffectDetail/>}/><Route path="/guide" element={<Guide/>}/><Route path="*" element={<NotFound/>}/></Routes></main>
  <footer className="shell"><span>动效词典 · 用真实演示，连接视觉与表达。</span><Link to="/guide">描述指南</Link></footer>
</BrowserRouter></React.StrictMode>);
