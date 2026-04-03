# Scribe

This repository is the frontend to Scribe, a workspace for saving timestamped notes on YouTube videos. Paste a link, open the player, and capture notes that stay tied to exact playback moments.

## What It Does

- Loads standard YouTube links, short links, and Shorts URLs.
- Lets you save timestamped notes while a video plays.
- Supports quick seeking by clicking saved notes.
- Local-first storage Dexie/IndexedDB.
- Implements OAuth authentication to sync notes to Postgre through a Spring Boot API.

## Project Structure

- `src/services/`: note storage, YouTube metadata, and API access
- `src/Landing.tsx`: landing page and URL entry flow
- `src/Home.tsx`: main video + notes workspace
- `src/ChatBox.tsx`: notes list and composer
- `src/LibraryPanel.tsx`: saved-session drawer
- `src/WorkspaceSidebar.tsx`: playback controls and shortcuts
- `src/utils/`: URL parsing and formatting helpers
- `tests/`: Bun-based unit tests

## Environment

```env
VITE_API_BASE_URL=http://localhost:XXXX
VITE_YOUTUBE_API_KEY=your_youtube_api_key
```

## Development

```sh
bun install 
bun run dev 
bun run lint 
bun run build
bun test
```

## Tests

Current tests cover:

- YouTube URL parsing in `tests/extract-id.test.ts`
- Timestamp formatting in `tests/format-time.test.ts`
- Title behavior expectations in `tests/home-title.test.ts`

## Notes

- Local notes are grouped by `videoId`.
- Signed-in users use the API-backed note service instead of local storage.
- The project is set up for client-side routing and Vercel-style deployment.
