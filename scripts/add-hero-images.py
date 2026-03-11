#!/usr/bin/env python3
import os
import re

blog_dir = 'src/content/blog'
count = 0

for fname in sorted(os.listdir(blog_dir)):
    if not fname.endswith('.md'):
        continue
    fpath = os.path.join(blog_dir, fname)
    with open(fpath, 'r') as f:
        content = f.read()

    if 'heroImage:' in content:
        print(f'SKIP (already has): {fname}')
        continue

    m = re.search(r'^stage:\s*"?([^"\n]+)"?', content, re.MULTILINE)
    if not m:
        print(f'WARN no stage: {fname}')
        continue
    stage = m.group(1).strip()

    hero_line = f'heroImage: "/images/heroes/hero-{stage}.png"'

    content = re.sub(
        r'(^stage:\s*.*$)',
        r'\1\n' + hero_line,
        content,
        count=1,
        flags=re.MULTILINE
    )

    with open(fpath, 'w') as f:
        f.write(content)
    count += 1
    print(f'ADDED ({stage}): {fname}')

print(f'\nDone! Added heroImage to {count} articles.')
