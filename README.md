# UrlShortner

Repository for a small URL shortener service.

This workspace contains the server implementation in the `server/` folder (Node.js + TypeScript + Express + MongoDB).

## Quick links

- Server source: `server/src`
- Server README: `server/README.md` (contains setup and run instructions)

## Quick start (local)

1. Open a terminal and change into the server directory:

```powershell
cd server
npm install
```

2. Create a `.env` file in `server/` with the required environment variables (see `server/README.md` for hints).
3. Run in development:

```powershell
npm run dev
```

## Repository structure

```
UrlShortner/
  .gitignore
  README.md        # This file
  server/          # Actual server app (Node + TypeScript)
    package.json
    src/
      index.ts
      config/
      controllers/
      models/
      schema/
      utils/
```

## Notes

- The main app lives in `server/`; see `server/README.md` for detailed instructions and environment variable names.
- I added a root `.gitignore` to keep repo-level artifacts out of git. There is also a `.gitignore` inside `server/` for server-specific ignores.

## Next steps

- If you want, I can update this README with example API usage, example `.env` contents, and exact env variable names from `server/src/config/env.ts`.
- Add a `LICENSE` and CONTRIBUTING guide if required.

---
