import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { publishedEffects } from '../content';
import { defaults } from '../types';
import type { Effect } from '../types';
import { NotFound } from './NotFound';
import { ParamPanel } from '../components/ParamPanel';
import { DemoStage } from '../components/DemoStage';
import { PromptPanel } from '../components/PromptPanel';
function Detail({ effect }: { effect: Effect }) {
  const [values, setValues] = useState(() => defaults(effect));
  const related = publishedEffects.filter(candidate => effect.related.includes(candidate.slug)).slice(0, 3);
  const reset = () => setValues(defaults(effect));
  return <><nav aria-label="面包屑"><Link to="/">全部效果</Link> / {effect.name.zh}</nav>
    <h1>{effect.name.zh} <span className="english-title" lang="en">{effect.name.en}</span></h1>
    <span className="badge">{effect.type === 'style' ? '视觉样式' : effect.type === 'animation' ? '动画' : '交互'}</span>
    <div className="aliases">{effect.aliases.zh.map(alias => <span key={alias}>{alias}</span>)}{effect.aliases.en.map(alias => <span key={alias} lang="en">{alias}</span>)}</div>
    <DemoStage effect={effect} values={values} reset={reset}/>
    <ParamPanel effect={effect} values={values} reset={reset} onChange={(key, value) => setValues(current => ({ ...current, [key]: value }))}/>
    <section className="panel"><h2>怎么描述它</h2><h3>你会看到</h3><p>{effect.whatYouSee}</p><h3>行为步骤</h3><ol>{effect.behavior.map(step => <li key={step}>{step}</li>)}</ol><h3>常见用途</h3><ul>{effect.useCases.map(use => <li key={use}>{use}</li>)}</ul>{effect.terminologyNote && <><h3>名称说明</h3><p>{effect.terminologyNote}</p></>}</section>
    <PromptPanel effect={effect} values={values}/>
    {related.length > 0 && <section className="panel"><h2>相关效果</h2>{related.map(item => <Link key={item.slug} to={`/effects/${item.slug}`}>{item.name.zh} {item.name.en}</Link>)}</section>}
  </>;
}
export function EffectDetail() {
  const { slug } = useParams();
  const effect = publishedEffects.find(item => item.slug === slug);
  return effect ? <Detail key={effect.slug} effect={effect}/> : <NotFound/>;
}
