"use client";

import { 
  MessageSquare, 
  BookOpen, 
  GraduationCap, 
  ArrowRight,
  Zap,
  CheckCircle,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useProgress } from "@/lib/ProgressContext";
import { motion } from "framer-motion";

export default function Home() {
  const { stats, curriculum, progress } = useProgress();
  
  const nextLesson = curriculum.find(l => l.status === "available");

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            Hoi {progress.settings.userName}! <Sparkles className="h-8 w-8 text-orange-500 fill-orange-500" />
          </h2>
          <p className="mt-2 text-slate-500 text-lg font-medium">Laten we vandaag verder gaan met je Nederlands.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-xl shadow-slate-200/50"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-orange-100 rounded-2xl">
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Voortgang</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900">{stats.completionPercentage}%</h3>
          <div className="mt-6 h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${stats.completionPercentage}%` }}
              className="h-full bg-orange-500 rounded-full" 
            />
          </div>
          <p className="mt-4 text-sm font-black text-slate-600">Niveau: B1 (In Training)</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-xl shadow-slate-200/50"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Woorden</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900">{stats.wordsCount}</h3>
          <p className="mt-4 text-sm font-bold text-slate-600 italic leading-relaxed">
            Nieuwe woorden beheerst in deze sessie.
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-xl shadow-slate-200/50"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-green-100 rounded-2xl">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Streak</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900">{stats.activeStreak} Dagen</h3>
          <p className="mt-4 text-sm font-bold text-slate-600">Goed bezig! Houd dit vast.</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl">
          <div className="relative z-10">
            <h3 className="text-4xl font-black mb-4 leading-tight">Live Gesprek<br/>met Lars</h3>
            <p className="text-slate-400 mb-10 max-w-sm text-lg font-medium leading-relaxed">
              Oefen je spreekvaardigheid in een echt B1 gesprek. Lars luistert naar je.
            </p>
            <Link 
              href="/chat"
              className="inline-flex items-center px-10 py-5 rounded-3xl bg-orange-500 hover:bg-orange-600 transition-all font-black text-xl shadow-2xl shadow-orange-900/50 hover:scale-105"
            >
              Start Gesprek <ArrowRight className="ml-2 h-7 w-7" />
            </Link>
          </div>
          <MessageSquare className="absolute -right-12 -bottom-12 h-64 w-64 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
        </div>

        <div className="lg:col-span-2 bg-white border-4 border-slate-900 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-xl">
          <div className="relative z-10 flex flex-col h-full">
            <h3 className="text-3xl font-black mb-4 text-slate-900">Volgende Les</h3>
            {nextLesson ? (
              <>
                <div className="mb-8">
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                    {nextLesson.level}
                  </span>
                  <h4 className="text-xl font-black text-slate-800 mt-4">{nextLesson.title}</h4>
                  <p className="text-slate-500 font-bold mt-1">{nextLesson.topic}</p>
                </div>
                <div className="mt-auto">
                  <Link 
                    href="/grammar"
                    className="w-full inline-flex items-center justify-center px-8 py-5 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all font-black text-lg hover:scale-105"
                  >
                    Start Les <ArrowRight className="ml-2 h-6 w-6" />
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-slate-500 font-bold">Alle lessen voltooid! Goed gedaan!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
