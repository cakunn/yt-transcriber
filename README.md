# yt-transcriber

Extract YouTube video transcripts as clean Markdown files — directly from Cursor.

## What It Does

Pulls the transcript from any YouTube video and saves it as a Markdown file with frontmatter (title, author, published date, URL) in an `outputs/` folder. Uses [defuddle](https://github.com/kepano/defuddle) for extraction.

## Setup

```bash
git clone https://github.com/cakunn/yt-transcriber.git
cd yt-transcriber
npm install
```

## Usage

### Cursor Command (recommended)

This repo includes a Cursor command at `.cursor/commands/extract-transcript.md`. Once you open the project in Cursor:

1. Open the command palette (`Cmd+Shift+P`)
2. Type `extract-transcript`
3. Paste a YouTube URL when prompted

The agent will run the script and report the title, author, word count, and output path.

### CLI

```bash
node extract-transcript.mjs https://www.youtube.com/watch?v=VIDEO_ID
```

Output lands in `outputs/<video-title>.md`.

## Output Format

```markdown
---
title: "Video Title"
author: "Channel Name"
published: "2026-01-15"
url: "https://www.youtube.com/watch?v=..."
---

## Description

Video description text.

## Transcript

Full transcript content...
```

## Dependencies

- [defuddle](https://github.com/kepano/defuddle) — content extraction
- [linkedom](https://github.com/WebReflection/linkedom) — server-side DOM parsing
