#!/usr/bin/env node
/**
 * Shorten meta descriptions in blog articles to ~100-120 characters.
 * Usage: node scripts/shorten-descriptions.mjs --apply
 * Without --apply, runs in dry-run mode (preview only).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogDir = path.resolve(__dirname, '../src/content/blog');
const applyMode = process.argv.includes('--apply');

if (!applyMode) {
  console.log('=== DRY RUN MODE (use --apply to write changes) ===\n');
}

const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
let changed = 0;
let skipped = 0;

for (const file of files) {
  const filePath = path.join(blogDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  const frontmatterMatch = content.match(/^(---\n)([\s\S]*?)\n(---)/);
  if (!frontmatterMatch) {
    console.log(`SKIP (no frontmatter): ${file}`);
    skipped++;
    continue;
  }

  const frontmatter = frontmatterMatch[2];
  const descMatch = frontmatter.match(/^(description:\s*)"(.*)"/m);
  if (!descMatch) {
    console.log(`SKIP (no description): ${file}`);
    skipped++;
    continue;
  }

  const originalDesc = descMatch[2];
  if (originalDesc.length <= 130) {
    skipped++;
    continue;
  }

  // Truncate strategy: cut at a natural boundary (period or comma) near 100-120 chars
  const shortened = truncateDescription(originalDesc, 120);

  console.log(`${file}`);
  console.log(`  BEFORE (${originalDesc.length}): ${originalDesc}`);
  console.log(`  AFTER  (${shortened.length}): ${shortened}`);
  console.log('');

  if (applyMode) {
    const newFrontmatter = frontmatter.replace(
      descMatch[0],
      `${descMatch[1]}"${shortened}"`
    );
    const newContent = content.replace(frontmatterMatch[0], `---\n${newFrontmatter}\n---`);
    fs.writeFileSync(filePath, newContent, 'utf-8');
  }
  changed++;
}

console.log(`\nDone. Changed: ${changed}, Skipped: ${skipped}, Total: ${files.length}`);
if (!applyMode && changed > 0) {
  console.log('Run with --apply to write changes.');
}

function truncateDescription(desc, maxLen) {
  if (desc.length <= maxLen) return desc;

  // Try to cut at the last Japanese period (。) within maxLen
  let cutPoint = -1;
  for (let i = Math.min(desc.length - 1, maxLen); i >= 60; i--) {
    if (desc[i] === '。') {
      cutPoint = i + 1; // include the period
      break;
    }
  }

  if (cutPoint > 0 && cutPoint <= maxLen) {
    return desc.substring(0, cutPoint);
  }

  // Try to cut at a comma (、) near maxLen
  for (let i = Math.min(desc.length - 1, maxLen); i >= 60; i--) {
    if (desc[i] === '、') {
      cutPoint = i;
      break;
    }
  }

  if (cutPoint > 0 && cutPoint <= maxLen) {
    return desc.substring(0, cutPoint) + 'を解説。';
  }

  // Last resort: hard cut at maxLen boundary and append 。
  const hardCut = desc.substring(0, maxLen - 1);
  return hardCut + '。';
}
