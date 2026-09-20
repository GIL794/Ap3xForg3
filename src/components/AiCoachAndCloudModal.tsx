import React, { useState, useEffect } from 'react';
import { UserProfile, TodayWorkout, WorkoutDay } from '../types';
import { 
  generateAiCoachingRecommendations, 
  AiCoachRecommendation, 
  getSavedGeminiKey, 
  saveGeminiKey 
} from '../logic/aiCoach';
import { generateShareableUrl } from '../logic/supabase';
import { 
  Bot, 
  Sparkles, 
  Share2, 
  Key, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  Flame, 
  ArrowRight,
  ShieldCheck,
  Crown,
  Lock
} from 'lucide-react';

interface AiCoachAndCloudModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  todayWorkout: TodayWorkout;
  weeklyPlan: WorkoutDay[];
  isProSubscriber?: boolean;
  onOpenPro?: () => void;
}

export const AiCoachAndCloudModal: React.FC<AiCoachAndCloudModalProps> = ({
  isOpen,
  onClose,
  profile,
  todayWorkout,
  weeklyPlan,
  isProSubscriber = false,
  onOpenPro,
}) => {
  const [activeTab, setActiveTab] = useState<'ai_coach' | 'share'>('ai_coach');
  const [apiKey, setApiKey] = useState<string>(getSavedGeminiKey());
  const [showKeyOverride, setShowKeyOverride] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<AiCoachRecommendation | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setShareUrl(generateShareableUrl(profile, weeklyPlan));
      if (isProSubscriber) {
        handleFetchRecommendations();
      }
    }
  }, [isOpen, profile, todayWorkout, isProSubscriber]);

  const handleFetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const rec = await generateAiCoachingRecommendations(profile, todayWorkout, apiKey);
      setRecommendation(rec);
    } catch (err) {
      console.error('Failed to get coaching recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    saveGeminiKey(apiKey);
    handleFetchRecommendations();
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0c0e17] border-2 border-amber-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-amber-500/20 bg-gradient-to-r from-amber-950/30 via-slate-950 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-bold shadow-md shadow-amber-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black font-roman text-white tracking-wide">
                  Oracle AI Physiologist
                </h3>
                {isProSubscriber ? (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-roman">
                    👑 Imperivm Pro
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-roman">
                    🔒 Pro Feature
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-roman">
                Sport-science hypertrophy audit & legion cloud sharing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/60 text-xs font-bold font-roman">
          <button
            onClick={() => setActiveTab('ai_coach')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'ai_coach'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Oracle Advice
          </button>

          <button
            onClick={() => setActiveTab('share')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'share'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-4 h-4" /> Share with Legion
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* TAB 1: AI COACH */}
          {activeTab === 'ai_coach' && (
            <div className="space-y-5">
              {/* PAYWALL GATE IF NOT PRO */}
              {!isProSubscriber ? (
                <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/30 via-slate-950 to-slate-950 border-2 border-amber-500/40 text-center space-y-4 glow-gold">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Lock className="w-7 h-7 stroke-[2.5]" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xl font-black font-roman text-white uppercase tracking-wider">
                      Oracle AI is an <span className="text-amber-400">Imperivm Pro</span> Asset
                    </h4>
                    <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                      Upgrade to unlock zero-setup, real-time Gemini Flash sport-science analysis for every session without needing any technical API keys.
                    </p>
                  </div>

                  {/* Included in Oracle AI */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left text-xs max-w-lg mx-auto pt-2">
                    <div className="p-3 rounded-xl bg-black/50 border border-amber-500/20 text-slate-300 flex items-start gap-2">
                      <span className="text-amber-400">⚡</span>
                      <span><strong>RPE & Tension Audit:</strong> Live feedback on compound loadouts.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/50 border border-amber-500/20 text-slate-300 flex items-start gap-2">
                      <span className="text-amber-400">🛡️</span>
                      <span><strong>Injury Swaps:</strong> Instant alternatives tailored to equipment.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/50 border border-amber-500/20 text-slate-300 flex items-start gap-2">
                      <span className="text-amber-400">🥗</span>
                      <span><strong>Nutrient Timing:</strong> Fueling guidelines calibrated to your 19:00 gym time.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/50 border border-amber-500/20 text-slate-300 flex items-start gap-2">
                      <span className="text-amber-400">👑</span>
                      <span><strong>Zero Setup:</strong> Runs out of the box with zero user configuration.</span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => {
                        onClose();
                        if (onOpenPro) onOpenPro();
                      }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-roman font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all inline-flex items-center gap-2"
                    >
                      <Crown className="w-4 h-4 fill-slate-950" />
                      <span>Unlock Oracle AI with Imperivm Pro</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* PRO SUBSCRIBER UNLOCKED VIEW */
                <div className="space-y-4">
                  {/* Status Pill */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                    <div className="flex items-center gap-2 font-roman">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span><strong>Oracle Engine Active:</strong> Fully managed sport-science AI</span>
                    </div>
                    <button
                      onClick={handleFetchRecommendations}
                      disabled={isLoading}
                      className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-roman font-bold transition-colors"
                    >
                      {isLoading ? 'Consulting...' : 'Refresh Audit'}
                    </button>
                  </div>

                  {isLoading && (
                    <div className="p-8 text-center space-y-3">
                      <div className="w-8 h-8 mx-auto border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs text-slate-400 font-roman animate-pulse">
                        Consulting the Olympian sport-science oracle...
                      </p>
                    </div>
                  )}

                  {recommendation && !isLoading && (
                    <div className="space-y-4">
                      {/* Summary */}
                      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-roman uppercase font-bold text-amber-400 tracking-wider">
                          Executive Assessment
                        </span>
                        <p className="text-xs text-slate-200 leading-relaxed font-sans">
                          {recommendation.summary}
                        </p>
                      </div>

                      {/* Intensity & Volume */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                          <span className="text-[10px] font-roman uppercase font-bold text-cyan-400 tracking-wider">
                            RPE & Tension Strategy
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {recommendation.intensityCritique}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                          <span className="text-[10px] font-roman uppercase font-bold text-emerald-400 tracking-wider">
                            Volume & Recovery Ratio
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {recommendation.volumeEvaluation}
                          </p>
                        </div>
                      </div>

                      {/* Swaps */}
                      {recommendation.suggestedSwaps && recommendation.suggestedSwaps.length > 0 && (
                        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                          <span className="text-[10px] font-roman uppercase font-bold text-amber-400 tracking-wider">
                            Suggested Biomechanical Swaps
                          </span>
                          <div className="space-y-2">
                            {recommendation.suggestedSwaps.map((swap, idx) => (
                              <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                  <span className="text-slate-400 line-through mr-2">{swap.original}</span>
                                  <strong className="text-amber-300">➔ {swap.suggested}</strong>
                                </div>
                                <span className="text-[11px] text-slate-400 italic">{swap.reason}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pre-workout Fueling */}
                      <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/20 space-y-1">
                        <span className="text-[10px] font-roman uppercase font-bold text-amber-300 tracking-wider flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5" />
                          Pre-Workout Priming ({profile.targetWorkoutTime})
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {recommendation.preWorkoutTip}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Optional Developer Override (Collapsed) */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => setShowKeyOverride(!showKeyOverride)}
                      className="text-[11px] text-slate-500 hover:text-slate-400 font-roman flex items-center gap-1"
                    >
                      <Key className="w-3 h-3" />
                      <span>{showKeyOverride ? 'Hide Developer Key Override' : 'Developer: Custom Gemini API Key Override (Optional)'}</span>
                    </button>

                    {showKeyOverride && (
                      <div className="mt-2 p-3 rounded-xl bg-black/50 border border-slate-800 space-y-2 text-xs">
                        <p className="text-[11px] text-slate-400">
                          As a Pro user, the platform automatically powers your requests. If you are a developer and wish to test your own Google AI Studio key, you can override it here.
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="AIzaSy..."
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                          />
                          <button
                            onClick={handleSaveApiKey}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-roman font-bold"
                          >
                            Save Override
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SHARE WITH LEGION */}
          {activeTab === 'share' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-white font-roman flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-amber-400" />
                  Instant Plan Share Link
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Share your exact weekly split, workout times, and exercises with friends. When they open this link, their app automatically loads your customized Olympian routine.
                </p>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyShareLink}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-roman font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
