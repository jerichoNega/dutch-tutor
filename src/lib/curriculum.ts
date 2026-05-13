export interface Lesson {
  id: string;
  level: "A2+" | "B1" | "B1+";
  title: string;
  topic: string;
  description: string;
  grammarFocus: string[];
  vocabularyCategory: string;
  status: "locked" | "available" | "completed";
}

export const COUTINHO_CURRICULUM: Lesson[] = [
  {
    id: "b1-1",
    level: "A2+",
    title: "Hoofdstuk 1: Werk en Opleiding",
    topic: "Work & Education",
    description: "Discussing your career path and educational background in detail.",
    grammarFocus: ["Inversie", "Present Perfect (Voltooid Tegenwoordige Tijd)"],
    vocabularyCategory: "Beroepen & Studies",
    status: "available"
  },
  {
    id: "b1-2",
    level: "B1",
    title: "Hoofdstuk 2: Maatschappelijke Thema's",
    topic: "Society & Current Affairs",
    description: "Expressing opinions on news and social issues.",
    grammarFocus: ["Ondanks / Hoewel", "Subclauses with 'dat' and 'omdat'"],
    vocabularyCategory: "Nieuws & Samenleving",
    status: "locked"
  },
  {
    id: "b1-3",
    level: "B1",
    title: "Hoofdstuk 3: De Nederlandse Cultuur",
    topic: "Culture & Traditions",
    description: "Understanding Dutch history and social etiquette.",
    grammarFocus: ["Usage of 'Er'", "Reflexive verbs"],
    vocabularyCategory: "Tradities & Omgeving",
    status: "locked"
  },
  {
    id: "b1-4",
    level: "B1+",
    title: "Hoofdstuk 4: Toekomst en Technologie",
    topic: "Future & Tech",
    description: "Hypothesizing about the future and new developments.",
    grammarFocus: ["Conditional (Zou / Zouden)", "Passive Voice"],
    vocabularyCategory: "Technologie & Innovatie",
    status: "locked"
  }
];
