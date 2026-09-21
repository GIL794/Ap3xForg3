import React, { useState } from 'react';
import { 
  UserProfile, 
  ExperienceLevel, 
  PrimaryGoal, 
  SecondaryGoal, 
  EquipmentType,
  MythologicalArchetype
} from '../types';
import { 
  User, 
  MapPin, 
  Target, 
  Calendar, 
  Clock, 
  Dumbbell, 
  AlertTriangle, 
  HeartHandshake, 
  Sparkles, 
  RotateCcw, 
  Save, 
  ChevronDown, 
  ChevronUp,
  Crown,
  Scale,
  Activity
} from 'lucide-react';
import { DAY_NAMES, DAY_NAMES_SHORT, DEFAULT_PROFILE } from '../data/defaultProfile';
import { SupportedLanguage, t } from '../logic/i18n';

interface ProfileFormProps {
  profile: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
  onGeneratePlan: (updatedProfile: UserProfile) => void;
  onResetDefaults: () => void;
  language?: SupportedLanguage;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onSaveProfile,
  onGeneratePlan,
  onResetDefaults,
  language = 'en',
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isOpen, setIsOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Sync internal state if profile prop changes outside
  React.useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const primaryGoalOptions: { value: PrimaryGoal; label: string }[] = [
    { value: 'upper_body_hypertrophy', label: 'Upper-Body Hypertrophy (Muscle Growth)' },
    { value: 'full_body_hypertrophy', label: 'Full-Body Hypertrophy' },
    { value: 'strength', label: 'Strength Focus (Upper & Lower Overload)' },
    { value: 'fat_loss', label: 'Fat Loss + Muscle Maintenance' },
    { value: 'general_fitness', label: 'General Fitness & Athleticism' },
  ];

  const secondaryGoalOptions: { value: SecondaryGoal; label: string }[] = [
    { value: 'strength', label: 'Raw Strength' },
    { value: 'aesthetics', label: 'Aesthetics & Proportions' },
    { value: 'endurance', label: 'Work Capacity / Conditioning' },
    { value: 'mobility', label: 'Joint Mobility & Longevity' },
    { value: 'core_stability', label: 'Core Stability' },
  ];

  const equipmentOptions: { value: EquipmentType; label: string }[] = [
    { value: 'free_weights', label: 'Free Weights (Barbells & DBs)' },
    { value: 'machines', label: 'Gym Machines' },
    { value: 'cables', label: 'Cable Towers' },
    { value: 'bodyweight', label: 'Bodyweight / Calisthenics' },
    { value: 'bands', label: 'Resistance Bands' },
  ];

  const timezoneOptions = [
    'Europe/London',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
  ];

  // Ordered 1..6, 0 (Mon..Sun)
  const daysOrder = [1, 2, 3, 4, 5, 6, 0];

  const handleToggleDay = (dayIndex: number) => {
    const exists = formData.availableDays.includes(dayIndex);
    const updatedDays = exists
      ? formData.availableDays.filter(d => d !== dayIndex)
      : [...formData.availableDays, dayIndex];

    setFormData({
      ...formData,
      availableDays: updatedDays,
    });
  };

  const handleToggleSecondaryGoal = (goal: SecondaryGoal) => {
    const exists = formData.secondaryGoals.includes(goal);
    const updated = exists
      ? formData.secondaryGoals.filter(g => g !== goal)
      : [...formData.secondaryGoals, goal];

    setFormData({
      ...formData,
      secondaryGoals: updated,
    });
  };

