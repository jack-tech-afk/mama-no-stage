#!/usr/bin/env python3
"""
内部リンクが未設定の40記事に「あわせて読みたい」セクションを追加するスクリプト。
同じステージの記事から2〜3件をリンクとして追加。同ステージが足りない場合は隣接ステージから補完。
"""
import os
import re
import random

blog_dir = 'src/content/blog'

# ステージ順序（隣接ステージ検索用）
STAGE_ORDER = [
    'trying', 'trimester-1', 'trimester-2', 'trimester-3',
    'newborn', 'infant', 'age-1', 'age-2', 'age-3',
    'preschool', 'elementary'
]

# 全記事のメタデータを収集
articles = {}
for fname in sorted(os.listdir(blog_dir)):
    if not fname.endswith('.md'):
        continue
    fpath = os.path.join(blog_dir, fname)
    with open(fpath, 'r') as f:
        content = f.read()

    slug = fname.replace('.md', '')

    # stage取得
    m_stage = re.search(r'^stage:\s*"?([^"\n]+)"?', content, re.MULTILINE)
    stage = m_stage.group(1).strip() if m_stage else None

    # title取得
    m_title = re.search(r'^title:\s*"([^"]+)"', content, re.MULTILINE)
    title = m_title.group(1).strip() if m_title else slug

    # 内部リンク有無
    has_links = 'あわせて読みたい' in content

    articles[slug] = {
        'stage': stage,
        'title': title,
        'has_links': has_links,
        'fpath': fpath,
    }

# ステージごとに記事をグループ化
stage_articles = {}
for slug, info in articles.items():
    stage = info['stage']
    if stage not in stage_articles:
        stage_articles[stage] = []
    stage_articles[stage].append(slug)

# 内部リンクが未設定の記事を処理
count = 0
for slug, info in sorted(articles.items()):
    if info['has_links']:
        continue

    stage = info['stage']
    if not stage:
        print(f'WARN no stage: {slug}')
        continue

    # 同じステージの他記事を候補にする
    candidates = [s for s in stage_articles.get(stage, []) if s != slug]

    # 同ステージが足りない場合、隣接ステージから補完
    if len(candidates) < 3:
        stage_idx = STAGE_ORDER.index(stage) if stage in STAGE_ORDER else -1
        if stage_idx >= 0:
            # 前のステージ
            if stage_idx > 0:
                prev_stage = STAGE_ORDER[stage_idx - 1]
                for s in stage_articles.get(prev_stage, []):
                    if s not in candidates and s != slug:
                        candidates.append(s)
            # 次のステージ
            if stage_idx < len(STAGE_ORDER) - 1:
                next_stage = STAGE_ORDER[stage_idx + 1]
                for s in stage_articles.get(next_stage, []):
                    if s not in candidates and s != slug:
                        candidates.append(s)

    # ランダムに2〜3件選択（候補が少なければ全部使う）
    random.seed(slug)  # 再現性のためslugベースのseed
    num_links = min(3, len(candidates))
    if num_links == 0:
        print(f'WARN no candidates: {slug}')
        continue

    selected = random.sample(candidates, num_links)

    # リンクセクション生成
    link_lines = []
    for s in selected:
        link_title = articles[s]['title']
        # タイトルから【】の装飾を短縮
        display_title = link_title
        link_lines.append(f'- [{display_title}](/{s}/)')

    link_section = '\n## あわせて読みたい\n\n' + '\n'.join(link_lines) + '\n'

    # 記事末尾に追加
    fpath = info['fpath']
    with open(fpath, 'r') as f:
        content = f.read()

    # 末尾の空白行を整理して追加
    content = content.rstrip() + '\n' + link_section

    with open(fpath, 'w') as f:
        f.write(content)

    count += 1
    links_str = ', '.join(selected)
    print(f'ADDED ({stage}): {slug} -> [{links_str}]')

print(f'\nDone! Added internal links to {count} articles.')
