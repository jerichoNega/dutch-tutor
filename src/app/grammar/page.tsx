"use client";

import { useState, useEffect } from "react";
import { Lesson } from "@/lib/curriculum";
import { 
  BookOpen, 
  Lock, 
  CheckCircle, 
  Play, 
  GraduationCap, 
  ChevronRight,
  Loader2,
  Undo2,
  Clock,
  MessageSquare,
  ClipboardCheck,
  Lightbulb
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Quiz } from "@/components/Quiz";
import { useProgress } from "@/lib/ProgressContext";

type MasterclassStep = "overview" | "vocab" | "grammar" | "speaking" | "quiz";

export default function MasterclassPage() {
  const { curriculum, completeLesson, stats } = useProgress();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [currentStep, setCurrentStep] = useState<MasterclassStep>("overview");
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const startLesson = async (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentStep("overview");
  };

  const generateStepContent = async (step: MasterclassStep) => {
    if (!selectedLesson) return;
    setIsGenerating(true);
    setCurrentStep(step);
    
    // If it's the quiz, we need to fetch questions
    if (step === "quiz") {
      try {
        const response = await fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            lessonId: selectedLesson.id,
            topic: selectedLesson.topic,
            grammarFocus: selectedLesson.grammarFocus
          }),
        });
        const data = await response.json();
        setQuizQuestions(data.questions || []);
      } catch (e) {
        console.error(e);
      }
    }
    setIsGenerating(false);
  };

  const handleQuizComplete = (score: number) => {
    if (score >= 3 && selectedLesson) {
      completeLesson(selectedLesson.id);
    }
    setSelectedLesson(null);
    setCurrentStep("overview");
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-12 flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">30-Dag Masterclass</h2>
          <p className="mt-2 text-slate-500 text-lg font-medium">B1 Nederlands in 1 uur per dag</p>
        </div>
        <div className="hidden md:flex items-center gap-4 bg-white p-4 rounded-3xl border-2 border-slate-100 shadow-sm">
          <Clock className="text-orange-500" />
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400">Dag Totaal</div>
            <div className="text-sm font-bold text-slate-900">60 Minuten</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: The Roadmap */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2rem] text-white relative overflow-hidden shadow-2xl shadow-slate-200">
            <h3 className="text-xl font-bold mb-2">Masterclass Voortgang</h3>
            <div className="text-5xl font-black text-orange-500">{stats.completionPercentage}%</div>
            <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest">Dag {stats.activeStreak || 1} van de 30</p>
            <div className="mt-6 h-3 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stats.completionPercentage}%` }}
                className="h-full bg-orange-500 rounded-full" 
              />
            </div>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {curriculum.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => lesson.status !== "locked" && startLesson(lesson)}
                className={cn(
                  "w-full flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all text-left group",
                  selectedLesson?.id === lesson.id 
                    ? "border-orange-500 bg-orange-50 shadow-md" 
                    : "border-slate-100 bg-white hover:border-slate-300",
                  lesson.status === "locked" && "opacity-40 grayscale cursor-not-allowed"
                )}
              >
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black",
                  lesson.status === "completed" ? "bg-green-500 text-white" : 
                  lesson.status === "available" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
                )}>
                  {lesson.day}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{lesson.title}</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{lesson.topic}</p>
                </div>
                {lesson.status === "locked" ? <Lock className="h-4 w-4 text-slate-300" /> : <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-orange-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Right: The Active Module */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedLesson ? (
              <motion.div
                key={selectedLesson.id + currentStep}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-2xl p-10 min-h-[700px] flex flex-col"
              >
                {/* Header for Active Lesson */}
                <div className="flex items-center justify-between mb-10 pb-8 border-b-2 border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-2xl">
                      <GraduationCap className="h-8 w-8 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">{selectedLesson.title}</h3>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{selectedLesson.topic}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedLesson(null)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                    <Undo2 className="h-6 w-6 text-slate-300" />
                  </button>
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  {currentStep === "overview" && (
                    <div className="space-y-8">
                      <div className="p-8 bg-slate-50 rounded-[2rem] border-2 border-slate-100">
                        <h4 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                          <Lightbulb className="text-orange-500" /> Dagoverzicht
                        </h4>
                        <p className="text-slate-700 leading-relaxed font-medium text-lg">
                          {selectedLesson.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white border-2 border-slate-100 rounded-3xl">
                          <BookOpen className="text-blue-500 mb-3" />
                          <h5 className="font-black text-slate-900 text-sm">Vocabulaire</h5>
                          <p className="text-xs text-slate-400 mt-1">15 Minuten</p>
                        </div>
                        <div className="p-6 bg-white border-2 border-slate-100 rounded-3xl">
                          <ClipboardCheck className="text-purple-500 mb-3" />
                          <h5 className="font-black text-slate-900 text-sm">Grammatica</h5>
                          <p className="text-xs text-slate-400 mt-1">20 Minuten</p>
                        </div>
                        <div className="p-6 bg-white border-2 border-slate-100 rounded-3xl">
                          <MessageSquare className="text-green-500 mb-3" />
                          <h5 className="font-black text-slate-900 text-sm">Spreken</h5>
                          <p className="text-xs text-slate-400 mt-1">25 Minuten</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => generateStepContent("vocab")}
                        className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xl hover:bg-orange-500 transition-all shadow-xl shadow-slate-200 mt-8"
                      >
                        Start 60-Minuten Sessie
                      </button>
                    </div>
                  )}

                  {currentStep === "vocab" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase">Stap 1: Woordenschat</span>
                        <span className="text-xs font-bold text-slate-400">15m resterend</span>
                      </div>
                      <h4 className="text-3xl font-black text-slate-900">Belangrijke woorden voor vandaag</h4>
                      <p className="text-slate-500 font-medium leading-relaxed">Focus op: {selectedLesson.vocabularyCategory}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        {/* Placeholder for dynamic vocab cards */}
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="p-6 border-2 border-slate-100 rounded-3xl bg-slate-50 animate-pulse h-24" />
                        ))}
                      </div>

                      <button 
                        onClick={() => generateStepContent("grammar")}
                        className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-lg mt-10"
                      >
                        Volgende: Grammatica Deep-Dive
                      </button>
                    </div>
                  )}

                  {currentStep === "grammar" && (
                    <div className="space-y-6">
                       <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-black uppercase">Stap 2: Grammatica</span>
                        <span className="text-xs font-bold text-slate-400">40m resterend</span>
                      </div>
                      <h4 className="text-3xl font-black text-slate-900">De Regels Beheersen</h4>
                      <div className="space-y-4 mt-8">
                        {selectedLesson.grammarFocus.map(rule => (
                          <div key={rule} className="p-8 bg-slate-900 text-white rounded-[2rem] shadow-xl">
                            <h5 className="text-orange-500 font-black text-lg mb-2">{rule}</h5>
                            <p className="text-slate-400 font-medium">Laten we kijken hoe we dit gebruiken in Hoofdstuk {selectedLesson.day}.</p>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => generateStepContent("speaking")}
                        className="w-full py-5 bg-purple-600 text-white rounded-3xl font-black text-lg mt-10"
                      >
                        Volgende: Spreken met Lars
                      </button>
                    </div>
                  )}

                  {currentStep === "speaking" && (
                    <div className="space-y-8 text-center py-10">
                      <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="h-10 w-10 text-orange-600" />
                      </div>
                      <h4 className="text-3xl font-black text-slate-900">Tijd om te praten!</h4>
                      <p className="text-slate-500 text-lg max-w-md mx-auto font-medium">
                        Ga naar de Chat en praat 25 minuten over <span className="text-slate-900 font-black">"{selectedLesson.topic}"</span>.
                      </p>
                      <div className="p-8 bg-orange-50 rounded-[2rem] border-2 border-orange-100 text-left">
                        <h5 className="text-xs font-black uppercase text-orange-600 mb-2 tracking-widest">Spreken Focus</h5>
                        <p className="text-slate-900 font-bold">Gebruik vandaag: {selectedLesson.grammarFocus.join(", ")}</p>
                      </div>
                      <button 
                        onClick={() => generateStepContent("quiz")}
                        className="w-full py-5 bg-orange-500 text-white rounded-3xl font-black text-lg shadow-xl shadow-orange-200 mt-10"
                      >
                        Ik heb geoefend, start de Eindquiz
                      </button>
                    </div>
                  )}

                  {currentStep === "quiz" && (
                    <div>
                      {isGenerating ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                          <Loader2 className="h-12 w-12 text-orange-500 animate-spin" />
                          <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Examen wordt voorbereid...</p>
                        </div>
                      ) : (
                        <Quiz questions={quizQuestions} onComplete={handleQuizComplete} />
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              /* Selection Screen */
              <div className="h-full min-h-[700px] bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center">
                <div className="p-10 bg-white rounded-full shadow-2xl mb-8 relative">
                   <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-10"></div>
                  <Play className="h-20 w-20 text-orange-500 fill-current relative z-10" />
                </div>
                <h3 className="text-3xl font-black text-slate-900">Klaar voor vandaag?</h3>
                <p className="text-slate-500 mt-4 max-w-sm text-lg font-medium">
                  Selecteer je volgende dag in de roadmap om je 1-uur sessie te beginnen.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
