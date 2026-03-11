#!/usr/bin/env python3
"""
pubDateを自然に分散させるスクリプト。
70記事を過去2ヶ月（2026-01-10〜2026-03-11）に2〜3日間隔で分散配置。
ステージ順に並べて、同ステージ内では記事の難易度/基本度順に配置。
"""
import os
import re
from datetime import datetime, timedelta

blog_dir = 'src/content/blog'

# ステージ順序（サイトのコンテンツ順）
STAGE_ORDER = [
    'trying', 'trimester-1', 'trimester-2', 'trimester-3',
    'newborn', 'infant', 'age-1', 'age-2', 'age-3',
    'preschool', 'elementary'
]

# 全記事を読み込み
articles = []
for fname in sorted(os.listdir(blog_dir)):
    if not fname.endswith('.md'):
        continue
    fpath = os.path.join(blog_dir, fname)
    with open(fpath, 'r') as f:
        content = f.read()

    slug = fname.replace('.md', '')
    m_stage = re.search(r'^stage:\s*"?([^"\n]+)"?', content, re.MULTILINE)
    stage = m_stage.group(1).strip() if m_stage else 'unknown'

    articles.append({
        'slug': slug,
        'stage': stage,
        'fname': fname,
        'fpath': fpath,
    })

# ステージ順→ファイル名順にソート
def sort_key(a):
    stage_idx = STAGE_ORDER.index(a['stage']) if a['stage'] in STAGE_ORDER else 99
    return (stage_idx, a['slug'])

articles.sort(key=sort_key)

# 日付分散: 2026-01-10 から 2026-03-11 まで（約60日間に70記事）
# 周期的に配置（ただし自然さのため不均等に）
start_date = datetime(2026, 1, 10)
end_date = datetime(2026, 3, 11)
total_days = (end_date - start_date).days  # 60日

# 70記事を60日に分散。一部の日に2記事を配置
# ほぼ均等に割り振り
dates = []
for i in range(len(articles)):
    # 線形補間で分散
    day_offset = int(i * total_days / len(articles))
    d = start_date + timedelta(days=day_offset)
    dates.append(d)

# 更新実行
count = 0
for article, new_date in zip(articles, dates):
    fpath = article['fpath']
    with open(fpath, 'r') as f:
        content = f.read()

    new_date_str = new_date.strftime('%Y-%m-%d')

    # pubDate行を置換
    new_content = re.sub(
        r'^pubDate:\s*"?[\d-]+"?',
        f'pubDate: "{new_date_str}"',
        content,
        count=1,
        flags=re.MULTILINE
    )

    if new_content != content:
        with open(fpath, 'w') as f:
            f.write(new_content)
        count += 1
        print(f'{new_date_str} | {article["stage"]:15} | {article["slug"]}')

print(f'\nDone! Updated pubDate for {count} articles.')
print(f'Date range: {start_date.strftime("%Y-%m-%d")} ~ {end_date.strftime("%Y-%m-%d")}')
