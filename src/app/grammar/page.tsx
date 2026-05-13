"use client";

import { useState } from "react";
import { Lesson } from "@/lib/curriculum";
import { 
  BookOpen, 
  Lock, 
  CheckCircle, 
  Play, 
  GraduationCap, 
  ChevronRight,
  Loader2,
  Undo2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Quiz } from "@/components/Quiz";
import { useProgress } from "@/lib/ProgressContext";

export default function GrammarPage() {
  const { curriculum, completeLesson, stats } = useProgress();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const startLesson = async (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsGeneratingQuiz(true);
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          lessonId: lesson.id,
          topic: lesson.topic,
          grammarFocus: lesson.grammarFocus
        }),
      });
      const data = await response.json();
      if (data.questions) {
        setQuizQuestions(data.questions);
      }
    } catch (error) {
      console.error("Quiz Error:", error);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleQuizComplete = (score: number) => {
    if (score >= 3 && selectedLesson) {
      completeLesson(selectedLesson.id);
    }
    setShowQuiz(false);
    setQuizQuestions([]);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-12">
        <h2 className="text-4xl font-black tracking-tight text-slate-900">Grammar Vault</h2>
        <p className="mt-2 text-slate-500 text-lg italic">The Coutinho Method: Structured B1 Progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Course Map */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden">
            <h3 className="text-xl font-bold mb-2">Jouw Voortgang</h3>
            <div className="text-4xl font-black text-orange-500">{stats.completionPercentage}%</div>
            <p className="text-slate-400 text-sm mt-1">Gerealiseerd op basis van voltooide quizen</p>
            <div className="mt-6 h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: `${stats.completionPercentage}%` }} />
            </div>
            <GraduationCap className="absolute -right-4 -bottom-4 h-32 w-32 text-slate-800 rotate-12" />
          </div>

          <div className="space-y-4">
            {curriculum.map((lesson, idx) => (
              <motion.button
                key={lesson.id}
                whileHover={lesson.status !== "locked" ? { x: 5 } : {}}
                onClick={() => lesson.status !== "locked" && startLesson(lesson)}
                disabled={lesson.status === "locked"}
                className={cn(
                  "w-full flex items-center gap-6 p-6 rounded-3xl border-2 transition-all text-left group relative",
                  selectedLesson?.id === lesson.id 
                    ? "border-orange-500 bg-orange-50 ring-4 ring-orange-100" 
                    : "border-slate-100 bg-white hover:border-slate-200",
                  lesson.status === "locked" && "opacity-60 grayscale cursor-not-allowed"
                )}
              >
                <div className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl font-black shadow-sm",
                  lesson.status === "completed" ? "bg-green-500 text-white" : 
                  lesson.status === "available" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
                )}>
                  {lesson.status === "completed" ? <CheckCircle className="h-7 w-7" /> : idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                      {lesson.level}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900">{lesson.title}</h4>
                  <p className="text-xs text-slate-400 font-medium">{lesson.topic}</p>
                </div>
                {lesson.status === "locked" ? <Lock className="h-5 w-5 text-slate-300" /> : <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-orange-500 transition-colors" />}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Lesson View */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedLesson ? (
              <motion.div
                key={selectedLesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl p-10 min-h-[600px] flex flex-col"
              >
                {!showQuiz ? (
                  <>
                    <div className="flex items-center justify-between mb-8">
                      <div className="p-4 bg-orange-50 rounded-2xl">
                        <BookOpen className="h-10 w-10 text-orange-500" />
                      </div>
                      <span className="text-sm font-bold text-slate-400">LES-MODULE: {selectedLesson.id.toUpperCase()}</span>
                    </div>

                    <h3 className="text-3xl font-black text-slate-900 mb-4">{selectedLesson.title}</h3>
                    <p className="text-slate-800 text-lg leading-relaxed mb-8 font-medium">
                      {selectedLesson.description}
                    </p>

                    <div className="grid grid-cols-2 gap-6 mb-10">
                      <div className="p-6 bg-slate-100 rounded-3xl border-2 border-slate-200">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Grammatica Focus</h5>
                        <ul className="space-y-2">
                          {selectedLesson.grammarFocus.map(f => (
                            <li key={f} className="flex items-center gap-2 text-sm font-black text-slate-900">
                              <div className="h-1.5 w-1.5 bg-orange-600 rounded-full" /> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-6 bg-slate-100 rounded-3xl border-2 border-slate-200">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Woordenschat</h5>
                        <p className="text-sm font-black text-slate-900">{selectedLesson.vocabularyCategory}</p>
                      </div>
                    </div>

                    <div className="mt-auto pt-10 border-t border-slate-100">
                      <button
                        onClick={() => setShowQuiz(true)}
                        disabled={isGeneratingQuiz || quizQuestions.length === 0}
                        className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-xl flex items-center justify-center gap-3 hover:bg-orange-500 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 group"
                      >
                        {isGeneratingQuiz ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          <>
                            Start Hoofdstuk Quiz <Play className="h-6 w-6 fill-current" />
                          </>
                        )}
                      </button>
                      <p className="text-center text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest">
                        Score minimaal 3/5 om het volgende hoofdstuk te ontgrendelen
                      </p>
                    </div>
                  </>
                ) : (
                  <div>
                    <button 
                      onClick={() => setShowQuiz(false)}
                      className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-8 hover:text-slate-900 transition-colors"
                    >
                      <Undo2 className="h-4 w-4" /> Stop Quiz
                    </button>
                    <Quiz questions={quizQuestions} onComplete={handleQuizComplete} />
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="h-full min-h-[600px] bg-slate-50 rounded-[2.5rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center">
                <div className="p-8 bg-white rounded-full shadow-inner mb-6">
                  <GraduationCap className="h-20 w-20 text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-300">Selecteer een hoofdstuk</h3>
                <p className="text-slate-400 mt-2 max-w-xs font-medium">
                  Begin je gestructureerde reis naar B1+ met de Coutinho-methode.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
