-- HARDCORE online leaderboard (Supabase project "hardcore-leaderboard", ref qqsufzmqtwuxoqynudvu, org BENCOPLUS, eu-central-1).
-- This is the setup that was applied (migration "create_scores", 2026-10-19). Players may add and read scores, never change or delete them.

create table public.scores (
  id bigint generated always as identity primary key,
  initials text not null check (initials ~ '^[A-Z0-9]{3}$'),
  score integer not null check (score > 0 and score <= 1000000),
  level smallint not null check (level between 0 and 8),       -- 1-8 = level reached, 0 = finished the campaign
  continues smallint not null default 0 check (continues between 0 and 99),
  created_at timestamptz not null default now()
);
create index scores_score_idx on public.scores (score desc);

alter table public.scores enable row level security;
create policy "anyone can read scores" on public.scores for select to anon, authenticated using (true);
create policy "anyone can add a score" on public.scores for insert to anon, authenticated with check (true);

-- only these columns can be written by players (id and created_at come from the database); no update/delete at all
revoke all on public.scores from anon, authenticated;
grant select on public.scores to anon, authenticated;
grant insert (initials, score, level, continues) on public.scores to anon, authenticated;

-- a simple brake on spam: at most 30 new scores a minute across everyone
create function public.scores_rate_limit() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.scores where created_at > now() - interval '1 minute') >= 30 then
    raise exception 'too many scores right now, try again later';
  end if;
  return new;
end $$;
revoke execute on function public.scores_rate_limit() from public, anon, authenticated;
create trigger scores_rate_limit before insert on public.scores for each row execute function public.scores_rate_limit();

-- Cleaning up (run in the Supabase dashboard's SQL editor, as the owner):
--   select * from public.scores order by score desc limit 50;      -- look
--   delete from public.scores where id = 123;                      -- remove one junk row
--   delete from public.scores where initials = 'XXX';              -- remove a bad name
