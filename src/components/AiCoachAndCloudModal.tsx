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
  ShieldCheck
} from 'lucide-react';

interface AiCoachAndCloudModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  todayWorkout: TodayWorkout;
  weeklyPlan: WorkoutDay[];
}

export const AiCoachAndCloudModal: React.FC<AiCoachAndCloudModalProps> = ({
  isOpen,
  onClose,
  profile,
  todayWorkout,
  weeklyPlan,
}) => {
  const [activeTab, setActiveTab] = useState<'ai_coach' | 'share'>('ai_coach');
  const [apiKey, setApiKey] = useState<string>(getSavedGeminiKey());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<AiCoachRecommendation | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setShareUrl(generateShareableUrl(profile, weeklyPlan));
      handleFetchRecommendations();
    }
  }, [isOpen, profile, todayWorkout]);

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
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 text-slate-950 font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                AI Coach & Workout Sharing
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Zero Paywall
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Gemini LLM recommendations • Share plan with gym partners
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
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/40 text-xs font-bold">
          <button
            onClick={() => setActiveTab('ai_coach')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'ai_coach'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" /> AI Coach Advice
          </button>

          <button
            onClick={() => setActiveTab('share')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'share'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-4 h-4" /> Share with Friends
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: AI COACH */}
          {activeTab === 'ai_coach' && (
            <div className="space-y-5">
              {/* Gemini API Key configuration */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-bold text-slate-200">
                    <Key className="w-4 h-4 text-cyan-400" />
                    Google Gemini Flash API Key (Optional Free Tier)
                  </div>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                  >
                    <span>Get Free Key</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Google AI Studio offers a free tier (15 requests/min, 1,500/day, no credit card required). Paste your key below to activate live Gemini intelligence, or leave empty to use our built-in sport-science analyst!
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handleSaveApiKey}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                  >
                    {apiKey ? 'Apply Key' : 'Use Built-in'}
                  </button>
                </div>
              </div>

              {/* Coaching Feedback Cards */}
              {isLoading ? (
                <div className="p-8 text-center space-y-3">
                  <div className="inline-block w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-slate-400">Consulting AI exercise physiologist...</p>
                </div>
              ) : recommendation ? (
                <div className="space-y-4 text-xs">
                  {/* Summary */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-500/30">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider mb-1.5 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5" />
                      Session Assessment {recommendation.isAiGenerated ? '(Gemini Live)' : '(Sport-Science Analyst)'}
                    </div>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {recommendation.summary}
                    </p>
                  </div>

                  {/* Intensity & Volume Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                      <span className="font-bold text-amber-400 block mb-1 uppercase text-[10px]">
                        Target Effort & Mechanical Tension
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {recommendation.intensityCritique}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                      <span className="font-bold text-cyan-400 block mb-1 uppercase text-[10px]">
                        Volume & Recovery Check
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {recommendation.volumeEvaluation}
                      </p>
                    </div>
                  </div>

                  {/* Suggested Exercise Swaps */}
                  {recommendation.suggestedSwaps && recommendation.suggestedSwaps.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                      <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] block mb-2">
                        Recommended Exercise Swaps
                      </span>
                      <div className="space-y-2">
                        {recommendation.suggestedSwaps.map((swap, sIdx) => (
                          <div key={sIdx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                            <div className="flex items-center gap-2 font-semibold text-slate-200">
                              <span className="line-through text-slate-500">{swap.original}</span>
                              <ArrowRight className="w-3 h-3 text-cyan-400" />
                              <span className="text-emerald-400">{swap.suggested}</span>
                            </div>
                            <p className="text-slate-400 text-[11px] mt-1">{swap.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pre-workout tip */}
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-2.5">
                    <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-amber-300 mb-0.5 text-[11px] uppercase">
                        Pre-Workout Nutrition for {profile.targetWorkoutTime}
                      </strong>
                      <p className="text-slate-300">{recommendation.preWorkoutTip}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 2: SHARE WITH FRIENDS */}
          {activeTab === 'share' && (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
                <h4 className="font-bold text-sm text-emerald-300 mb-1 flex items-center gap-2">
                  <Share2 className="w-4 h-4" /> Instant Plan Link (Zero Setup Required)
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Your entire personalized split and today's workout are encoded into this URL. Anyone who clicks it will load your routine in their browser.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <label className="block text-slate-400 font-semibold">Shareable Workout Link:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 font-mono text-[11px] select-all truncate"
                  />
                  <button
                    onClick={handleCopyShareLink}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5 shrink-0"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-400 space-y-2">
                <span className="font-bold text-slate-200 uppercase text-[10px]">What your friends will see:</span>
                <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                  <li>Your customized progressive overload split</li>
                  <li>Today's full session with exact working sets, reps, and cues</li>
                  <li>Interactive set trackers and rest stopwatch</li>
                  <li>Ability to create their own athlete profile</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
