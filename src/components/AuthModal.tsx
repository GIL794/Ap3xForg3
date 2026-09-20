import React, { useState } from 'react';
import { UserAccount } from '../types';
import { 
  getAllUserAccounts, 
  loginAthleteByName, 
  signInWithGoogle, 
  setActiveUserId 
} from '../logic/auth';
import { X, User, LogIn, ArrowRight, ShieldCheck, Sparkles, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onUserChanged: (newUser: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged,
}) => {
  const [athleteName, setAthleteName] = useState('');
  const [athleteEmail, setAthleteEmail] = useState('');
  const [allUsers, setAllUsers] = useState<UserAccount[]>(() => getAllUserAccounts());
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (!isOpen) return null;

  const handleSwitchUser = (user: UserAccount) => {
    setActiveUserId(user.id);
    onUserChanged(user);
    onClose();
  };

  const handleCreateOrLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!athleteName.trim()) return;
    const account = loginAthleteByName(athleteName, athleteEmail);
    setAllUsers(getAllUserAccounts());
    onUserChanged(account);
    onClose();
  };

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      const { error } = await signInWithGoogle();
      if (!error) {
        const users = getAllUserAccounts();
        const active = users[users.length - 1] || currentUser;
        onUserChanged(active);
        onClose();
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-7 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Ap3xF0rg3" className="w-10 h-10 rounded-2xl object-cover" />
            <div>
              <h3 className="text-base font-black text-white">Athlete Account Portal</h3>
              <p className="text-[11px] text-slate-400">Isolated workouts, tonnage & state</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Currently Logged-in Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-xs font-bold text-white block">{currentUser.name}</span>
              <span className="text-[10px] text-slate-400 truncate max-w-[180px] block">{currentUser.email || 'Athlete Profile'}</span>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>

        {/* Google OAuth Login Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoggingIn}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2.5 border border-slate-700 shadow-sm transition-all mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
            />
          </svg>
          <span>{isLoggingIn ? 'Connecting...' : 'Continue with Google'}</span>
        </button>

        <div className="flex items-center my-3 text-[11px] text-slate-500">
          <div className="flex-1 border-t border-slate-800" />
          <span className="px-2">or switch athlete account</span>
          <div className="flex-1 border-t border-slate-800" />
        </div>

        {/* Existing Accounts List */}
        {allUsers.length > 1 && (
          <div className="space-y-1.5 mb-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Saved Athletes on this Device:
            </span>
            {allUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => handleSwitchUser(u)}
                className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all border ${
                  u.id === currentUser.id
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>{u.name}</span>
                {u.id === currentUser.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="text-[10px] text-slate-500">Switch</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Create / Sign in with Codename */}
        <form onSubmit={handleCreateOrLogin} className="space-y-2.5 pt-2 border-t border-slate-800">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Add / Login with Athlete Codename
          </label>
          <input
            type="text"
            value={athleteName}
            onChange={(e) => setAthleteName(e.target.value)}
            placeholder="Athlete Name (e.g. Alex, Marco)"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-cyan-500"
            required
          />
          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login Athlete</span>
          </button>
        </form>
      </div>
    </div>
  );
};
