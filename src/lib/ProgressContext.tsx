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
        
        // Migration Mapping: Map old linear IDs to new branching IDs
        const idMigration: Record<string, string> = {
          "d1": "core-1",
          "d2": "core-2",
          "d3": "soc-1", // Approximate mapping
          "d4": "soc-2",
          "d5": "soc-3",
          // ... more can be added if needed
        };

        const migratedCompleted = (parsed.completedLessons || []).map((id: string) => idMigration[id] || id);
        
        // Robust hydration with fallbacks for every field
        const hydratedProgress: UserProgress = {
          completedLessons: Array.from(new Set(migratedCompleted)) as string[],
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
        setCurriculum(prev => prev.map((lesson) => {
          const isCompleted = hydratedProgress.completedLessons.includes(lesson.id);
          
          let isAvailable = isCompleted;
          if (!isAvailable) {
            if (!lesson.prerequisites || lesson.prerequisites.length === 0) {
              isAvailable = true;
            } else {
              isAvailable = lesson.prerequisites.every(pId => 
                hydratedProgress.completedLessons.includes(pId)
              );
            }
          }
          
          return {
            ...lesson,
            status: isCompleted ? "completed" : (isAvailable ? "available" : "locked")
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

  // Re-sync curriculum whenever progress changes to ensure UI stays in sync with branches
  useEffect(() => {
    setCurriculum(prev => prev.map(lesson => {
      const isCompleted = progress.completedLessons.includes(lesson.id);
      let isAvailable = isCompleted;
      if (!isAvailable) {
        if (!lesson.prerequisites || lesson.prerequisites.length === 0) {
          isAvailable = true;
        } else {
          isAvailable = lesson.prerequisites.every(pId => progress.completedLessons.includes(pId));
        }
      }
      return {
        ...lesson,
        status: isCompleted ? "completed" : (isAvailable ? "available" : "locked")
      };
    }));
  }, [progress.completedLessons]);

  const completeLesson = (id: string) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(id)) return prev;
      
      const newCompleted = [...prev.completedLessons, id];
      
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
