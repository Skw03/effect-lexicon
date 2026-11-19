import { useEffect } from 'react';
import { metadata } from './metadata';
import { site } from './config';
export function Metadata({ path: pathname }: { path: string }) {
  useEffect(() => {
    const data = metadata(pathname);
    document.title = data.title;
    const meta = (key: string, value: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let node = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!node) { node = document.createElement('meta'); node.setAttribute(attr, key); document.head.append(node); }
      node.content = value;
    };
    meta('description', data.description); meta('robots', data.index ? 'index,follow' : 'noindex,nofollow');
    for (const [key, value] of Object.entries({ title: data.title, description: data.description, type: 'website', locale: 'zh_CN', site_name: site.name })) meta(`og:${key}`, value, true);
    meta('twitter:card', site.assets ? 'summary_large_image' : 'summary');
    meta('twitter:title', data.title); meta('twitter:description', data.description);
    document.head.querySelector('link[rel="canonical"]')?.remove();
    document.head.querySelector('meta[property="og:url"]')?.remove();
    if (data.canonical) { const link = document.createElement('link'); link.rel = 'canonical'; link.href = data.canonical; document.head.append(link); meta('og:url', data.canonical, true); }
  }, [pathname]);
  return null;
}
