"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, Loader2, Award } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizProps {
  questions: Question[];
  onComplete: (score: number) => void;
}

export function Quiz({ questions, onComplete }: QuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);
    if (idx === questions[currentIdx].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
      >
        <Award className="h-20 w-20 text-orange-500 mx-auto mb-4" />
        <h3 className="text-3xl font-bold mb-2">Quiz Voltooid!</h3>
        <p className="text-slate-500 mb-6">Je score is {score} van de {questions.length}</p>
        <button 
          onClick={() => onComplete(score)}
          className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          Terug naar Curriculum
        </button>
      </motion.div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Vraag {currentIdx + 1} van {questions.length}
        </div>
        <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-500 transition-all duration-500" 
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-slate-900">{q.question}</h3>

      <div className="grid grid-cols-1 gap-4">
        {q.options.map((option, idx) => {
          let style = "border-slate-200 bg-white hover:border-orange-500";
          if (isAnswered) {
            if (idx === q.correctAnswer) style = "border-green-500 bg-green-50 text-green-700";
            else if (idx === selectedIdx) style = "border-red-500 bg-red-50 text-red-700";
            else style = "border-slate-100 opacity-50";
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handleAnswer(idx)}
              className={`w-full p-5 rounded-2xl border-2 text-left transition-all font-medium flex items-center justify-between ${style}`}
            >
              {option}
              {isAnswered && idx === q.correctAnswer && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              {isAnswered && idx === selectedIdx && idx !== q.correctAnswer && <XCircle className="h-5 w-5 text-red-600" />}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {isAnswered && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-slate-50 rounded-2xl border border-slate-100"
          >
            <p className="text-sm text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-900">Uitleg:</span> {q.explanation}
            </p>
            <button 
              onClick={nextQuestion}
              className="mt-6 flex items-center gap-2 text-orange-600 font-bold hover:gap-3 transition-all"
            >
              Volgende vraag <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
