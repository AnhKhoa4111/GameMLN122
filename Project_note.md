# Project Note - MLN122 Game

Last reviewed: 2026-07-09
Project path: `D:\FPT Kì 7\MLN122\GameMLN122`

Read this before editing the project. Update it when game flow, API contracts,
database schema, scoring, authentication, or UI architecture changes.

## Current Flow

- Players do not log in. They enter a display name, join `/lobby`, then play at `/game`.
- Player identity is stored locally with `localStorage["mln122-player-id"]`.
- Saved players are validated through `GET /api/player-state?id=...` before routing.
- Admin uses Supabase Google Auth. `/admin` only opens for emails listed in `ADMIN_EMAILS`.
- Start/reset admin actions require `Authorization: Bearer <supabase_access_token>`.
- `start_time` is set only when admin starts the game.
- `finish_time` is set only after Stage 5 is completed.
- `current_stage` is the canonical progress field.

## Required Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAILS=
NEXT_PUBLIC_GAME_DURATION_MINUTES=20
```

Do not commit real `.env.local` values.

## Important Files

- `components/lobby/JoinLobbyForm.tsx`: join/resume player flow.
- `components/lobby/LobbyClient.tsx`: lobby polling and game redirect.
- `components/game/GameClient.tsx`: stage routing, score submit, countdown guard.
- `components/game/GameCountdown.tsx`: game-wide countdown from `player.start_time`.
- `components/admin/AdminClient.tsx`: Google admin login and dashboard.
- `lib/client/supabase.ts`: browser Supabase client.
- `lib/server/adminAuth.ts`: server-side admin email allowlist check.
- `app/api/player-state/route.ts`: validates one player and syncs missing `start_time`.
- `app/api/admin-login/route.ts`: verifies admin token/email.
- `app/api/start-game/route.ts`: starts game and sets player `start_time`.
- `app/api/reset-game/route.ts`: resets players and game state.
- `app/api/submit-score/route.ts`: updates score/stage and final finish time.

## Stage Flow

- Stage 1: `components/stages/stage-1-timeline/StageTimeline.tsx`
- Stage 2: `components/stages/stage-2-scanner/StageCaseScanner.tsx`
- Stage 3: `components/stages/stage-3-controller/StageControllerFinder.tsx`
- Stage 4: `components/stages/stage-4-decision/StageDecisionMaker.tsx`
- Stage 5: `components/stages/stage-5-boss/StageBoss.tsx`

`GameClient` renders Stage 1-5 based on `player.current_stage`.
Stage 5 completion advances to `FINAL_STAGE + 1` and sets `finish_time`.

## Notes

- Countdown defaults to 20 minutes and is configurable with
  `NEXT_PUBLIC_GAME_DURATION_MINUTES`.
- When countdown reaches zero, playable stages are hidden and score submit is blocked.
- Leaderboard sorts by score descending, then faster completion duration.
- Pages in `app/*/page.tsx` should stay thin and render domain components.
- API routes should stay thin; database/auth logic belongs in `lib/server/*`.

## Last Verified

- `npm run build` passed on 2026-07-09 after adding missing auth, countdown,
  player-state, lobby resume, and thin-page structure.
