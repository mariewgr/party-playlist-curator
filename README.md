# Party Playlist Curator

A real-time party web app. The host connects their Spotify account and manages a song queue. Guests scan a QR code, land on a mobile-friendly page, and vote on which song plays next. Votes update live for everyone, and songs play automatically in vote order.

## Features

- **Host** — connect Spotify, search and add songs, see the live queue, skip tracks, and let guests vote
- **Guests** — scan a QR code, suggest songs, and vote on what plays next (one vote per song)
- **Real-time** — votes and queue updates appear instantly via WebSockets
- **Auto-play** — when a song ends, the top-voted song plays automatically

## Tech stack

| Layer | Tool |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Real-time | Socket.io |
| Backend | Node.js + Express |
| Spotify | OAuth 2.0 + Web API |
| QR codes | qrcode.react |

## Getting started

### 1. Create a Spotify app

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) and log in with your **Premium** account
2. Create an app and add `http://127.0.0.1:3001/auth/callback` as a Redirect URI
3. Copy your **Client ID** and **Client Secret**

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3001/auth/callback
SESSION_SECRET=any_random_string
PORT=3001
CLIENT_URL=http://localhost:5173
```

### 3. Install dependencies

```bash
npm install
cd client && npm install
cd ../server && npm install
```

### 4. Run the app

```bash
npm run dev
```

- Host UI: `http://localhost:5173`
- Guest URL (for phones on the same WiFi): shown as a QR code on the host page

## How it works

1. The host opens the app, clicks **Connect Spotify**, and logs in
2. The host searches for songs and adds them to the queue
3. Guests scan the QR code on the host screen and open the guest page on their phone
4. Guests vote on songs — the queue re-orders in real time by vote count
5. When a song ends, the top-voted song plays automatically on Spotify

## Project structure

```
playlist-curator/
├── client/          # React + Vite frontend
│   └── src/
│       ├── pages/   # HostPage, GuestPage
│       └── components/  # Queue, SearchBar, SongCard, NowPlaying, QRCode, Toast
├── server/          # Express + Socket.io backend
│   ├── spotify.js   # Spotify API wrapper
│   ├── voteStore.js # In-memory vote queue
│   └── routes/      # auth, search, queue
└── .env             # Your credentials (not committed)
```
