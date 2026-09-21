import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { UserAccount, AppState, UserProfile } from '../types';
import { DEFAULT_PROFILE } from '../data/defaultProfile';
import { generateWeeklyPlan } from './planGenerator';
import { resolveTodayWorkout } from './todayDetector';

const ACTIVE_USER_KEY = 'homodevs_active_user_id';
const USERS_LIST_KEY = 'homodevs_user_accounts_list';

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

// Pre-seeded profile template for Gabriele when he signs in
export const GABRIELE_PROFILE_TEMPLATE: UserProfile = {
  name: 'Gabriele',
  location: 'London, UK',
  timezone: 'Europe/London',
  experience: 'Intermediate',
  primaryGoal: 'upper_body_hypertrophy',
  secondaryGoals: ['strength', 'aesthetics'],
  availableDays: [1, 2, 4, 5, 0],
  sessionLengthMinutes: 75,
  equipment: ['free_weights', 'machines', 'cables'],
  injuries: '',
  preferences: 'Likes compound lifts, progressive overload, structured plans. Dislikes overly long workouts, random WOD style.',
  targetWorkoutTime: '19:00',
  archetype: 'hercules_mass',
  genderPreference: 'masculine',
  ageYears: 30,
  heightCm: 180,
  currentWeightKg: 82,
  goalWeightKg: 85,
  bodyFatPercent: 14,
};

export const DEFAULT_GABRIELE_ACCOUNT: UserAccount = {
  id: 'athlete_gabriele_founder',
  name: 'Gabriele',
  email: 'gella94@gmail.com',
  avatarUrl: '/logo.png',
  createdAt: '2026-09-20T17:00:00.000Z',
  isGuest: false,
};

export const DEFAULT_LIFETIME_VIP_EMAILS = [
  'gella94@gmail.com',
  'gabriele@homodevs.app',
  'athlete_gabriele_founder',
];

/**
 * Checks whether an account has permanent Lifetime Emperor Pro access
 * (via founder whitelist or VITE_LIFETIME_PRO_EMAILS environment variable)
 */
export function isLifetimeVipUser(account?: UserAccount | null): boolean {
  if (!account) return false;

  const email = (account.email || '').trim().toLowerCase();
  const id = (account.id || '').trim().toLowerCase();
  const name = (account.name || '').trim().toLowerCase();

  // Founder accounts
  if (
    DEFAULT_LIFETIME_VIP_EMAILS.includes(email) || 
    DEFAULT_LIFETIME_VIP_EMAILS.includes(id) ||
    email === 'gella94@gmail.com' ||
    name === 'gabriele'
  ) {
    return true;
  }

  // Environment variable configured accounts (comma-separated list of emails or names)
  const envVipList = (import.meta.env.VITE_LIFETIME_PRO_EMAILS || '')
    .split(',')
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean);

  if (envVipList.some((vip: string) => vip === email || vip === id || vip === name)) {
    return true;
  }

  return false;
}

export function isPasscodeUnlocked(): boolean {
  try {
    return localStorage.getItem('homodevs_vip_passcode_unlocked') === 'true';
  } catch {
    return false;
  }
}

/**
 * Validates Emperor secret passcodes for instant VIP unlock
 */
export function verifyEmperorPasscode(code: string): boolean {
  if (!code) return false;
  const clean = code.toUpperCase().trim();
  const validCodes = [
    'IMPERATOR2026',
    'OLYMPIAN',
    'HOMODEUS',
    'HOMODEVS',
    'EMPEROR',
    'IMPERATOR',
    'GABRIELE',
    'GELLA94',
    'VIP',
    'PRO',
    'ADMIN',
    (import.meta.env.VITE_LIFETIME_PRO_CODE || '').toUpperCase().trim(),
  ].filter(Boolean);

  const isMatch = validCodes.includes(clean);
  if (isMatch) {
    try {
      localStorage.setItem('homodevs_vip_passcode_unlocked', 'true');
    } catch {
      // ignore
    }
  }
  return isMatch;
}

/**
 * Retrieves list of all user accounts on this device
 */
export function getAllUserAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_LIST_KEY) || localStorage.getItem('ap3x_user_accounts_list');
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        return list;
      }
    }
  } catch (err) {
    console.warn('Failed to parse user accounts:', err);
  }
  return [];
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
  localStorage.removeItem('ap3x_user_accounts_list');
}

/**
 * Gets currently active user ID (returns null if visitor is unauthenticated)
 */
export function getActiveUserId(): string | null {
  return localStorage.getItem(ACTIVE_USER_KEY) || localStorage.getItem('ap3x_active_user_id');
}

/**
 * Sets active user ID
 */
export function setActiveUserId(userId: string | null): void {
  if (userId) {
    localStorage.setItem(ACTIVE_USER_KEY, userId);
    localStorage.removeItem('ap3x_active_user_id');
  } else {
    localStorage.removeItem(ACTIVE_USER_KEY);
    localStorage.removeItem('ap3x_active_user_id');
  }
}

/**
 * Signs out the current athlete and clears the active session
 */
export async function signOutAthlete(): Promise<void> {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }
  setActiveUserId(null);
}

/**
 * Generates an initial clean state for a new user account (unfilled/fresh)
 */
