import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { UserAccount, AppState, UserProfile } from '../types';
import { DEFAULT_PROFILE } from '../data/defaultProfile';
import { generateWeeklyPlan } from './planGenerator';
import { resolveTodayWorkout } from './todayDetector';

const ACTIVE_USER_KEY = 'ap3x_active_user_id';
const USERS_LIST_KEY = 'ap3x_user_accounts_list';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export let supabase: SupabaseClient | null = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
  }
}

export const isSupabaseReady = () => Boolean(supabase);

// Default Primary Account for Gabriele
export const DEFAULT_GABRIELE_ACCOUNT: UserAccount = {
  id: 'user_gabriele_london',
  name: 'Gabriele',
  email: 'gabriele@ap3xforg3.app',
  createdAt: '2026-09-20T00:00:00.000Z',
  isGuest: false,
};

/**
 * Retrieves list of all user accounts on this device
 */
export function getAllUserAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_LIST_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    }
  } catch (err) {
    console.warn('Failed to parse user accounts:', err);
  }
  const initial = [DEFAULT_GABRIELE_ACCOUNT];
  localStorage.setItem(USERS_LIST_KEY, JSON.stringify(initial));
  return initial;
}

/**
 * Saves a user account to the local registry
 */
export function saveUserAccount(account: UserAccount): void {
  const users = getAllUserAccounts();
  const index = users.findIndex(u => u.id === account.id);
  if (index >= 0) {
    users[index] = account;
  } else {
    users.push(account);
  }
  localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
}

/**
 * Gets currently active user ID
 */
export function getActiveUserId(): string {
  return localStorage.getItem(ACTIVE_USER_KEY) || DEFAULT_GABRIELE_ACCOUNT.id;
}

/**
 * Sets active user ID
 */
export function setActiveUserId(userId: string): void {
  localStorage.setItem(ACTIVE_USER_KEY, userId);
}

/**
 * Generates an initial clean state for a new user account
 */
export function createInitialStateForUser(account: UserAccount): AppState {
  const profile: UserProfile = {
    ...DEFAULT_PROFILE,
    name: account.name,
  };
  const weeklyPlan = generateWeeklyPlan(profile);
  const todayWorkout = resolveTodayWorkout(weeklyPlan, profile);

  return {
    userId: account.id,
    userAccount: account,
    profile,
    weeklyPlan,
    todayWorkout,
    completedSets: {},
    loggedWeights: {},
    totalTonnageKg: 0,
    lastGeneratedAt: new Date().toISOString(),
    onboardingCompleted: account.id === DEFAULT_GABRIELE_ACCOUNT.id, // Gabriele starts onboarded
    loreRead: account.id === DEFAULT_GABRIELE_ACCOUNT.id,
  };
}

/**
 * Loads the user-specific state partitioned by userId
 */
export function loadUserState(userId: string): AppState {
  const storageKey = `ap3x_user_state_${userId}`;
  const accounts = getAllUserAccounts();
  const account = accounts.find(u => u.id === userId) || {
    ...DEFAULT_GABRIELE_ACCOUNT,
    id: userId,
  };

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.profile && parsed.weeklyPlan) {
        // Re-resolve today workout with current local time
        const todayWorkout = resolveTodayWorkout(parsed.weeklyPlan, parsed.profile);
        return {
          ...parsed,
          userId,
          userAccount: account,
          todayWorkout,
        };
      }
    }
  } catch (err) {
    console.warn(`Failed to parse state for user ${userId}:`, err);
  }

  // Fallback: create fresh state and save
  const fresh = createInitialStateForUser(account);
  saveUserState(userId, fresh);
  return fresh;
}

/**
 * Saves state strictly linked to this individual user
 */
export function saveUserState(userId: string, state: AppState): void {
  try {
    const storageKey = `ap3x_user_state_${userId}`;
    localStorage.setItem(storageKey, JSON.stringify(state));

    // Also sync to Supabase if configured and user is online
    if (supabase && !state.userAccount.isGuest) {
      syncStateToSupabase(userId, state).catch(err => {
        console.debug('Supabase background cloud sync notice:', err);
      });
    }
  } catch (err) {
    console.error(`Failed to save state for user ${userId}:`, err);
  }
}

/**
 * Async background sync to Supabase user_plans and profiles
 */
async function syncStateToSupabase(userId: string, state: AppState) {
  if (!supabase) return;
  try {
    await supabase.from('profiles').upsert({
      id: userId,
      name: state.profile.name,
      timezone: state.profile.timezone,
      experience: state.profile.experience,
      primary_goal: state.profile.primaryGoal,
    });

    await supabase.from('user_plans').upsert({
      user_id: userId,
      plan_name: `${state.profile.name}'s Apex Plan`,
      plan_data: {
        profile: state.profile,
        weeklyPlan: state.weeklyPlan,
        totalTonnage: state.totalTonnageKg,
      },
    });
  } catch (err) {
    // Cloud sync notice
  }
}

/**
 * Signs in using Google OAuth via Supabase
 */
export async function signInWithGoogle(): Promise<{ error: Error | null }> {
  if (supabase) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { error };
  } else {
    // Simulated Google Login for demo / sandbox when Supabase credentials aren't deployed yet
    const simulatedAccount: UserAccount = {
      id: `google_user_${Date.now()}`,
      name: 'Google Athlete',
      email: 'athlete@gmail.com',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=apex',
      createdAt: new Date().toISOString(),
      isGuest: false,
    };
    saveUserAccount(simulatedAccount);
    setActiveUserId(simulatedAccount.id);
    return { error: null };
  }
}

/**
 * Creates or logs into an athlete account by codename/name
 */
export function loginAthleteByName(name: string, email?: string): UserAccount {
  const users = getAllUserAccounts();
  const trimmed = name.trim();
  const existing = users.find(u => u.name.toLowerCase() === trimmed.toLowerCase());
  if (existing) {
    setActiveUserId(existing.id);
    return existing;
  }

  // Create new account
  const newAccount: UserAccount = {
    id: `athlete_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: trimmed,
    email: email?.trim() || `${trimmed.toLowerCase().replace(/\s+/g, '')}@ap3xforg3.app`,
    createdAt: new Date().toISOString(),
    isGuest: false,
  };
  saveUserAccount(newAccount);
  setActiveUserId(newAccount.id);
  return newAccount;
}
