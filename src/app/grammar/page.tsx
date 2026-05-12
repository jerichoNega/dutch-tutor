"use client";

import { useState } from "react";
import { B1_GRAMMAR } from "@/lib/grammar";
import { GraduationCap, ArrowRight, CheckCircle2, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function GrammarPage() {
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  const speak = (text: string) => {
    if (typeof window !== "undefined") {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "nl-NL";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Grammar Vault</h2>
        <p className="mt-2 text-slate-500">Perfect your Dutch sentence structure and advanced rules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {B1_GRAMMAR.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className={cn(
                "w-full p-6 rounded-2xl border text-left transition-all group",
                selectedLesson?.id === lesson.id
                  ? "bg-slate-900 border-slate-900 text-white shadow-xl"
                  : "bg-white border-slate-200 text-slate-900 hover:border-orange-500 hover:shadow-md"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                  selectedLesson?.id === lesson.id ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-600"
                )}>
                  {lesson.difficulty}
                </div>
                <GraduationCap className={cn(
                  "h-5 w-5",
                  selectedLesson?.id === lesson.id ? "text-orange-500" : "text-slate-300 group-hover:text-orange-500 transition-colors"
                )} />
              </div>
              <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
              <p className={cn(
                "text-sm line-clamp-2",
                selectedLesson?.id === lesson.id ? "text-slate-400" : "text-slate-500"
              )}>
                {lesson.description}
              </p>
              <div className={cn(
                "mt-4 flex items-center text-sm font-semibold transition-colors",
                selectedLesson?.id === lesson.id ? "text-orange-500" : "text-slate-400 group-hover:text-slate-900"
              )}>
                Start Lesson <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </button>
          ))}
        </div>

        <div className="relative">
          {selectedLesson ? (
            <motion.div
              key={selectedLesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden sticky top-8"
            >
              <div className="bg-slate-900 p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">{selectedLesson.title}</h3>
                <p className="text-slate-400">{selectedLesson.description}</p>
              </div>
              
              <div className="p-8 space-y-8">
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-widest">Master Example</h4>
                  <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 group relative">
                    <p className="text-xl font-bold text-slate-900 leading-relaxed pr-10">
                      {selectedLesson.example}
                    </p>
                    <button 
                      onClick={() => speak(selectedLesson.example)}
                      className="absolute right-6 top-6 p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform"
                    >
                      <Volume2 className="h-5 w-5 text-orange-500" />
                    </button>
                    <div className="mt-4 flex items-start gap-3 text-sm text-slate-600 italic">
                      <div className="mt-1 p-0.5 bg-orange-200 rounded-full">
                        <CheckCircle2 className="h-3 w-3 text-orange-700" />
                      </div>
                      {selectedLesson.explanation}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-widest">Key takeaways</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4">
                      <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-500">1</div>
                      <p className="text-slate-700">Practice identifying the {selectedLesson.id === 'subclauses' ? 'conjunction' : 'subject'} first.</p>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-500">2</div>
                      <p className="text-slate-700">Listen for these patterns in the Chat Tutor sessions.</p>
                    </li>
                  </ul>
                </div>

                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                  Mark as Completed
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[500px] bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center">
              <GraduationCap className="h-16 w-16 text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-400">Select a grammar topic</h3>
              <p className="text-slate-400 mt-2 max-w-xs">
                Dive deep into the rules that will make your Dutch sound perfect at a B1 level.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
