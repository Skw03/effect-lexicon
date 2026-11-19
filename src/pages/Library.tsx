import { Link } from 'react-router-dom';
import { publishedEffects } from '../content';
export function Library() {
  return <><h1>效果 Library</h1><ul className="library-links">{publishedEffects.map(effect => <li key={effect.slug}><Link to={`/effects/${effect.slug}`}>{effect.name.zh} <span lang="en">{effect.name.en}</span></Link></li>)}</ul></>;
}
