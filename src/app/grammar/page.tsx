"use client";

import { useState } from "react";
import { Lesson } from "@/lib/curriculum";
import { 
  Lock, 
  Play, 
  GraduationCap, 
  Loader2,
  Undo2,
  Clock,
  Briefcase,
  Users,
  Palmtree,
  Star,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Quiz } from "@/components/Quiz";
import { useProgress } from "@/lib/ProgressContext";

type MasterclassStep = "overview" | "vocab" | "grammar" | "speaking" | "quiz";

const BRANCH_ICONS = {
  core: Zap,
  professional: Briefcase,
  social: Users,
  culture: Palmtree,
  mastery: Star
};

const BRANCH_COLORS = {
  core: "bg-orange-500",
  professional: "bg-blue-500",
  social: "bg-green-500",
  culture: "bg-purple-500",
  mastery: "bg-amber-500"
};

export default function MasterclassPage() {
  const { curriculum, completeLesson, stats } = useProgress();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [currentStep, setCurrentStep] = useState<MasterclassStep>("overview");
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const startLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentStep("overview");
    setGenerationError(null);
  };

  const generateStepContent = async (step: MasterclassStep) => {
    if (!selectedLesson) return;
    setIsGenerating(true);
    setGenerationError(null);
    setCurrentStep(step);
    
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
        
        if (!response.ok) {
          throw new Error("Failed to generate quiz");
        }

        const data = await response.json();
        if (!data.questions || data.questions.length === 0) {
          throw new Error("No questions returned from AI");
        }
        setQuizQuestions(data.questions);
      } catch (e: any) {
        console.error(e);
        setGenerationError(e.message || "Er is iets misgegaan bij het genereren van de quiz.");
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
    <div className="max-w-7xl mx-auto pb-20 px-4">
      <div className="mb-12 flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">RealTree Learning</h2>
          <p className="mt-2 text-slate-500 text-lg font-medium">Kies je eigen weg naar B1 meesterschap.</p>
        </div>
        <div className="hidden md:flex items-center gap-4 bg-white p-4 rounded-3xl border-2 border-slate-100 shadow-sm">
          <Clock className="text-orange-500" />
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400">Totale Voortgang</div>
            <div className="text-sm font-bold text-slate-900">{stats.completionPercentage}% Voltooid</div>
          </div>
        </div>
      </div>

      <div className="relative min-h-[800px] bg-slate-50 rounded-[3rem] p-12 border-4 border-slate-100 overflow-hidden">
        {/* The Grid/Tree Layout */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {["professional", "social", "culture"].map((branchName) => (
            <div key={branchName} className="space-y-8">
              <div className="flex items-center gap-3 mb-8">
                <div className={cn("p-3 rounded-2xl text-white", BRANCH_COLORS[branchName as keyof typeof BRANCH_COLORS])}>
                  {(() => {
                    const Icon = BRANCH_ICONS[branchName as keyof typeof BRANCH_ICONS];
                    return <Icon className="h-6 w-6" />;
                  })()}
                </div>
                <h3 className="text-2xl font-black text-slate-900 capitalize">{branchName} Path</h3>
              </div>

              {/* Core Foundation (Shared) */}
              {branchName === "social" && (
                <div className="flex flex-col items-center space-y-8 mb-16">
                  {curriculum.filter(l => l.branch === "core").map((lesson) => (
                    <LessonNode key={lesson.id} lesson={lesson} onClick={() => startLesson(lesson)} />
                  ))}
                  <div className="h-12 w-1 bg-slate-200 rounded-full" />
                </div>
              )}

              {/* Branch Specific Lessons */}
              <div className="flex flex-col items-center space-y-8">
                {curriculum.filter(l => l.branch === branchName).map((lesson) => (
                  <LessonNode key={lesson.id} lesson={lesson} onClick={() => startLesson(lesson)} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Final Mastery Section */}
        <div className="mt-24 flex flex-col items-center">
          <div className="h-16 w-1 bg-gradient-to-b from-slate-200 to-amber-500 rounded-full mb-8" />
          <div className="flex items-center gap-8">
            {curriculum.filter(l => l.branch === "mastery").map((lesson) => (
              <LessonNode key={lesson.id} lesson={lesson} onClick={() => startLesson(lesson)} />
            ))}
          </div>
        </div>

        {/* Decorative background lines could go here using absolute positioning */}
      </div>

      {/* Lesson Overlay */}
      <AnimatePresence>
        {selectedLesson && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-10 relative"
            >
              <button 
                onClick={() => setSelectedLesson(null)}
                className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-full transition-colors"
              >
                <Undo2 className="h-6 w-6 text-slate-400" />
              </button>

              <div className="flex-1">
                {currentStep === "overview" && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-6 mb-10">
                      <div className={cn("p-5 rounded-3xl text-white shadow-xl", BRANCH_COLORS[selectedLesson.branch])}>
                        {(() => {
                          const Icon = BRANCH_ICONS[selectedLesson.branch];
                          return <Icon className="h-10 w-10" />;
                        })()}
                      </div>
                      <div>
                        <h3 className="text-4xl font-black text-slate-900">{selectedLesson.title}</h3>
                        <p className="text-xl font-bold text-slate-400">{selectedLesson.topic}</p>
                      </div>
                    </div>

                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100">
                      <p className="text-slate-700 leading-relaxed font-medium text-xl">
                        {selectedLesson.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-white border-2 border-slate-100 rounded-3xl">
                        <h5 className="font-black text-slate-400 text-xs uppercase tracking-widest mb-2">Grammatica Focus</h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedLesson.grammarFocus.map(f => (
                            <span key={f} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-black">{f}</span>
                          ))}
                        </div>
                      </div>
                      <div className="p-6 bg-white border-2 border-slate-100 rounded-3xl">
                        <h5 className="font-black text-slate-400 text-xs uppercase tracking-widest mb-2">Woordenschat</h5>
                        <p className="font-bold text-slate-700">{selectedLesson.vocabularyCategory}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => generateStepContent("vocab")}
                      className={cn(
                        "w-full py-6 text-white rounded-[2rem] font-black text-2xl transition-all shadow-xl mt-8 active:scale-95",
                        BRANCH_COLORS[selectedLesson.branch]
                      )}
                    >
                      Start Lesson
                    </button>
                  </div>
                )}

                  {currentStep === "vocab" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase">Stap 1: Woordenschat</span>
                        <span className="text-xs font-bold text-slate-400">15m</span>
                      </div>
                      <h4 className="text-3xl font-black text-slate-900">Belangrijke woorden voor vandaag</h4>
                      <p className="text-slate-500 font-medium leading-relaxed">Focus op: {selectedLesson.vocabularyCategory}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        <div className="p-8 bg-slate-50 rounded-3xl border-2 border-slate-100">
                          <h5 className="font-black text-slate-900 mb-2">Kernwoorden</h5>
                          <p className="text-slate-600">Je leert vandaag 10 woorden gerelateerd aan {selectedLesson.topic}.</p>
                        </div>
                        <div className="p-8 bg-slate-50 rounded-3xl border-2 border-slate-100">
                          <h5 className="font-black text-slate-900 mb-2">Context</h5>
                          <p className="text-slate-600">Focus op het gebruik van deze woorden in een {selectedLesson.branch} context.</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => generateStepContent("grammar")}
                        className={cn("w-full py-5 text-white rounded-3xl font-black text-lg mt-10", BRANCH_COLORS[selectedLesson.branch])}
                      >
                        Volgende: Grammatica Deep-Dive
                      </button>
                    </div>
                  )}

                  {currentStep === "grammar" && (
                    <div className="space-y-6">
                       <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-black uppercase">Stap 2: Grammatica</span>
                        <span className="text-xs font-bold text-slate-400">20m</span>
                      </div>
                      <h4 className="text-3xl font-black text-slate-900">De Regels Beheersen</h4>
                      <div className="space-y-4 mt-8">
                        {selectedLesson.grammarFocus.map(rule => (
                          <div key={rule} className="p-8 bg-slate-900 text-white rounded-[2rem] shadow-xl">
                            <h5 className="text-orange-500 font-black text-lg mb-2">{rule}</h5>
                            <p className="text-slate-400 font-medium italic">"{rule}" is essentieel voor je voortgang in {selectedLesson.topic}.</p>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => generateStepContent("speaking")}
                        className={cn("w-full py-5 text-white rounded-3xl font-black text-lg mt-10", BRANCH_COLORS[selectedLesson.branch])}
                      >
                        Volgende: Spreken met Lars
                      </button>
                    </div>
                  )}

                  {currentStep === "speaking" && (
                    <div className="space-y-8 text-center py-10">
                      <div className={cn("w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 opacity-20", BRANCH_COLORS[selectedLesson.branch])}>
                        <Zap className="h-10 w-10 text-white" />
                      </div>
                      <h4 className="text-3xl font-black text-slate-900">Tijd om te praten!</h4>
                      <p className="text-slate-500 text-lg max-w-md mx-auto font-medium">
                        Ga naar de Chat en praat 25 minuten over <span className="text-slate-900 font-black">"{selectedLesson.topic}"</span>.
                      </p>
                      <div className="p-8 bg-slate-50 rounded-[2rem] border-2 border-slate-100 text-left">
                        <h5 className="text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Spreken Focus</h5>
                        <p className="text-slate-900 font-bold">Gebruik vandaag: {selectedLesson.grammarFocus.join(", ")}</p>
                      </div>
                      <button 
                        onClick={() => generateStepContent("quiz")}
                        className={cn("w-full py-5 text-white rounded-3xl font-black text-lg mt-10 shadow-xl", BRANCH_COLORS[selectedLesson.branch])}
                      >
                        Ik heb geoefend, start de Eindquiz
                      </button>
                    </div>
                  )}

                  {currentStep === "quiz" && (
                    <div className="w-full">
                      {isGenerating ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                          <Loader2 className="h-12 w-12 text-orange-500 animate-spin" />
                          <p className="font-black text-slate-400 uppercase tracking-widest text-xs text-center">AI bereidt je examen voor...</p>
                        </div>
                      ) : generationError ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                          <div className="p-4 bg-red-100 text-red-600 rounded-full">
                            <Undo2 className="h-8 w-8" />
                          </div>
                          <div>
                            <h4 className="text-2xl font-black text-slate-900">Oeps! Er ging iets mis</h4>
                            <p className="text-slate-500 mt-2">{generationError}</p>
                          </div>
                          <button 
                            onClick={() => generateStepContent("quiz")}
                            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:scale-105 transition-all"
                          >
                            Probeer het opnieuw
                          </button>
                        </div>
                      ) : (
                        <Quiz questions={quizQuestions} onComplete={handleQuizComplete} />
                      )}
                    </div>
                  )}              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LessonNode({ lesson, onClick }: { lesson: Lesson, onClick: () => void }) {
  const isLocked = lesson.status === "locked";
  const isCompleted = lesson.status === "completed";
  const Icon = BRANCH_ICONS[lesson.branch];

  return (
    <motion.button
      whileHover={!isLocked ? { scale: 1.05, y: -5 } : {}}
      whileTap={!isLocked ? { scale: 0.95 } : {}}
      onClick={() => !isLocked && onClick()}
      className={cn(
        "relative w-48 p-6 rounded-[2rem] border-4 transition-all flex flex-col items-center text-center",
        isLocked 
          ? "bg-slate-100 border-slate-200 opacity-60 grayscale cursor-not-allowed" 
          : isCompleted
            ? "bg-white border-green-500 shadow-xl shadow-green-100"
            : "bg-white border-slate-900 shadow-2xl shadow-slate-200"
      )}
    >
      <div className={cn(
        "p-4 rounded-2xl mb-4 text-white",
        isLocked ? "bg-slate-300" : isCompleted ? "bg-green-500" : BRANCH_COLORS[lesson.branch]
      )}>
        {isLocked ? <Lock className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
      </div>
      <h4 className="font-black text-slate-900 text-sm leading-tight mb-1">{lesson.title}</h4>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{lesson.topic}</p>
      
      {isCompleted && (
        <div className="absolute -top-3 -right-3 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
          <Play className="h-3 w-3 fill-current" />
        </div>
      )}
    </motion.button>
  );
}
