export function SearchBox({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <div className="search-strip"><label htmlFor="effect-search">搜索效果</label><div className="search-input-row"><input id="effect-search" type="search" value={value} onChange={event => onChange(event.target.value)} placeholder="试试：鼠标移上去卡片跟着动 / typing effect"/>{value && <button onClick={() => onChange('')}>清除搜索</button>}</div><p className="muted">不知道名字？描述一下，或者按「它怎么动」来找</p></div>;
}
