export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: { colors: Object.fromEntries(['bg', 'surface', 'border', 'text', 'text-muted', 'accent', 'accent-soft', 'danger'].map(key => [key, `var(--${key})`])) } },
};
