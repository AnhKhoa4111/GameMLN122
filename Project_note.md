# Project Note - MLN122 Game

Last reviewed: 2026-07-08
Branch reviewed: `Feature/ThanhHai`
Project path: `D:\FPT Kì 7\MLN122\GameMLN122`

This file is the main project memory for future assistant work. Read this before editing this project. Update it whenever the game flow, database schema, API contract, folder structure, scoring, or UI architecture changes.

## Project Purpose

`GameMLN122` is a classroom web game for MLN122. The current concept is an individual-player game, not a team game.

Core roles:

- `player`: no login, enters a display name, joins lobby, waits for admin, plays stages.
- `admin`: no account/login, uses an admin code from environment variables to start or reset the game.

Core timing rule:

- Player creation does not set `start_time`.
- `start_time` is set only when admin starts the game.
- `finish_time` is set only when the player completes the final stage.

Current terminology:

- Use `current_stage`, not `current_room`.
- Existing migration SQL still detects old `current_room` and copies it into `current_stage` if that old column exists.

## Tech Stack

- Next.js `15.3.2` with App Router.
- React `18.3.1`.
- TypeScript `5.5.4`.
- Tailwind CSS `3.4.4`.
- Supabase via `@supabase/supabase-js`.
- `@vercel/kv` is still listed in `package.json`, but current active storage logic uses Supabase, not KV.

Build commands:

```bash
npm run dev
npm run build
npm run start
```

Last known build status:

- `npm run build` passes after changing `tsconfig.json` `ignoreDeprecations` from `"6.0"` to `"5.0"`.

## Environment Variables

Expected variables are documented in `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_CODE=
NEXT_PUBLIC_GAME_DURATION_MINUTES=20
```

Supabase client location:

- `lib/server/supabase.ts`

Key selection:

```ts
process.env.SUPABASE_SERVICE_ROLE_KEY ??
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Admin code selection in API routes:

```ts
process.env.ADMIN_CODE ?? process.env.HOST_CODE ?? "admin"
```

Important:

- Prefer setting `ADMIN_CODE` in `.env.local`.
- Prefer setting `SUPABASE_SERVICE_ROLE_KEY` for server-side API routes if RLS policies are not ready.
- `NEXT_PUBLIC_GAME_DURATION_MINUTES` controls the in-game countdown. It defaults to 20 minutes if missing.
- Do not expose real `.env.local` values in chat or committed docs.

## Supabase Schema

Schema file:

- `supabase/schema.sql`

Tables:

### `players`

```sql
id uuid primary key default gen_random_uuid()
player_name text not null
current_stage int not null default 1
score int not null default 0
start_time bigint
finish_time bigint
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

Rules:

- `start_time` must be nullable.
- `finish_time` must be nullable.
- `current_stage` is the canonical stage-progress field.
- If an old `current_room` column exists, schema migration copies it into `current_stage`.

### `game_state`

```sql
id int primary key default 1
is_started boolean not null default false
started_at bigint
updated_at timestamptz not null default now()
```

Rules:

- Singleton row uses `id = 1`.
- Admin start upserts `game_state.id = 1` with `is_started = true` and `started_at = Date.now()`.
- Reset sets `is_started = false`, `started_at = null`.

RLS:

- Prototype permissive policies exist in `supabase/schema.sql`.
- If Supabase blocks inserts with error `42501`, run `supabase/schema.sql` again in Supabase SQL Editor or use `SUPABASE_SERVICE_ROLE_KEY`.

Known DB issue already encountered:

- Old DB had `players.start_time NOT NULL`, which blocked player creation because the new flow requires `start_time = null` until admin starts. The current schema file includes:

```sql
alter table players alter column start_time drop not null;
alter table players alter column finish_time drop not null;
```

## Current Folder Structure