export function createInitialStateForUser(account: UserAccount): AppState {
  // If this is Gabriele, provide his curated profile; otherwise provide fresh blank template
  const isGabriele = account.name.toLowerCase() === 'gabriele';

  const profile: UserProfile = isGabriele
    ? { ...GABRIELE_PROFILE_TEMPLATE }
    : {
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
    setTypes: {},
    loggedWeights: {},
    totalTonnageKg: 0,
    lastGeneratedAt: new Date().toISOString(),
    onboardingCompleted: isGabriele, // New users will see onboarding
    loreRead: false,
    isProSubscriber: isLifetimeVipUser(account) || isPasscodeUnlocked(),
  };
}

/**
 * Loads the user-specific state partitioned by userId
 */
export function loadUserState(userId: string): AppState {
  const storageKey = `homodevs_user_state_${userId}`;
  const legacyKey = `ap3x_user_state_${userId}`;
  const accounts = getAllUserAccounts();
  const account = accounts.find(u => u.id === userId) || {
    id: userId,
    name: 'Athlete',
    createdAt: new Date().toISOString(),
    isGuest: true,
  };

  try {
    const raw = localStorage.getItem(storageKey) || localStorage.getItem(legacyKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.profile && parsed.weeklyPlan) {
        const todayWorkout = resolveTodayWorkout(parsed.weeklyPlan, parsed.profile);
        const isVip = isLifetimeVipUser(account) || isPasscodeUnlocked();
        return {
          ...parsed,
          userId,
          userAccount: account,
          todayWorkout,
          isProSubscriber: isVip ? true : Boolean(parsed.isProSubscriber),
        };
      }
    }
  } catch (err) {
    console.warn(`Failed to parse state for user ${userId}:`, err);
  }

  const fresh = createInitialStateForUser(account);
  saveUserState(userId, fresh);
  return fresh;
}

/**
 * Saves state strictly linked to this individual user
 */
export function saveUserState(userId: string, state: AppState): void {
  try {
    const storageKey = `homodevs_user_state_${userId}`;
    localStorage.setItem(storageKey, JSON.stringify(state));
    localStorage.removeItem(`ap3x_user_state_${userId}`);

    // Also sync to Supabase if configured and not guest
    if (supabase && !state.userAccount.isGuest) {
      syncStateToSupabase(userId, state).catch(err => {
        console.debug('Supabase cloud sync notice:', err);
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
      plan_name: `${state.profile.name}'s Olympian Plan`,
      plan_data: {
        profile: state.profile,
        weeklyPlan: state.weeklyPlan,
        totalTonnage: state.totalTonnageKg,
      },
    });
  } catch {
    // Cloud sync notice
  }
}

/**
 * Maps Supabase User to internal UserAccount
 */
export function mapSupabaseUserToAccount(sbUser: SupabaseUser): UserAccount {
  const metadata = sbUser.user_metadata || {};
  const name = metadata.full_name || metadata.name || sbUser.email?.split('@')[0] || 'Olympian';
  const isGabriele = name.toLowerCase().includes('gabriele') || (sbUser.email && sbUser.email.toLowerCase().includes('gabriele'));

  return {
    id: sbUser.id,
    name: isGabriele ? 'Gabriele' : name,
    email: sbUser.email,
    avatarUrl: metadata.avatar_url || metadata.picture,
    createdAt: sbUser.created_at || new Date().toISOString(),
    isGuest: false,
  };
}

/**
 * Listens for Supabase OAuth redirect callbacks (e.g. Google redirect back with access_token or code)
 */
export function initSupabaseAuthListener(onAuthSuccess: (user: UserAccount) => void): (() => void) | null {
  if (!supabase) return null;

  // 1. Check existing session on load
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
      const account = mapSupabaseUserToAccount(session.user);
      saveUserAccount(account);
      setActiveUserId(account.id);
      onAuthSuccess(account);
    }
  });

  // 2. Listen for sign-in event (including OAuth redirect hash)
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
      const account = mapSupabaseUserToAccount(session.user);
      saveUserAccount(account);
      setActiveUserId(account.id);
      onAuthSuccess(account);
    } else if (event === 'SIGNED_OUT') {
      setActiveUserId(null);
    }
  });

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Signs in using Google OAuth via Supabase
 */
export async function signInWithGoogle(): Promise<{ error: Error | null; user?: UserAccount }> {
  if (supabase) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { error };
  } else {
    // Fallback: local Google athlete profile when Supabase env vars not yet configured
    const simulatedAccount: UserAccount = {
      id: `google_${Date.now()}`,
      name: 'Google Athlete',
      email: 'athlete@gmail.com',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=homodeus',
      createdAt: new Date().toISOString(),
      isGuest: false,
    };
    saveUserAccount(simulatedAccount);
    setActiveUserId(simulatedAccount.id);
    return { error: null, user: simulatedAccount };
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

  // Create fresh account
  const newAccount: UserAccount = {
    id: `athlete_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: trimmed,
    email: email?.trim() || `${trimmed.toLowerCase().replace(/\s+/g, '')}@homodevs.app`,
    createdAt: new Date().toISOString(),
    isGuest: false,
  };
  saveUserAccount(newAccount);
  setActiveUserId(newAccount.id);
  return newAccount;
}

/**
 * Quick guest sandbox mode
 */
export function enterGuestMode(): UserAccount {
  const guest: UserAccount = {
    id: `guest_${Date.now()}`,
    name: 'Guest Gladiator',
    createdAt: new Date().toISOString(),
    isGuest: true,
  };
  saveUserAccount(guest);
  setActiveUserId(guest.id);
  return guest;
}
