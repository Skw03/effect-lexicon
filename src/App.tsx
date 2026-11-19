import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Guide } from './pages/Guide';
import { Library } from './pages/Library';
import { EffectDetail } from './pages/EffectDetail';
import { NotFound } from './pages/NotFound';
import { site } from './release/config';
import { Metadata } from './release/Metadata';
import { canonicalPath } from './release/path-policy.mjs';
import { routes } from './release/metadata';
export function App() {
  const location = useLocation();
  const path = canonicalPath(location.pathname, routes);
  return <><Metadata/>
  <a className="skip-link" href="#main">跳到主要内容</a>
  <header><div className="shell"><Link className="brand" to="/">动效词典 <span lang="en">Effect Lexicon</span></Link><nav aria-label="主导航"><Link to="/guide">描述指南</Link></nav></div></header>
  <main id="main" className="shell">{path ? <Routes location={{ ...location, pathname: path }}><Route path="/" element={<Library/>}/><Route path="/effects/:slug" element={<EffectDetail/>}/><Route path="/guide" element={<Guide/>}/><Route path="*" element={<NotFound/>}/></Routes> : <NotFound/>}</main>
  <footer className="shell"><span>动效词典 · 用真实演示，连接视觉与表达。</span><Link to="/guide">描述指南</Link><p>{site.codeLicense && <>代码许可：<a href={site.codeLicenseUrl}>{site.codeLicense}</a>。</>}{site.contentTerms && <>内容条款：{site.contentTerms}</>}{site.feedback && <a href={site.feedback}>反馈意见</a>}</p><p>隐私：本站不收集个人数据，不使用分析或追踪。提示词语言选择仅保存在本机浏览器中。托管服务的访问日志由所选服务商管理。</p><p>产品和设计语言名称仅用于名称识别与描述。</p></footer>

</>; }
