create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  current_stage int not null default 1,
  score int not null default 0,
  start_time bigint,
  finish_time bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table players add column if not exists current_stage int not null default 1;
alter table players add column if not exists score int not null default 0;
alter table players add column if not exists start_time bigint;
alter table players add column if not exists finish_time bigint;
alter table players add column if not exists created_at timestamptz not null default now();
alter table players add column if not exists updated_at timestamptz not null default now();
alter table players alter column start_time drop not null;
alter table players alter column finish_time drop not null;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_name = 'players'
      and column_name = 'current_room'
  ) then
    update players
    set current_stage = current_room
    where current_stage is null;
  end if;
end $$;

create table if not exists game_state (
  id int primary key default 1,
  is_started boolean not null default false,
  started_at bigint,
  updated_at timestamptz not null default now()
);

insert into game_state (id, is_started, started_at)
values (1, false, null)
on conflict (id) do nothing;

alter table players enable row level security;
alter table game_state enable row level security;

drop policy if exists "prototype players read" on players;
drop policy if exists "prototype players insert" on players;
drop policy if exists "prototype players update" on players;
drop policy if exists "prototype players delete" on players;

create policy "prototype players read"
  on players for select
  using (true);

create policy "prototype players insert"
  on players for insert
  with check (true);

create policy "prototype players update"
  on players for update
  using (true)
  with check (true);

create policy "prototype players delete"
  on players for delete
  using (true);

drop policy if exists "prototype game state read" on game_state;
drop policy if exists "prototype game state insert" on game_state;
drop policy if exists "prototype game state update" on game_state;
drop policy if exists "prototype game state delete" on game_state;

create policy "prototype game state read"
  on game_state for select
  using (true);

create policy "prototype game state insert"
  on game_state for insert
  with check (true);

create policy "prototype game state update"
  on game_state for update
  using (true)
  with check (true);

create policy "prototype game state delete"
  on game_state for delete
  using (true);
