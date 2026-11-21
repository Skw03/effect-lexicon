"""Defensive whole-build regression in a disposable copy. Inert fixtures only."""
import os
import shutil
import subprocess
import tempfile
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
TARGET = Path(tempfile.mkdtemp(prefix='s6-config-build-'))
shutil.copytree(ROOT, TARGET, dirs_exist_ok=True, ignore=shutil.ignore_patterns('.git', 'node_modules', 'dist', '.prerender', '.env*', '__pycache__'))
(TARGET/'node_modules').symlink_to(ROOT/'node_modules', target_is_directory=True)
ENV = {k:v for k,v in os.environ.items() if not k.startswith('VITE_') and k != 'RELEASE_MODE'}
count = 0
def run(extra=None, mode='production', succeeds=True):
    global count
    result = subprocess.run(['node','scripts/build.mjs','--mode',mode],cwd=TARGET,env={**ENV,**(extra or {})},text=True,capture_output=True)
    (TARGET/f'build-{count}.log').write_text(result.stdout+result.stderr)
    assert (result.returncode==0)==succeeds, result.stdout+result.stderr
    count += 1
# Each supported env-file source is validated before any build output.
for name in ['.env','.env.local','.env.production','.env.production.local','.env.audit']:
    (TARGET/name).write_text('VITE_SITE_ORIGIN=https://example.org/unapproved-path\n')
    run(mode='audit' if name.endswith('audit') else 'production',succeeds=False)
    (TARGET/name).unlink()
(TARGET/'.env.production').write_text('VITE_FEEDBACK_URL=ftp://example.org/contact\n')
run(succeeds=False)
# Direct Vite entry points share the resolver and also fail closed.
for args in [['build'], ['build', '--ssr', 'src/entry-server.tsx']]:
    result=subprocess.run(['node',str(TARGET/'node_modules/vite/bin/vite.js'),*args],cwd=TARGET,env=ENV,text=True,capture_output=True)
    (TARGET/f'build-{count}.log').write_text(result.stdout+result.stderr)
    assert result.returncode != 0
    count += 1
(TARGET/'.env.production').write_text('VITE_RELEASE_ASSETS=true\n')
run(succeeds=False)
(TARGET/'.env.production').unlink()
for host in ['127.0.0.2','[::1]','10.0.0.1','localhost.','www.example.com','example.org','branch.pages.dev']:
    run({'RELEASE_MODE':'production','VITE_SITE_ORIGIN':'https://'+host},succeeds=False)
# Benign origin and name demonstrate Vite file/process precedence in actual
# HTML and client bundle; they remain local test output and are never published.
for name,port in [('.env',4381),('.env.local',4382),('.env.production',4383),('.env.production.local',4384)]:
    (TARGET/name).write_text(f'VITE_SITE_ORIGIN=http://127.0.0.1:{port}\nVITE_SITE_NAME=Configuration fixture\n')
def verify(origin):
    html=(TARGET/'dist/guide/index.html').read_text()
    bundle=''.join(p.read_text() for p in (TARGET/'dist/assets').glob('*.js'))
    assert f'href="{origin}/guide"' in html and origin in bundle
    assert 'Configuration fixture' in html and 'Configuration fixture' in bundle
run();verify('http://127.0.0.1:4384')
run({'VITE_SITE_ORIGIN':'http://127.0.0.1:4385'});verify('http://127.0.0.1:4385')
(TARGET/'.env.audit').write_text('VITE_SITE_ORIGIN=http://127.0.0.1:4386\n')
run(mode='audit');verify('http://127.0.0.1:4386')
for file in TARGET.glob('.env*'): file.unlink()
run()
assert 'rel="canonical"' not in (TARGET/'dist/index.html').read_text()
assert 'noindex,nofollow' in (TARGET/'dist/index.html').read_text()
assert all('http://127.0.0.1:438' not in p.read_text() for p in (TARGET/'dist').rglob('*') if p.is_file())
print(f'PASS {count} isolated whole-build cases; final default noindex/no canonical/no test-origin leakage; evidence {TARGET}')
