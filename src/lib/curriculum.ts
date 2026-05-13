export interface Lesson {
  id: string;
  day: number;
  level: "A2+" | "B1" | "B1+";
  title: string;
  topic: string;
  description: string;
  grammarFocus: string[];
  vocabularyCategory: string;
  status: "locked" | "available" | "completed";
  prerequisites?: string[]; // IDs of lessons that must be completed first
  branch: "core" | "professional" | "social" | "culture" | "mastery";
  position: { x: number; y: number }; // For visual layout on the tree
}

export const COUTINHO_CURRICULUM: Lesson[] = [
  // CORE FOUNDATION (Unlocks the branches)
  {
    id: "core-1", day: 1, level: "A2+", title: "Intro & Basics", topic: "The Foundation",
    description: "Essential Dutch patterns for B1 success.",
    grammarFocus: ["Inversie", "Present Tense"], vocabularyCategory: "Algemeen", status: "available",
    branch: "core", position: { x: 50, y: 0 }
  },
  {
    id: "core-2", day: 2, level: "A2+", title: "The Past Tense", topic: "VTT Mastery",
    description: "Mastering the Voltooid Tegenwoordige Tijd.",
    grammarFocus: ["VTT", "Perfectum"], vocabularyCategory: "Acties", status: "locked",
    prerequisites: ["core-1"], branch: "core", position: { x: 50, y: 100 }
  },

  // PROFESSIONAL BRANCH (For career-focused users)
  {
    id: "prof-1", day: 3, level: "B1", title: "Job Interviews", topic: "Solliciteren",
    description: "Preparing for professional Dutch interviews.",
    grammarFocus: ["Modale werkwoorden"], vocabularyCategory: "Vaardigheden", status: "locked",
    prerequisites: ["core-2"], branch: "professional", position: { x: 20, y: 200 }
  },
  {
    id: "prof-2", day: 4, level: "B1", title: "Office Culture", topic: "Collaboration",
    description: "Dutch workplace etiquette and communication.",
    grammarFocus: ["Scheidbare werkwoorden"], vocabularyCategory: "Kantoor", status: "locked",
    prerequisites: ["prof-1"], branch: "professional", position: { x: 10, y: 300 }
  },
  {
    id: "prof-3", day: 5, level: "B1+", title: "Business Dutch", topic: "Economy",
    description: "Advanced professional terminology and negotiation.",
    grammarFocus: ["Onderhandelingstaal"], vocabularyCategory: "Economie", status: "locked",
    prerequisites: ["prof-2"], branch: "professional", position: { x: 10, y: 400 }
  },

  // SOCIAL BRANCH (For daily life & relocation)
  {
    id: "soc-1", day: 3, level: "B1", title: "Housing", topic: "Wonen",
    description: "Finding a house and talking to neighbors.",
    grammarFocus: ["Usage of 'Er'"], vocabularyCategory: "Wonen", status: "locked",
    prerequisites: ["core-2"], branch: "social", position: { x: 50, y: 200 }
  },
  {
    id: "soc-2", day: 4, level: "B1", title: "Healthcare", topic: "Gezondheid",
    description: "Visiting doctors and understanding pharmacies.",
    grammarFocus: ["Reflexive Verbs"], vocabularyCategory: "Gezondheid", status: "locked",
    prerequisites: ["soc-1"], branch: "social", position: { x: 50, y: 300 }
  },
  {
    id: "soc-3", day: 5, level: "B1+", title: "Daily Life", topic: "Shopping & Travel",
    description: "Mastering the Dutch supermarket and public transport.",
    grammarFocus: ["Conjunctions"], vocabularyCategory: "Vervoer", status: "locked",
    prerequisites: ["soc-2"], branch: "social", position: { x: 50, y: 400 }
  },

  // CULTURE BRANCH (For integration & society)
  {
    id: "cul-1", day: 3, level: "B1", title: "History", topic: "History",
    description: "Key moments in Dutch history.",
    grammarFocus: ["OVT (Past)"], vocabularyCategory: "Geschiedenis", status: "locked",
    prerequisites: ["core-2"], branch: "culture", position: { x: 80, y: 200 }
  },
  {
    id: "cul-2", day: 4, level: "B1", title: "Directness", topic: "Social Norms",
    description: "Understanding the famous Dutch directness.",
    grammarFocus: ["Nuance-woorden"], vocabularyCategory: "Communicatie", status: "locked",
    prerequisites: ["cul-1"], branch: "culture", position: { x: 90, y: 300 }
  },
  {
    id: "cul-3", day: 5, level: "B1+", title: "Arts & Lit", topic: "Culture",
    description: "Dutch masters and modern literature.",
    grammarFocus: ["Adjectieven"], vocabularyCategory: "Cultuur", status: "locked",
    prerequisites: ["cul-2"], branch: "culture", position: { x: 90, y: 400 }
  },

  // MASTERY CONVERGENCE
  {
    id: "mast-1", day: 6, level: "B1+", title: "Final Exam Prep", topic: "Exam Readiness",
    description: "Bringing it all together for the B1 exam.",
    grammarFocus: ["Comprehensive Review"], vocabularyCategory: "Examen", status: "locked",
    prerequisites: ["prof-3", "soc-3", "cul-3"], branch: "mastery", position: { x: 50, y: 550 }
  },
  {
    id: "mast-2", day: 7, level: "B1+", title: "B1 Certification", topic: "Final Mastery",
    description: "The big test to prove your mastery.",
    grammarFocus: ["Final Mastery"], vocabularyCategory: "Mastery", status: "locked",
    prerequisites: ["mast-1"], branch: "mastery", position: { x: 50, y: 650 }
  }
];