  const handleToggleEquipment = (eq: EquipmentType) => {
    const exists = formData.equipment.includes(eq);
    const updated = exists
      ? formData.equipment.filter(e => e !== eq)
      : [...formData.equipment, eq];

    setFormData({
      ...formData,
      equipment: updated,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGeneratePlan(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleSaveOnly = () => {
    onSaveProfile(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm("Reset profile to default calibration?")) {
      setFormData({ ...DEFAULT_PROFILE, name: formData.name });
      onResetDefaults();
    }
  };

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden transition-all">
      {/* Header bar / accordion toggle */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white">
                {t('profile.title', language)}
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                {formData.name} • {formData.experience}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {formData.availableDays.length} days/week • {formData.sessionLengthMinutes} min sessions • Target: {formData.targetWorkoutTime}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveToast && (
            <span className="text-xs font-semibold text-emerald-400 animate-in fade-in">
              Settings Applied! ✓
            </span>
          )}
          <button 
            type="button" 
            className="p-1 text-slate-400 hover:text-white"
            aria-label="Toggle profile details"
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Form Content */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 border-t border-slate-800 space-y-6 animate-in fade-in duration-200">
          {/* Olympian Mythological Archetype Selector (Male & Female Inclusive) */}
          <div className="space-y-3">
            <label className="block text-xs font-roman font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Olympian Physique Archetype</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {[
                { id: 'hercules_mass', name: 'The Titan', god: 'Hercules', emoji: '🏛️', gender: 'Masc', focus: 'Mass & Power' },
                { id: 'artemis_power', name: 'The Huntress', god: 'Artemis', emoji: '🏹', gender: 'Fem', focus: 'Glutes & Speed' },
                { id: 'adonis_aesthetic', name: 'The Olympian', god: 'Adonis', emoji: '⚡', gender: 'Masc', focus: 'V-Taper Symmetry' },
                { id: 'athena_sculpt', name: 'The War Goddess', god: 'Athena', emoji: '🛡️', gender: 'Fem', focus: 'Delts & Posture' },
                { id: 'ares_combat', name: 'The Centurion', god: 'Ares', emoji: '⚔️', gender: 'Masc', focus: 'Warrior Stamina' },
                { id: 'aphrodite_curves', name: 'The Sovereign', god: 'Aphrodite', emoji: '👑', gender: 'Fem', focus: 'Hourglass Curves' },
              ].map((arch) => {
                const isSelected = (formData.archetype || 'hercules_mass') === arch.id;
                return (
                  <button
                    key={arch.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, archetype: arch.id as MythologicalArchetype })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/15 shadow-md shadow-amber-500/10'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl">{arch.emoji}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-slate-900 text-slate-400">
                        {arch.gender}
                      </span>
                    </div>
                    <div className="font-roman font-black text-xs text-white truncate">
                      {arch.name}
                    </div>
                    <div className="text-[10px] text-amber-400/90 font-roman truncate">
                      {arch.god}
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5 truncate">
                      {arch.focus}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 1: Name, Location, Timezone */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" /> {t('profile.name', language)}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                placeholder="Name"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> {t('profile.location', language)}
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                placeholder="e.g. London, UK"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> Timezone
              </label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                {timezoneOptions.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 1.5: Body & Physique Metrics (Fitbod / Hevy Caliber) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-black font-roman uppercase tracking-wider text-white">
                  {t('profile.bodyMetrics', language)}
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-roman font-bold border border-amber-500/30">
                Fitbod & Hevy Calibration
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {t('profile.bodyMetricsDesc', language)}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  {t('profile.age', language)}
                </label>
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
                  <input
                    type="number"
                    min="14"
                    max="100"
                    value={formData.ageYears || ''}
                    placeholder="28"
                    onChange={(e) => setFormData({ ...formData, ageYears: Number(e.target.value) || undefined })}
                    className="w-full bg-transparent text-sm text-white font-bold mono-font focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 ml-1">yrs</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  {t('profile.height', language)}
                </label>
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
                  <input
                    type="number"
                    min="100"
                    max="250"
                    value={formData.heightCm || ''}
                    placeholder="180"
                    onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) || undefined })}
                    className="w-full bg-transparent text-sm text-white font-bold mono-font focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 ml-1">cm</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  {t('profile.currentWeight', language)}
                </label>
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
                  <input
                    type="number"
                    step="0.5"
                    min="30"
                    max="300"
                    value={formData.currentWeightKg || ''}
                    placeholder="80"
                    onChange={(e) => setFormData({ ...formData, currentWeightKg: Number(e.target.value) || undefined })}
                    className="w-full bg-transparent text-sm text-amber-300 font-bold mono-font focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 ml-1">kg</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  {t('profile.goalWeight', language)}
                </label>
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
                  <input
                    type="number"
                    step="0.5"
                    min="30"
                    max="300"
                    value={formData.goalWeightKg || ''}
                    placeholder="85"
                    onChange={(e) => setFormData({ ...formData, goalWeightKg: Number(e.target.value) || undefined })}
                    className="w-full bg-transparent text-sm text-emerald-300 font-bold mono-font focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 ml-1">kg</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  {t('profile.bodyFat', language)}
                </label>
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
                  <input
                    type="number"
                    step="0.5"
                    min="4"
                    max="60"
                    value={formData.bodyFatPercent || ''}
                    placeholder="15"
                    onChange={(e) => setFormData({ ...formData, bodyFatPercent: Number(e.target.value) || undefined })}
                    className="w-full bg-transparent text-sm text-white font-bold mono-font focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 ml-1">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Experience, Primary Goal, Workout Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Experience Level
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Beginner', 'Intermediate', 'Advanced'] as ExperienceLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, experience: level })}
                    className={`py-2 text-xs font-bold rounded-xl transition-all ${
                      formData.experience === level
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" /> Primary Focus
              </label>
              <select
                value={formData.primaryGoal}
                onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value as PrimaryGoal })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-medium"
              >
                {primaryGoalOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Target Gym Time Today
              </label>
              <input
                type="time"
                value={formData.targetWorkoutTime}
                onChange={(e) => setFormData({ ...formData, targetWorkoutTime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white mono-font focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Row 3: Available Training Days */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Available Days per Week ({formData.availableDays.length} Selected)
            </label>
            <div className="grid grid-cols-7 gap-2">
              {daysOrder.map((dayIdx) => {
                const isSelected = formData.availableDays.includes(dayIdx);
                const isSunday = dayIdx === 0;
                return (
                  <button
                    key={dayIdx}
                    type="button"
                    onClick={() => handleToggleDay(dayIdx)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                      isSelected
                        ? isSunday 
                          ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400/40' 
                          : 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>{DAY_NAMES_SHORT[dayIdx]}</span>
                    {isSunday && <span className="text-[9px] font-bold uppercase">Today</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Session Duration & Secondary Goals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> Typical Session Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[45, 60, 75, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setFormData({ ...formData, sessionLengthMinutes: mins })}
                    className={`py-2 rounded-xl text-xs font-bold transition-all mono-font ${
                      formData.sessionLengthMinutes === mins
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Secondary Goals (Multi-select)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {secondaryGoalOptions.map(sg => {
                  const isSelected = formData.secondaryGoals.includes(sg.value);
                  return (
                    <button
                      key={sg.value}
                      type="button"
                      onClick={() => handleToggleSecondaryGoal(sg.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {sg.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 5: Equipment Access */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-slate-500" /> Equipment Access
            </label>
            <div className="flex flex-wrap gap-2">
              {equipmentOptions.map(eq => {
                const isSelected = formData.equipment.includes(eq.value);
                return (
                  <button
                    key={eq.value}
                    type="button"
                    onClick={() => handleToggleEquipment(eq.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {eq.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 6: Injuries & Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Injuries / Physical Limitations
              </label>
              <input
                type="text"
                value={formData.injuries}
                onChange={(e) => setFormData({ ...formData, injuries: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                placeholder="e.g. Left shoulder impingement, lower back stiffness"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-slate-500" /> Training Preferences & Style
              </label>
              <input
                type="text"
                value={formData.preferences}
                onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                placeholder="e.g. Likes compound lifts, progressive overload"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t('profile.reset', language)}
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleSaveOnly}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
              >
                <Save className="w-3.5 h-3.5" />
                {t('profile.save', language)}
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 transition-all font-roman uppercase tracking-wider"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                {t('profile.generate', language)}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
