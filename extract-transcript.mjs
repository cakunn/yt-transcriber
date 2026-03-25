#!/usr/bin/env node

import { Defuddle } from 'defuddle/node';
import { parseHTML } from 'linkedom';
import { writeFile, mkdir } from 'fs/promises';
import { resolve, join } from 'path';

const OUTPUTS_DIR = resolve(process.cwd(), 'outputs');

function sanitizeFilename(title) {
  return title
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);
}

function buildFrontmatter(meta) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(meta)) {
    if (value) lines.push(`${key}: "${String(value).replace(/"/g, '\\"')}"`);
  }
  lines.push('---', '');
  return lines.join('\n');
}

async function fetchPageHTML(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  return res.text();
}

async function extract(url) {
  console.log(`Fetching: ${url}`);
  const html = await fetchPageHTML(url);

  console.log('Parsing with defuddle...');
  const { document } = parseHTML(html);
  const result = await Defuddle(document, url, {
    markdown: true,
    separateMarkdown: true,
  });

  const title = result.title || 'Untitled';
  const author = result.author || '';
  const published = result.published || '';
  const transcript = result.variables?.transcript || '';

  if (!transcript) {
    console.error('No transcript found for this video. It may not have captions available.');
    process.exit(1);
  }

  const frontmatter = buildFrontmatter({
    title,
    author,
    published,
    url,
  });

  const description = result.description || '';
  const sections = [frontmatter];
  if (description) {
    sections.push(`## Description\n\n${description}\n`);
  }
  sections.push(`## Transcript\n\n${transcript}\n`);
  const markdown = sections.join('\n');

  await mkdir(OUTPUTS_DIR, { recursive: true });
  const filename = `${sanitizeFilename(title)}.md`;
  const outputPath = join(OUTPUTS_DIR, filename);
  await writeFile(outputPath, markdown, 'utf-8');

  console.log(`Saved: ${outputPath}`);
  console.log(`Title: ${title}`);
  console.log(`Author: ${author}`);
  console.log(`Words: ${transcript.split(/\s+/).length}`);
}

const url = process.argv[2];
if (!url) {
  console.error('Usage: node extract-transcript.mjs <youtube-url>');
  process.exit(1);
}

if (!url.includes('youtube.com/') && !url.includes('youtu.be/')) {
  console.error('Error: URL must be a YouTube video URL.');
  process.exit(1);
}

extract(url).catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
