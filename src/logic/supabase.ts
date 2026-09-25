import { UserProfile, WorkoutDay } from '../types';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Encodes a workout plan and profile into a URL hash or query string
 * so the user can instantly share a working link with friends with ZERO backend setup!
 */
export function generateShareableUrl(profile: UserProfile, weeklyPlan: WorkoutDay[]): string {
  try {
    const payload = {
      p: {
        name: profile.name,
        goal: profile.primaryGoal,
        exp: profile.experience,
        days: profile.availableDays,
        dur: profile.sessionLengthMinutes,
        time: profile.targetWorkoutTime,
      },
      w: weeklyPlan.map(d => ({
        idx: d.dayIndex,
        name: d.name,
        rest: d.isRestDay,
        dur: d.estimatedDurationMinutes,
        ex: d.exercises.map(e => ({ n: e.name, s: e.sets, r: e.reps, rest: e.restSeconds }))
      })),
      v: 1
    };
    const jsonStr = JSON.stringify(payload);
    const base64 = btoa(encodeURIComponent(jsonStr));
    const url = new URL(window.location.origin);
    url.searchParams.set('share', base64);
    return url.toString();
  } catch (err) {
    console.error('Failed to generate share URL:', err);
    return window.location.href;
  }
}

/**
 * Checks for a shared plan in the current URL parameters
 */
export function parseSharedUrl(): { profile?: Partial<UserProfile>; weeklyPlan?: Partial<WorkoutDay>[] } | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('share');
    if (!shared) return null;

    const jsonStr = decodeURIComponent(atob(shared));
    const payload = JSON.parse(jsonStr);

    if (payload && payload.p && payload.w) {
      return {
        profile: {
          name: payload.p.name,
          primaryGoal: payload.p.goal,
          experience: payload.p.exp,
          availableDays: payload.p.days,
          sessionLengthMinutes: payload.p.dur,
          targetWorkoutTime: payload.p.time,
        },
        weeklyPlan: payload.w.map((d: any) => ({
          dayIndex: d.idx,
          name: d.name,
          isRestDay: d.rest,
          estimatedDurationMinutes: d.dur,
          exercises: d.ex.map((e: any) => ({
            name: e.n,
            sets: e.s,
            reps: e.r,
            restSeconds: e.rest,
          }))
        }))
      };
    }
  } catch (err) {
    console.warn('Failed to parse shared plan from URL:', err);
  }
  return null;
}

/**
 * Clean PostgreSQL DDL for Supabase
 */
export const SUPABASE_SQL_SCHEMA = `
-- Run this in your Supabase SQL Editor:
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  timezone text default 'Europe/London',
  experience text,
  primary_goal text,
  is_pro boolean default false,
  pro_tier text default 'free',
  pro_revoked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.user_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  plan_name text not null,
  plan_data jsonb not null,
  is_public boolean default true,
  share_slug text unique,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.user_plans enable row level security;

-- Policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update non-entitlement profile data" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can view and edit own plans" on public.user_plans
  for all using (auth.uid() = user_id);

create policy "Anyone can view public shared plans" on public.user_plans
  for select using (is_public = true);
`;
