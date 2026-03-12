#!/usr/bin/env node
/**
 * ブログ記事のアフィリエイトリンク一括置換スクリプト
 *
 * example.com → もしもアフィリエイト楽天検索リンク に変換
 *
 * Usage:
 *   node scripts/replace-affiliate-links.mjs          # ドライラン（変更なし）
 *   node scripts/replace-affiliate-links.mjs --apply   # 実際に置換
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'src', 'content', 'blog');

// もしもアフィリエイト楽天 パラメータ（ママのステージ用）
const MOSHIMO_A_ID = '5419817';
const MOSHIMO_P_ID = '54';
const MOSHIMO_PC_ID = '54';
const MOSHIMO_PL_ID = '616';

const dryRun = !process.argv.includes('--apply');

if (dryRun) {
  console.log('🔍 ドライラン（--apply を付けると実際に置換します）\n');
} else {
  console.log('✏️  実行モード: ファイルを書き換えます\n');
}

/**
 * 商品名から楽天検索URLを生成
 */
function buildRakutenSearchUrl(productName) {
  // 商品名からブランド名+商品名のキーワードを抽出
  // 余分な記号を除去してクリーンなキーワードにする
  const keyword = productName
    .replace(/[【】「」『』（）()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const encodedKeyword = encodeURIComponent(keyword);
  const rakutenUrl = `https://search.rakuten.co.jp/search/mall/${encodedKeyword}/`;
  const encodedRakutenUrl = encodeURIComponent(rakutenUrl);

  return `https://af.moshimo.com/af/c/click?a_id=${MOSHIMO_A_ID}&p_id=${MOSHIMO_P_ID}&pc_id=${MOSHIMO_PC_ID}&pl_id=${MOSHIMO_PL_ID}&url=${encodedRakutenUrl}`;
}

/**
 * YAMLフロントマター内のaffiliate配列を解析して置換
 */
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // フロントマター部分を抽出（---で囲まれた部分）
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return { changed: 0, products: [] };

  const frontmatter = fmMatch[1];
  const body = content.slice(fmMatch[0].length);

  // affiliate配列がない場合スキップ
  if (!frontmatter.includes('affiliate:')) return { changed: 0, products: [] };

  let changed = 0;
  const products = [];

  // 各affiliateエントリを処理
  // パターン: name行の後にurl行があるのを見つける
  let newFrontmatter = frontmatter;

  // name と url のペアを見つけて置換
  const nameUrlPattern = /( +- name: "(.+?)"\n)([\s\S]*?)( +url: "https:\/\/example\.com")/g;

  newFrontmatter = frontmatter.replace(nameUrlPattern, (match, nameLine, productName, between, urlLine) => {
    const affiliateUrl = buildRakutenSearchUrl(productName);
    changed++;
    products.push(productName);
    const indent = urlLine.match(/^(\s+)/)[1];
    return `${nameLine}${between}${indent}url: "${affiliateUrl}"`;
  });

  if (changed === 0) return { changed: 0, products: [] };

  const newContent = `---\n${newFrontmatter}\n---${body}`;

  if (!dryRun) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
  }

  return { changed, products };
}

// メイン処理
const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
let totalChanged = 0;
let totalFiles = 0;

for (const file of files) {
  const filePath = path.join(BLOG_DIR, file);
  const { changed, products } = processFile(filePath);

  if (changed > 0) {
    totalFiles++;
    totalChanged += changed;
    console.log(`📝 ${file}: ${changed}件の商品リンクを置換`);
    for (const p of products) {
      console.log(`   → ${p}`);
    }
  }
}

console.log(`\n${'='.repeat(50)}`);
console.log(`📊 合計: ${totalFiles}ファイル / ${totalChanged}件のリンクを${dryRun ? '検出' : '置換'}`);
if (dryRun) {
  console.log(`\n💡 実際に置換するには: node scripts/replace-affiliate-links.mjs --apply`);
}
