# 31ngo — Claude Instructions

## Memory & file paths

**All files must be written inside this repo.** Never write to `~/.claude/` or any path outside this repository.

| Purpose | Path in repo |
|---------|-------------|
| Memory files | `.claude/memory/` |
| Tmp / specs / plans | `.claude/tmp/` |

## Project

Multiplayer real-time bingo game (90 balls, Spanish rules). Host creates a room, players join via code. Host controls draw (manual or automatic timer). Vue 3 frontend + Node.js WebSocket server + Go REST API + MongoDB + nginx.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Vue 3, Vuex 4, Vue Router 4, SCSS, Vite 5 |
| WebSocket server | Node.js + `ws` + Express (`ws/`) |
| REST API | Go (compiled binary shipped in Docker image) |
| Database | MongoDB 4.4 |
| Proxy | nginx |
| Dev tooling | Docker Compose, Makefile |

## Commands

```bash
make build     # build all containers + start (first time / after Dockerfile changes)
make start     # start containers (already built)
make stop      # stop containers
make restart   # stop + start
make enter     # shell into app container
make lint      # eslint in app container
make lint-fix  # autofix lint errors
```

Frontend scripts (inside container or locally):
```bash
yarn serve     # dev server (Vite HMR)
yarn build     # production build → dist/
yarn test:unit # vitest unit tests
```

## Architecture

```
31ngo/
  src/                    # Vue 3 app
    pages/                # Host.vue, Player.vue, Home.vue, GameHost.vue, GamePlayer.vue
    components/           # UI + game components
    store/                # Vuex modules
    router.js             # Vue Router
    constants.js          # game config (90 balls, timers, card layout)
    services/             # API + WS client services
    scss/                 # styles
  ws/                     # Node.js WebSocket server
    src/
      server.js           # HTTP/HTTPS server factory
      app.js              # entry point
      webSocket.js        # WS event handling
      game.js             # game logic
  ops/
    docker/
      app/                # Vue app Dockerfile
      ws/                 # WebSocket Dockerfile
      go/                 # Go binary Dockerfile (pre-compiled binary inside)
      nginx/              # nginx.conf
    scripts/              # copy-env, hosts, delete-mongodb-data
```

## Ports (local Docker)

| Service | Port |
|---------|------|
| nginx (entry) | 80 |
| Vue app | 8080 |
| WebSocket | 8443 |
| Go API | 8090 |
| MongoDB | 27017 |

## Env

Copy `env.local` → `.env` before first build. WS and app each have their own env via `ops/scripts/copy-env.sh`.

Relevant env vars:
- `VITE_APP_WS_URL` — WebSocket URL for frontend
- `VITE_APP_API_URL` — Go API URL for frontend
- `MONGO_URI` / `MONGO_DB_NAME` — Go → MongoDB

## Game constants (`src/constants.js`)

- 90 balls total, 3 rows × 9 cols card
- Automatic mode: 10 s timer, 5000 ms draw interval
- Private rooms: max 40 players

## Git remote

```
git@jonayGit:jonaypelluz/31ngo.git
```

## Skills

- `/graphify` → invoke `graphify` skill
