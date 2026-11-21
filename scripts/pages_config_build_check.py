"""Defensive Pages build checks with inert inputs in a disposable checkout."""
import os, shutil, subprocess, tempfile
from pathlib import Path
root = Path(__file__).resolve().parents[1]
target = Path(tempfile.mkdtemp(prefix='pages-env-check-'))
shutil.copytree(root, target, dirs_exist_ok=True, ignore=shutil.ignore_patterns('.git', 'node_modules', 'dist', '.prerender', '.wrangler', '.env*'))
(target/'node_modules').symlink_to(root/'node_modules', target_is_directory=True)
env = {k:v for k,v in os.environ.items() if not k.startswith('VITE_') and k != 'RELEASE_MODE'}
cases = [
    ('RELEASE_MODE=production\n', {}),
    ('VITE_SITE_ORIGIN=https://preview.pages.dev\n', {}),
    ('VITE_FEEDBACK_URL=https://example.org/feedback\n', {}),
    ('VITE_SITE_ORIGIN=https://preview.pages.dev\n', {'VITE_SITE_ORIGIN':''}),
]
for n, (content, extra) in enumerate(cases):
    (target/'.env.production').write_text(content)
    result = subprocess.run(['node', 'scripts/build.mjs', '--pages-preview'], cwd=target, env={**env, **extra}, capture_output=True, text=True)
    assert (result.returncode == 0) == (n == 3), result.stdout + result.stderr
    if n == 3:
        html = (target/'dist/guide.html').read_text()
        assert 'rel="canonical"' not in html and 'https://github.com/Skw03/effect-lexicon/issues' in html
        assert 'noindex,nofollow' in html and not (target/'dist/guide/index.html').exists()
print('4 preview effective-env build checks PASS')
