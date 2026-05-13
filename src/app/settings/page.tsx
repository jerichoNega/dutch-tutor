"use client";

import { useProgress } from "@/lib/ProgressContext";
import { motion } from "framer-motion";
import { 
  User, 
  Settings as SettingsIcon, 
  Trash2, 
  Save, 
  RefreshCcw,
  Smile,
  ShieldAlert,
  Briefcase
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const { progress, updateSettings, resetProgress } = useProgress();
  const [name, setName] = useState(progress.settings.userName);
  const [difficulty, setDifficulty] = useState(progress.settings.difficulty);
  const [personality, setPersonality] = useState(progress.settings.aiPersonality);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings({
      userName: name,
      difficulty,
      aiPersonality: personality,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetProgress();
    setName("Student");
    setDifficulty("B1");
    setPersonality("friendly");
    setShowResetConfirm(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            Settings <SettingsIcon className="h-8 w-8 text-slate-400" />
          </h2>
          <p className="mt-2 text-slate-500 text-lg font-medium">Personalize your learning experience.</p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-lg transition-all shadow-lg shadow-orange-900/20 active:scale-95"
        >
          {saved ? "Saved!" : <><Save className="mr-2 h-5 w-5" /> Save Changes</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
              <User className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Profile</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-orange-500 focus:ring-0 outline-none transition-all font-bold text-slate-700"
                placeholder="Hoe heet je?"
              />
            </div>
          </div>
        </motion.div>

        {/* AI Personality Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
              <Smile className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">AI Personality</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'friendly', label: 'Friendly', icon: Smile, color: 'bg-green-500' },
              { id: 'professional', label: 'Professional', icon: Briefcase, color: 'bg-blue-500' },
              { id: 'strict', label: 'Strict', icon: ShieldAlert, color: 'bg-red-500' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPersonality(p.id as any)}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all font-bold ${
                  personality === p.id 
                    ? 'border-orange-500 bg-orange-50 text-orange-700' 
                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <p.icon className="h-5 w-5" />
                  {p.label}
                </div>
                {personality === p.id && <div className="h-2 w-2 rounded-full bg-orange-500" />}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Learning Goal Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
              <RefreshCcw className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Difficulty Level</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['A2+', 'B1', 'B1+'].map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level as any)}
                className={`py-4 rounded-2xl border-2 transition-all font-black ${
                  difficulty === level 
                    ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-lg shadow-purple-200' 
                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Danger Zone Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-red-50 p-8 rounded-[2.5rem] border-2 border-red-100 shadow-xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-100 rounded-2xl text-red-600">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-black text-red-900">Danger Zone</h3>
          </div>
          <p className="text-red-700 font-medium mb-6 leading-relaxed">
            Deleting your progress is permanent. You will lose your streak, mastered words, and completed lessons.
          </p>
          
          {showResetConfirm ? (
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black transition-all"
              >
                Yes, Reset All
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-4 rounded-2xl bg-white border-2 border-red-200 text-red-600 font-black hover:bg-red-50 transition-all"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-4 rounded-2xl bg-white border-2 border-red-200 text-red-600 font-black hover:bg-red-100 hover:border-red-300 transition-all"
            >
              Reset All Progress
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