```txt
app/
  page.tsx                 # Thin page; renders components/lobby/JoinLobbyForm.
  lobby/page.tsx           # Thin page; renders components/lobby/LobbyClient.
  game/page.tsx            # Thin page; renders components/game/GameClient.
  admin/page.tsx           # Thin page; renders components/admin/AdminClient.
  api/
    join-lobby/route.ts    # POST: create player.
    lobby-state/route.ts   # GET: return game state + players.
    player-state/route.ts  # GET: return one player by id.
    start-game/route.ts    # POST: admin start; sets game_state and player start_time.
    submit-score/route.ts  # POST: update current_stage/score/finish_time.
    leaderboard/route.ts   # GET: return sorted players.
    reset-game/route.ts    # POST: admin reset; deletes players and resets game_state.
  globals.css              # Tailwind + game CSS variables.
  layout.tsx               # Root layout and metadata.

lib/
  constants/
    routes.ts              # Central app route constants.
    storage.ts             # Central localStorage key constants.
  server/
    adminAuth.ts           # Admin code validation helper.
    supabase.ts            # Supabase client.
    playerStore.ts         # players table operations.
    gameStore.ts           # game_state table operations.
    lobbyStore.ts          # combined lobby state.
  types/
    player.ts              # Player interface.
    game.ts                # GameState interface.
    stage.ts               # FIRST_STAGE and FINAL_STAGE.
    score.ts               # Empty placeholder currently.
  data/                    # Stage data placeholders; files currently empty.
  scoring/
    totalScore.ts          # Prototype score helper; currently +100 per completed stage.
    scoreStage*.ts         # Stage-specific scoring placeholders; currently empty.
  utils.ts                 # Shared utilities, currently time formatting.

components/
  admin/
    AdminClient.tsx        # Admin state + start/reset interactions.
    AdminLeaderboard.tsx   # Admin leaderboard table.
    StartGameButton.tsx    # Start game button.
  game/
    GameClient.tsx         # Game state + submit progress interactions.
    GameHeader.tsx         # Player/stage heading.
    StageProgress.tsx      # Stage progress bar.
    ScorePanel.tsx         # Score/start/finish panel.
    GameResultModal.tsx    # Completion modal.
  lobby/
    JoinLobbyForm.tsx      # Player name form and join API call.
    LobbyClient.tsx        # Lobby polling and redirect to game.
    LobbyPlayerList.tsx    # Player list UI.
  stages/                  # Empty placeholders currently.
  ui/
    Button.tsx             # Shared button primitive.
    Card.tsx               # Shared block container.
    Modal.tsx              # Shared modal primitive.

supabase/
  schema.sql               # DB schema and prototype policies.
```

## Current Route Flow

### Player flow

1. Player opens `/`.
2. `JoinLobbyForm` checks `localStorage["mln122-player-id"]`.
3. If a saved player id exists, `/api/player-state?id=...` validates it:
   - if the player exists and has `start_time`, route to `/game`;
   - if the player exists but has no `start_time`, route to `/lobby`;
   - if the player no longer exists, clear localStorage and show the name form.
4. If no valid saved player exists, player enters name.
5. `/api/join-lobby` creates a row in `players`:
   - `player_name = input`
   - `current_stage = 1`
   - `score = 0`
   - `start_time = null`
   - `finish_time = null`
6. Browser stores:
   - `localStorage["mln122-player-id"] = player.id`
   - `localStorage["mln122-player-name"] = player.player_name`
7. Player is routed to `/lobby`.
8. `/lobby` polls `/api/lobby-state` every 2.5 seconds.
9. When `game_state.is_started` becomes true, player is routed to `/game`.
10. `/game` loads current player via `/api/player-state?id=...`.
11. If the player does not have `start_time`, route back to `/lobby`.
12. The prototype "Hoan thanh stage/game" button posts to `/api/submit-score`.

### Admin flow

1. Admin opens `/admin`.
2. Enters admin code from `ADMIN_CODE`, or `HOST_CODE`, or fallback `"admin"`.
3. Start game posts to `/api/start-game`.
4. `/api/start-game`:
   - Upserts `game_state` with `is_started = true`, `started_at = Date.now()`.
   - Updates all players with `start_time is null` to that same timestamp.
5. Reset posts to `/api/reset-game`.
6. `/api/reset-game`:
   - Deletes all players.
   - Resets singleton `game_state` to not started.

## API Contracts

### `POST /api/join-lobby`

Request:

```json
{ "playerName": "Thanh Hai" }
```

Response:

```json
{ "player": Player }
```

Validation:

- Name length must be at least 2 after trimming.

### `GET /api/lobby-state`

Response:

```json
{
  "game": GameState,
  "players": Player[]
}
```

### `GET /api/player-state?id=...`

Response:

```json
{ "player": Player }
```

### `POST /api/start-game`

Request:

```json
{ "adminCode": "..." }
```

Response:

```json
{ "game": GameState }
```

Side effects:

- Sets `game_state.is_started`.
- Sets `game_state.started_at`.
- Sets `players.start_time` for every player whose `start_time` is null.

### `POST /api/submit-score`

Request:

```json
{
  "playerId": "...",
  "score": 100,
  "currentStage": 2,
  "finish": false
}
```

Response:

```json
{ "player": Player }
```

Rules:

- Rejects if player is missing.
- Rejects if player `start_time` is null.
- `current_stage` is clamped to `FINAL_STAGE`.
- `finish_time` is set only when the request explicitly sends `finish: true`.
- Advancing from stage 4 to stage 5 must not finish the game.
- Stage 5 remains playable; pressing the completion button while already on stage 5 sends `finish: true`.

### `GET /api/leaderboard`

