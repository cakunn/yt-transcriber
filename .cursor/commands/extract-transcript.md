---
description: Extract a YouTube video transcript using defuddle
---

Run the transcript extraction script on the provided YouTube URL. Execute this command from the workspace root:

```bash
node extract-transcript.mjs $input
```

After running, report:
- Whether the extraction succeeded or failed
- The output file path (in `outputs/`)
- The video title, author, and word count from the script output

If the user did not provide a YouTube URL, ask for one before running.
