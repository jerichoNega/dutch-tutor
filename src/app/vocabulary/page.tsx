"use client";

import { useState } from "react";
import { B1_VOCABULARY } from "@/lib/vocabulary";
import { Book, Search, ChevronRight, Loader2, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useProgress } from "@/lib/ProgressContext";

export default function VocabularyPage() {
  const { addMasteredWord } = useProgress();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWord, setSelectedWord] = useState<any>(null);
  const [examples, setExamples] = useState<any[]>([]);
  const [isLoadingExamples, setIsLoadingExamples] = useState(false);

  const filteredVocab = B1_VOCABULARY.filter(item => 
    item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.translation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchExamples = async (word: string) => {
    setIsLoadingExamples(true);
    setExamples([]);
    try {
      const response = await fetch("/api/vocabulary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });
      const data = await response.json();
      if (data.examples) {
        setExamples(data.examples);
      }
    } catch (error) {
      console.error("Error fetching examples:", error);
    } finally {
      setIsLoadingExamples(false);
    }
  };

  const handleWordClick = (item: any) => {
    setSelectedWord(item);
    fetchExamples(item.word);
    addMasteredWord(item.word);
  };

  const speak = (text: string) => {
    if (typeof window !== "undefined") {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "nl-NL";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Vocabulary Engine</h2>
          <p className="mt-2 text-slate-500">Master the 1,000 most important words for B1 Dutch.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search words..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none w-full md:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-3 h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {filteredVocab.map((item) => (
            <button
              key={item.word}
              onClick={() => handleWordClick(item)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                selectedWord?.word === item.word
                  ? "bg-slate-900 border-slate-900 text-white shadow-lg translate-x-1"
                  : "bg-white border-slate-200 text-slate-900 hover:border-orange-500 hover:shadow-sm"
              )}
            >
              <div>
                <div className="font-bold text-lg">{item.word}</div>
                <div className={cn(
                  "text-sm",
                  selectedWord?.word === item.word ? "text-slate-400" : "text-slate-500"
                )}>{item.translation}</div>
              </div>
              <ChevronRight className={cn(
                "h-5 w-5",
                selectedWord?.word === item.word ? "text-orange-500" : "text-slate-300"
              )} />
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedWord ? (
              <motion.div
                key={selectedWord.word}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 h-fit min-h-[400px]"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-50 rounded-2xl">
                      <Book className="h-8 w-8 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900">{selectedWord.word}</h3>
                      <p className="text-slate-500 uppercase text-xs font-bold tracking-widest mt-1">
                        {selectedWord.category} • {selectedWord.level}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => speak(selectedWord.word)}
                    className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                  >
                    <Volume2 className="h-6 w-6 text-slate-600" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h4 className="text-sm font-bold text-slate-400 uppercase mb-2">Translation</h4>
                    <p className="text-xl font-medium text-slate-800">{selectedWord.translation}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase mb-4">Contextual Examples</h4>
                    {isLoadingExamples ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {examples.map((ex, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group"
                          >
                            <div className="flex items-start justify-between">
                              <p className="text-lg font-medium text-slate-900 leading-relaxed">
                                {ex.dutch}
                              </p>
                              <button 
                                onClick={() => speak(ex.dutch)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-orange-500"
                              >
                                <Volume2 className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="text-slate-500 mt-2 italic">{ex.english}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 h-full flex flex-col items-center justify-center p-12 text-center">
                <Book className="h-16 w-16 text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-400">Select a word to start learning</h3>
                <p className="text-slate-400 mt-2 max-w-xs">
                  We will show you translations and AI-generated sentences to help you master it.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