Response:

```json
{ "players": Player[] }
```

Sort order comes from `playerStore.getPlayers()`:

1. score descending
2. finish_time ascending with nulls last

### `POST /api/reset-game`

Request:

```json
{ "adminCode": "..." }
```

Side effects:

- Deletes players.
- Resets `game_state`.

## Important Implementation Details

- `current_stage` is the canonical progress name. Do not reintroduce `current_room`.
- This project no longer uses teams.
- This project does not use auth/login.
- Admin is code-gated only.
- Player identity is browser-local via `localStorage`.
- The database is the source of truth for player list, score, current stage, start time, and finish time.
- `localStorage` is only a convenience to remember the current player's id/name on the same device/browser.
- On app entry, saved localStorage player id is validated against Supabase before routing.
- The current game UI renders real Stage 1-5 components from `components/stages/*`.
- Stage data, scoring, and component files are implemented for Stage 1-5.
- `GameCountdown` shows a visible game-wide countdown from `player.start_time`. The countdown defaults to 20 minutes, changes color by remaining time, hides playable stages when time is up, and blocks new score submissions after expiry.
- Pages in `app/*/page.tsx` should stay thin. Put feature UI/state in `components/<domain>`.
- API routes should stay thin. Put database logic in `lib/server/*`.
- Shared browser constants should live in `lib/constants/*`.
- Shared API-facing models should live in `lib/types/*`.

## Known Issues / Follow-Ups

- Mojibake Vietnamese strings were cleaned from active pages/components/API routes during the folder-structure refactor. Re-check any newly pasted text before committing.
- `lib/types/score.ts` is still an empty placeholder.
- `@vercel/kv` remains in dependencies but is not used by active code.
- `README.md` is minimal and does not explain setup.
- Admin code currently falls back to `"admin"` if no env var exists; good for local dev, weak for real classroom use.
- RLS policies are permissive for prototype convenience. If this becomes public, tighten policies or move writes behind service-role-only server routes.
- Game route now uses dedicated `/api/player-state?id=...` instead of fetching all lobby players.
- Stage 4 to stage 5 no longer finishes the game. Real stage 5 UX still needs implementation.

## Recommended Next Development Steps

1. Run `supabase/schema.sql` in Supabase SQL Editor after schema changes.
2. Implement real stage components under `components/stages/`.
3. Fill `lib/data/*` with stage content.
4. Fill `lib/scoring/scoreStage*.ts` with stage-specific scoring.
5. Add a clearer final-stage flow so `finish_time` is set only after the intended final action.
6. Move repeated stat-card markup into a shared component if it grows.
7. Review responsive UI after real stage content is added.
8. Add clearer leaderboard and final result modal.
9. Add README setup instructions.

## Update Log

### 2026-07-08

- Reviewed branch `Feature/ThanhHai`.
- Documented current Supabase-backed prototype flow.
- Confirmed canonical DB progress field is `current_stage`.
- Confirmed admin-start timing rule: `start_time` is set only by admin start.
- Confirmed player finish rule: `finish_time` is set by submit-score/final completion.
- Documented empty placeholders and known mojibake issue.

### 2026-07-08 - Clean folder refactor

- Converted `app/page.tsx`, `app/lobby/page.tsx`, `app/game/page.tsx`, and `app/admin/page.tsx` into thin pages.
- Moved player join UI into `components/lobby/JoinLobbyForm.tsx`.
- Moved lobby polling/list UI into `components/lobby/LobbyClient.tsx` and `LobbyPlayerList.tsx`.
- Moved admin UI into `components/admin/AdminClient.tsx`, `AdminLeaderboard.tsx`, and `StartGameButton.tsx`.
- Moved game UI into `components/game/GameClient.tsx`, `GameHeader.tsx`, `StageProgress.tsx`, `ScorePanel.tsx`, and `GameResultModal.tsx`.
- Added shared UI primitives in `components/ui/Button.tsx`, `Card.tsx`, and `Modal.tsx`.
- Added constants in `lib/constants/routes.ts` and `lib/constants/storage.ts`.
- Added `lib/server/adminAuth.ts`.
- Added `GET /api/player-state`.
- Cleaned active mojibake Vietnamese strings in pages/components/API.
- `npm run build` passed after refactor.

### 2026-07-08 - Resume and stage 5 fix

- `JoinLobbyForm` now resumes an existing player from `localStorage["mln122-player-id"]`.
- Resume validates saved player id through `/api/player-state` before routing.
- Invalid/deleted saved player ids are removed from localStorage.
- `/api/submit-score` now sets `finish_time` only when `finish` is explicitly true.
- Stage 4 now advances to stage 5 without ending the game.
- Stage 5 is playable in the prototype and can finish the game from that stage.

