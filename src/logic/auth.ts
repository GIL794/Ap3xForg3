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
 * Validates Emperor secret passcodes for instant VIP unlock.
 * Only 'C0D3T0UNL0CK' (and optional VITE_LIFETIME_PRO_CODE) are permitted.
 * Existing Pro accounts and device unlocks remain completely preserved.
 */
export function verifyEmperorPasscode(code: string): boolean {
  if (!code) return false;
  const clean = code.toUpperCase().trim();
  const validCodes = [
    'C0D3T0UNL0CK',
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
 * Revokes Pro/VIP status from device storage and optionally a specific user account.
 * Useful for testing free tiers or resetting access.
 */
export function revokeProAccess(userId?: string): void {
  try {
    localStorage.removeItem('homodevs_vip_passcode_unlocked');
    if (userId) {
      const storageKey = `homodevs_user_state_${userId}`;
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const state = JSON.parse(raw);
        state.isProSubscriber = false;
        localStorage.setItem(storageKey, JSON.stringify(state));
      }
    }
  } catch (err) {
    console.error('Failed to revoke Pro access:', err);
  }
}

/**
 * Checks with the remote authority (/api/verify-license and Supabase)
 * to determine if this athlete's Pro access has been remotely revoked.
 * If revoked, it automatically wipes the local Pro tokens and returns { valid: false, revoked: true }.
 */
export async function checkRemoteEntitlement(
  account?: UserAccount | null,
  receiptId?: string
): Promise<{ valid: boolean; revoked: boolean; reason?: string }> {
  if (!account) {
    return { valid: true, revoked: false };
  }

  // 1. Check Supabase profiles table if connected
  if (supabase && !account.isGuest) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_pro, pro_revoked')
        .eq('id', account.id)
        .maybeSingle();

      if (!error && data) {
        if (data.pro_revoked === true) {
          revokeProAccess(account.id);
          return { valid: false, revoked: true, reason: 'Revoked in central database' };
        }
      }
    } catch {
      // offline / non-blocking
    }
  }

  // 2. Query Vercel serverless /api/verify-license
  try {
    const params = new URLSearchParams({
      userId: account.id || '',
      email: account.email || '',
      receiptId: receiptId || '',
    });

    const res = await fetch(`/api/verify-license?${params.toString()}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.revoked === true || data.valid === false) {
        revokeProAccess(account.id);
        return { valid: false, revoked: true, reason: data.reason || 'Revoked by administrator' };
      }
    }
  } catch {
    // Network offline: retain existing offline capabilities
  }

  return { valid: true, revoked: false };
}

/**
 * Asynchronously verifies the passcode with the serverless authority (/api/verify-license)
 * first. Falls back to local verification if completely offline.
 */
export async function verifyEmperorPasscodeOnline(
  code: string,
  account?: UserAccount | null
): Promise<{ success: boolean; message?: string }> {
  if (!code) return { success: false, message: 'Passcode is required.' };

  // 1. Try server-side verification
  try {
    const res = await fetch('/api/verify-license', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        passcode: code,
        userId: account?.id,
        email: account?.email,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        try {
          localStorage.setItem('homodevs_vip_passcode_unlocked', 'true');
        } catch {
          // ignore
        }
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Invalid Emperor Passcode.' };
      }
    }
  } catch {
    // Network unavailable, fallback to local check below
  }

  // 2. Offline / local fallback
  const isMatch = verifyEmperorPasscode(code);
  return {
    success: isMatch,
    message: isMatch ? 'Passcode verified offline.' : 'Invalid Emperor Passcode.',
  };
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

function getLocalWorkoutHistoryStats(): { tonnage: number; sets: number; count: number } {
  try {
    const raw = localStorage.getItem('homodevs_workout_history_v1');
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        const tonnage = list.reduce((acc: number, s: any) => acc + (s.totalTonnageKg || 0), 0);
        const sets = list.reduce((acc: number, s: any) => acc + (s.completedSetsCount || 0), 0);
        return { tonnage, sets, count: list.length };
      }
    }
  } catch {
    // ignore
  }
  return { tonnage: 0, sets: 0, count: 0 };
}

/**
 * Generates an initial clean state for a new user account (unfilled/fresh)
 */
export function createInitialStateForUser(account: UserAccount): AppState {
  // If this is Gabriele, provide his curated profile; otherwise provide fresh blank template
  const isGabriele = Boolean(account.name.toLowerCase() === 'gabriele' || account.email?.toLowerCase().includes('gabriele'));

  const profile: UserProfile = isGabriele
    ? { ...GABRIELE_PROFILE_TEMPLATE }
    : {
        ...DEFAULT_PROFILE,
        name: account.name,
      };

  const weeklyPlan = generateWeeklyPlan(profile);
  const todayWorkout = resolveTodayWorkout(weeklyPlan, profile);
  const historyStats = getLocalWorkoutHistoryStats();
  const totalTonnageKg = historyStats.tonnage;
  const xp = Math.round(totalTonnageKg * 0.05 + historyStats.sets * 25 + historyStats.count * 150);

  return {
    userId: account.id,
    userAccount: account,
    profile,
    weeklyPlan,
    todayWorkout,
    completedSets: {},
    setTypes: {},
    loggedWeights: {},
    totalTonnageKg,
    xp,
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
        // Auto-recover unsealed completed sets from earlier dates into history
        const hasCompletedSets = Object.values(parsed.completedSets || {}).some((arr: any) => 
          Array.isArray(arr) && arr.some(Boolean)
        );

        let activeDate = parsed.activeSessionDate;
        if (!activeDate && hasCompletedSets) {
          const pastDate = new Date();
          pastDate.setDate(pastDate.getDate() - 2);
          activeDate = pastDate.toISOString().split('T')[0];
        }

        if (hasCompletedSets && activeDate && activeDate < todayWorkout.date) {
          const completedCount = Object.values(parsed.completedSets || {}).reduce(
            (acc: number, arr: any) => acc + (Array.isArray(arr) ? arr.filter(Boolean).length : 0), 0
          );
          
          try {
            const rawHistory = localStorage.getItem('homodevs_workout_history_v1');
            const existingHistory = rawHistory ? JSON.parse(rawHistory) : [];
            const alreadyExists = existingHistory.some((s: any) => s.date === activeDate);
            
            if (!alreadyExists && completedCount > 0) {
              const activeDateTime = new Date(activeDate);
              const dayName = isNaN(activeDateTime.getTime()) 
                ? 'Session Day' 
                : activeDateTime.toLocaleDateString('en-US', { weekday: 'long' });
              
              // Resolve actual plan matching this day
              const plan = generateWeeklyPlan(parsed.profile);
              const dayOfWeek = isNaN(activeDateTime.getTime()) ? 1 : activeDateTime.getDay();
              const scheduledWorkout = plan.find(w => w.dayIndex === dayOfWeek) || plan[0];
              const workoutName = scheduledWorkout?.name || 'Logged Workout Session';
              
              const loggedWeights = parsed.loggedWeights || {};
              let computedTonnageKg = 0;

              const exerciseRecords = Object.entries(parsed.completedSets || {}).map(([id, sets]: any) => {
                const weight = Number(loggedWeights[id]) || 0;
                const completedSetsArray = Array.isArray(sets) ? sets : [];
                const completedInThisEx = completedSetsArray.filter(Boolean).length;
                
                // Find exercise in schedule to get rep estimate
                const matchedEx = scheduledWorkout?.exercises.find(e => e.id === id);
                const repMatch = matchedEx?.reps?.match(/\d+/g);
                const avgReps = repMatch ? (repMatch.length > 1 ? Math.round((Number(repMatch[0]) + Number(repMatch[1])) / 2) : Number(repMatch[0])) : 10;
                
                if (weight > 0 && completedInThisEx > 0) {
                  computedTonnageKg += Math.round(weight * completedInThisEx * avgReps);
                }

                return {
                  id,
                  name: matchedEx?.name || id.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
                  category: matchedEx?.category || ('push' as const),
                  sets: completedSetsArray.map((c: boolean, idx: number) => ({
                    setNumber: idx + 1,
                    type: 'normal' as const,
                    weightKg: weight,
                    reps: avgReps,
                    completed: Boolean(c),
                  })),
                };
              });

              const autoSession = {
                id: `session_auto_${Date.now()}_${activeDate}`,
                date: activeDate,
                dayName,
                workoutName,
                durationMinutes: scheduledWorkout?.estimatedDurationMinutes || 60,
                totalTonnageKg: parsed.totalTonnageKg && parsed.totalTonnageKg > 0 ? parsed.totalTonnageKg : computedTonnageKg,
                completedSetsCount: completedCount,
                totalSetsCount: completedCount,
                prCount: 0,
                exercises: exerciseRecords,
              };
              existingHistory.unshift(autoSession);
              localStorage.setItem('homodevs_workout_history_v1', JSON.stringify(existingHistory.slice(0, 100)));
              parsed.completedSets = {};
            }
          } catch {
            // ignore
          }
        }

        const isVip = isLifetimeVipUser(account) || isPasscodeUnlocked();
        const historyStats = getLocalWorkoutHistoryStats();
        const totalTonnageKg = Math.max(parsed.totalTonnageKg || 0, historyStats.tonnage);
        const xp = Math.max(parsed.xp || 0, Math.round(totalTonnageKg * 0.05 + historyStats.sets * 25 + historyStats.count * 150));
        return {
          ...parsed,
          userId,
          userAccount: account,
          todayWorkout,
          totalTonnageKg,
          xp,
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
