"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Lesson, COUTINHO_CURRICULUM } from "@/lib/curriculum";

interface UserSettings {
  userName: string;
  difficulty: "A2+" | "B1" | "B1+";
  aiPersonality: "friendly" | "strict" | "professional";
}

interface UserProgress {
  completedLessons: string[];
  masteredWords: string[];
  streak: number;
  lastActive: string | null;
  settings: UserSettings;
}

interface ProgressContextType {
  progress: UserProgress;
  curriculum: Lesson[];
  completeLesson: (id: string) => void;
  addMasteredWord: (word: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetProgress: () => void;
  stats: {
    completionPercentage: number;
    wordsCount: number;
    activeStreak: number;
  };
}

const DEFAULT_SETTINGS: UserSettings = {
  userName: "Student",
  difficulty: "B1",
  aiPersonality: "friendly",
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>({
    completedLessons: [],
    masteredWords: [],
    streak: 0,
    lastActive: null,
    settings: DEFAULT_SETTINGS,
  });

  const [curriculum, setCurriculum] = useState<Lesson[]>(COUTINHO_CURRICULUM);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("dutch_master_progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Robust hydration with fallbacks for every field
        const hydratedProgress: UserProgress = {
          completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
          masteredWords: Array.isArray(parsed.masteredWords) ? parsed.masteredWords : [],
          streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
          lastActive: parsed.lastActive || null,
          settings: {
            ...DEFAULT_SETTINGS,
            ...(parsed.settings || {})
          }
        };

        setProgress(hydratedProgress);
        
        // Update curriculum status based on saved progress
        setCurriculum(prev => prev.map((lesson, idx) => {
          const isCompleted = hydratedProgress.completedLessons.includes(lesson.id);
          // A lesson is available if it's completed OR if the previous one is completed
          const isPreviousCompleted = idx === 0 || hydratedProgress.completedLessons.includes(prev[idx-1].id);
          
          return {
            ...lesson,
            status: isCompleted ? "completed" : (isPreviousCompleted ? "available" : "locked")
          };
        }));
      } catch (e) {
        console.error("Failed to parse progress, using defaults", e);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("dutch_master_progress", JSON.stringify(progress));
  }, [progress]);

  const completeLesson = (id: string) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(id)) return prev;
      
      const newCompleted = [...prev.completedLessons, id];
      
      // Update streak logic
      const today = new Date().toISOString().split('T')[0];
      let newStreak = prev.streak;
      if (prev.lastActive !== today) {
        newStreak += 1;
      }

      return {
        ...prev,
        completedLessons: newCompleted,
        lastActive: today,
        streak: newStreak
      };
    });

    // Update curriculum availability immediately
    setCurriculum(prev => {
      const next = prev.map(l => l.id === id ? { ...l, status: "completed" as const } : l);
      const completedIdx = next.findIndex(l => l.id === id);
      if (completedIdx !== -1 && completedIdx + 1 < next.length) {
        if (next[completedIdx + 1].status === "locked") {
          next[completedIdx + 1].status = "available";
        }
      }
      return next;
    });
  };

  const addMasteredWord = (word: string) => {
    setProgress(prev => {
      if (prev.masteredWords.includes(word)) return prev;
      return { ...prev, masteredWords: [...prev.masteredWords, word] };
    });
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setProgress(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  const resetProgress = () => {
    const freshProgress: UserProgress = {
      completedLessons: [],
      masteredWords: [],
      streak: 0,
      lastActive: null,
      settings: DEFAULT_SETTINGS,
    };
    setProgress(freshProgress);
    setCurriculum(COUTINHO_CURRICULUM.map((l, i) => ({
      ...l,
      status: i === 0 ? "available" : "locked"
    })));
    localStorage.removeItem("dutch_master_progress");
  };

  const stats = {
    completionPercentage: Math.round((progress.completedLessons.length / COUTINHO_CURRICULUM.length) * 100),
    wordsCount: progress.masteredWords.length,
    activeStreak: progress.streak
  };

  return (
    <ProgressContext.Provider value={{ progress, curriculum, completeLesson, addMasteredWord, updateSettings, resetProgress, stats }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