### 2026-07-08 - Reconnect and duration ranking fix

- `/api/player-state` now returns `{ player, game }`.
- If the game is already started and a returning player has `start_time = null`, `/api/player-state` syncs that player `start_time` from `game_state.started_at`.
- This prevents the reconnect loop where `/lobby` sends a player to `/game`, then `/game` sends them back to `/lobby` because `start_time` was missing.
- Added shared duration helpers in `lib/utils.ts`:
  - `getElapsedMilliseconds(startTime, finishTime)`
  - `formatDurationMinutes(startTime, finishTime)`
- Admin leaderboard now shows completion duration as minutes.
- Player score panel and finish modal now show completion duration as minutes.
- Leaderboard ranking now sorts by score descending, then lower completion duration when scores are tied.

### 2026-07-09 - Stage 4 decision maker

- Implemented Stage 4 as `PHONG 4 - Ho So Viet Nam`, a decision-maker game where the player acts as a minister reviewing investment cases.
- Added Stage 4 content in `lib/data/stage4Decisions.ts`.
- Added Stage 4 scoring in `lib/scoring/scoreStage4.ts`.
- Added Stage 4 UI in `components/stages/stage-4-decision/StageDecisionMaker.tsx`.
- `GameClient` now renders Stage 4 when `player.current_stage === 4`.
- Stage 4 has 3 fictional company cases:
  - `Aurora Industrial Finance`: industrial supply chain investment; correct decision is full approval.
  - `HeliosPay Global`: bank, e-wallet, data, fintech expansion; correct decision is conditional approval.
  - `Titan Frontier Fund`: offshore fund seeking control of logistics and strategic minerals; correct decision is rejection.
- Stage 4 teaches the Chapter 4 theme: financial capital can support industrialization, but Vietnam must protect data, strategic infrastructure, resources, and national economic sovereignty.
- Stage 4 score is `30` points per correct case plus `10` bonus points for a perfect run.
- Completing Stage 4 saves the earned score and advances the player to Stage 5.
- `npm run build` passed after this change.

### 2026-07-09 - Stage 4 compact viral-card revision

- Reduced visible text in Stage 4 so players see quick cards instead of long dossiers.
- Replaced the first Stage 4 companies with fictional, TikTok-style parody companies:
  - `Cu Xanh Academy`: viral language-learning app style; correct decision is conditional approval.
  - `Deal Soc Mall`: flash-sale marketplace style; correct decision is conditional approval.
  - `IdolPay Live`: livestream, donate, e-wallet, consumer-credit style; correct decision is rejection.
- Stage 4 now shows a headline, fast info chips, one key benefit, one key risk, and reveals the short explanation only after the player chooses.
- `npm run build` passed after this revision.

### 2026-07-09 - Stage 5 Boss Room

- Implemented Stage 5 as `Phong Quyet Dinh Quoc Gia`, the final Boss Room.
- Added Stage 5 policy data in `lib/data/stage5Policies.ts`.
- Added Stage 5 scoring in `lib/scoring/scoreStage5.ts`.
- Added Stage 5 UI in `components/stages/stage-5-boss/StageBoss.tsx`.
- `GameClient` now renders Stage 5 when `player.current_stage === 5`.
- Boss Room rules:
  - Player sees 8 policy cards.
  - Player must select exactly 4 cards.
  - Player can confirm only once.
  - Cards reveal one by one after confirmation.
  - Each correct card gives 25 points.
  - Selecting all 4 correct cards gives a perfect bonus score of 200.
- Correct policy set:
  - `Thu hut FDI co chon loc`
  - `Phat trien doanh nghiep trong nuoc`
  - `Chong doc quyen`
  - `Bao ve du lieu tai chinh`
- Completing Stage 5 calls submit-score with `finish: true`, so `finish_time` is saved.
- If a player reloads after finishing, `GameClient` shows a completed state and does not allow submitting Boss Room again.
- `npm run build` passed after clearing stale `.next` cache.

### 2026-07-09 - Reconnect Stage 1-3 and countdown

- Checked the pasted countdown code: it had a real 20-minute countdown (`GAME_DURATION_MS = 20 * 60 * 1000`), 1-second interval updates, color/status thresholds, and submit blocking when time is up.
- Added `components/game/GameCountdown.tsx` and `lib/constants/game.ts`.
- Added optional env config `NEXT_PUBLIC_GAME_DURATION_MINUTES=20` to `.env.example`.
- `GameClient` now renders the shared countdown under `StageProgress`.
- `GameClient` now renders Stage 1, Stage 2, and Stage 3 real components instead of falling back to the old prototype completion button.
- When the countdown reaches `00:00`, playable stages are hidden and new score submissions are blocked with a time-up error.
- `npm run build` passed after this change.
