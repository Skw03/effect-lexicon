// Shared by the HTTP host, SSR, client routes and metadata. It does not resolve
// network-path references against a host or map arbitrary URLs to disk paths.
export function canonicalPath(path, routes) {
  let decoded;
  try { decoded = decodeURIComponent(path); } catch { return ''; }
  if (!decoded.startsWith('/') || [...decoded].some(char => char.charCodeAt(0) <= 32 || char.charCodeAt(0) === 127 || ['\\', '?', '#'].includes(char))) return '';
  if (decoded.split('/').some(segment => segment === '.' || segment === '..')) return '';
  const normalized = decoded.toLowerCase().replace(/\/{2,}/g, '/').replace(/\/index\.html\/?$/, '/').replace(/\/$/, '') || '/';
  return routes.includes(normalized) ? normalized : '';
}
