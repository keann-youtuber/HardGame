# HardGame

Browser-first online 2D top-down RPG.

## Architecture

- **GitHub**: source code, procedural definitions, game data and version control.
- **Cloudflare Pages**: serves the browser client.
- **Cloudflare Pages Functions / Worker**: API boundary and authentication callbacks.
- **Cloudflare D1**: persistent player/account/game data.
- **Realtime multiplayer**: kept behind a separate server/network adapter so the client is not coupled to the database.

## Database

Run the schema in `db/schema.sql` against a D1 database.

The schema stores:
- users and OAuth provider identity
- characters and progression
- inventory
- equipment
- quests

Never put OAuth client secrets or D1 credentials in `index.html` or client JavaScript.

## Current API

- `GET /api/health`
- `GET /api/player`
- `POST /api/player`

The player endpoint is intentionally protected by an API-side identity boundary. The temporary `X-HardGame-User` header exists for local architecture/testing only; production OAuth must replace it with a signed server session.

## Deployment

1. Create a D1 database named `hardgame`.
2. Replace `database_id` in `wrangler.toml`.
3. Apply `db/schema.sql`.
4. Configure Google and Discord OAuth callback secrets in the Cloudflare environment.
5. Deploy the Pages site and Functions.
6. Configure the game client to use the deployed API.

## Important

GitHub is not the player database. It stores the project and static game definitions. D1 stores mutable player state.

This repository is being built incrementally toward:
procedural chunks, resources, caves, cities, mobs, bosses, loot, economy, sword, bow, axe, pickaxe, magic, blocking, perfect block, inventory, progression and realtime multiplayer.
