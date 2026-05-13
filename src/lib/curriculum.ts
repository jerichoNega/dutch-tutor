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
}

export const COUTINHO_CURRICULUM: Lesson[] = [
  // WEEK 1: Professional & Personal
  {
    id: "d1", day: 1, level: "A2+", title: "Dag 1: Introductie & Werk", topic: "Work & Self-Introduction",
    description: "Learn to introduce yourself professionally and describe your daily tasks.",
    grammarFocus: ["Inversie", "Present Tense Review"], vocabularyCategory: "Beroepen", status: "available"
  },
  {
    id: "d2", day: 2, level: "A2+", title: "Dag 2: Solliciteren", topic: "Job Interviews",
    description: "Preparing for a Dutch job interview. Vocabulary for skills and experience.",
    grammarFocus: ["Voltooid Tegenwoordige Tijd (VTT)", "Perfectum"], vocabularyCategory: "Vaardigheden", status: "locked"
  },
  {
    id: "d3", day: 3, level: "A2+", title: "Dag 3: De Werkplek", topic: "Office & Collaboration",
    description: "Communication with colleagues and understanding Dutch office culture.",
    grammarFocus: ["Scheidbare werkwoorden", "Preposities"], vocabularyCategory: "Kantoor", status: "locked"
  },
  {
    id: "d4", day: 4, level: "A2+", title: "Dag 4: Onderwijs & Studie", topic: "Education",
    description: "Talking about your studies, degrees, and the Dutch school system.",
    grammarFocus: ["Relatieve bijzinnen (die/dat)", "Adjectieven"], vocabularyCategory: "Onderwijs", status: "locked"
  },
  {
    id: "d5", day: 5, level: "A2+", title: "Dag 5: Administratie", topic: "Administration",
    description: "Dealing with taxes, insurance, and municipal documents.",
    grammarFocus: ["Passief (worden)", "Indirecte vragen"], vocabularyCategory: "Overheid", status: "locked"
  },
  {
    id: "d6", day: 6, level: "A2+", title: "Dag 6: Vrije Tijd & Hobby's", topic: "Leisure",
    description: "Describing what you do in your free time and making appointments.",
    grammarFocus: ["Om... te + infinitief", "Zouden (beleefdheid)"], vocabularyCategory: "Hobby's", status: "locked"
  },
  {
    id: "d7", day: 7, level: "A2+", title: "Dag 7: Week 1 Review", topic: "Weekly Wrap-up",
    description: "Consolidating week 1 vocabulary and grammar through a master test.",
    grammarFocus: ["Review of Days 1-6"], vocabularyCategory: "Mixed Week 1", status: "locked"
  },

  // WEEK 2: Social & Environment
  {
    id: "d8", day: 8, level: "B1", title: "Dag 8: Wonen & Omgeving", topic: "Housing",
    description: "Looking for a house, neighbors, and describing your living space.",
    grammarFocus: ["Usage of 'Er' (Plaats)", "Vergelijkingen"], vocabularyCategory: "Wonen", status: "locked"
  },
  {
    id: "d9", day: 9, level: "B1", title: "Dag 9: Gezondheidszorg", topic: "Healthcare",
    description: "Visiting the doctor, explaining symptoms, and Dutch pharmacies.",
    grammarFocus: ["Imperfectum (OVT)", "Reflexive Verbs"], vocabularyCategory: "Gezondheid", status: "locked"
  },
  {
    id: "d10", day: 10, level: "B1", title: "Dag 10: De Supermarkt", topic: "Shopping",
    description: "Groceries, specialized shops, and healthy eating habits.",
    grammarFocus: ["Kwantitatieve 'er'", "Telwoorden"], vocabularyCategory: "Voeding", status: "locked"
  },
  {
    id: "d11", day: 11, level: "B1", title: "Dag 11: Reizen & Vervoer", topic: "Travel",
    description: "Public transport (OV-chipkaart), biking, and holidays.",
    grammarFocus: ["Conjunctions (omdat, want, hoewel)", "Bijwoorden"], vocabularyCategory: "Vervoer", status: "locked"
  },
  {
    id: "d12", day: 12, level: "B1", title: "Dag 12: Klimaat & Milieu", topic: "Environment",
    description: "Sustainable living, recycling, and the Dutch landscape.",
    grammarFocus: ["Zullen (Future)", "Conditionals"], vocabularyCategory: "Milieu", status: "locked"
  },
  {
    id: "d13", day: 13, level: "B1", title: "Dag 13: Stad vs. Platteland", topic: "Urban vs Rural",
    description: "Pros and cons of living in big cities like Amsterdam vs villages.",
    grammarFocus: ["Ondanks / Behalve", "Voegwoorden"], vocabularyCategory: "Geografie", status: "locked"
  },
  {
    id: "d14", day: 14, level: "B1", title: "Dag 14: Week 2 Review", topic: "Weekly Wrap-up",
    description: "Reviewing social and environmental topics.",
    grammarFocus: ["Review of Days 8-13"], vocabularyCategory: "Mixed Week 2", status: "locked"
  },

  // WEEK 3: Society & Etiquette
  {
    id: "d15", day: 15, level: "B1", title: "Dag 15: De Nederlandse Directheid", topic: "Directness",
    description: "Understanding communication styles and social norms in the NL.",
    grammarFocus: ["Nuance-woorden (toch, even, maar)", "Modale werkwoorden"], vocabularyCategory: "Communicatie", status: "locked"
  },
  {
    id: "d16", day: 16, level: "B1", title: "Dag 16: Politiek & Bestuur", topic: "Politics",
    description: "How the Dutch government works and basic political vocabulary.",
    grammarFocus: ["Passief (is/wordt)", "Relatieve voornaamwoorden"], vocabularyCategory: "Politiek", status: "locked"
  },
  {
    id: "d17", day: 17, level: "B1", title: "Dag 17: Geschiedenis", topic: "History",
    description: "Key moments in Dutch history from the Golden Age to modern times.",
    grammarFocus: ["Plusquamperfectum", "Tijdsbepalingen"], vocabularyCategory: "Geschiedenis", status: "locked"
  },
  {
    id: "d18", day: 18, level: "B1", title: "Dag 18: Kunst & Literatuur", topic: "Arts",
    description: "Dutch masters, museums, and modern literature.",
    grammarFocus: ["Adjectieven met -e", "Vergelijkingstrappen"], vocabularyCategory: "Cultuur", status: "locked"
  },
  {
    id: "d19", day: 19, level: "B1", title: "Dag 19: Feestdagen", topic: "Holidays",
    description: "King's Day, Sinterklaas, and local traditions.",
    grammarFocus: ["Primitieve bijzinnen", "Voorzetselvoorwerpen"], vocabularyCategory: "Tradities", status: "locked"
  },
  {
    id: "d20", day: 20, level: "B1", title: "Dag 20: De Multiculturele Samenleving", topic: "Diversity",
    description: "Integration, diversity, and tolerance in the Netherlands.",
    grammarFocus: ["Subjunctief (Formele vormen)", "Bijzinnen herhaling"], vocabularyCategory: "Samenleving", status: "locked"
  },
  {
    id: "d21", day: 21, level: "B1", title: "Dag 21: Week 3 Review", topic: "Weekly Wrap-up",
    description: "Cultural and societal mastery test.",
    grammarFocus: ["Review of Days 15-20"], vocabularyCategory: "Mixed Week 3", status: "locked"
  },

  // WEEK 4: Mastery & Future
  {
    id: "d22", day: 22, level: "B1+", title: "Dag 22: Economie & Geld", topic: "Economy",
    description: "Inflation, markets, and the Dutch business spirit.",
    grammarFocus: ["Vreemde woorden in het Nederlands", "Samengestelde zinnen"], vocabularyCategory: "Economie", status: "locked"
  },
  {
    id: "d23", day: 23, level: "B1+", title: "Dag 23: Technologie & AI", topic: "Technology",
    description: "The digital future and the role of tech in daily life.",
    grammarFocus: ["Futurum (gaan/zullen)", "Woordvorming"], vocabularyCategory: "Tech", status: "locked"
  },
  {
    id: "d24", day: 24, level: "B1+", title: "Dag 24: Media & Fake News", topic: "Media",
    description: "Analyzing news sources and social media influence.",
    grammarFocus: ["Kritisch taalgebruik", "Betogende teksten"], vocabularyCategory: "Media", status: "locked"
  },
  {
    id: "d25", day: 25, level: "B1+", title: "Dag 25: Klimaatverandering", topic: "Climate Change",
    description: "Advanced discussion on global warming and Dutch flood defenses.",
    grammarFocus: ["Zou/Hadden", "Hypothetische zinnen"], vocabularyCategory: "Wetenschap", status: "locked"
  },
  {
    id: "d26", day: 26, level: "B1+", title: "Dag 26: Filosofie & Ethiek", topic: "Ethics",
    description: "Discussing moral dilemmas and Dutch values.",
    grammarFocus: ["Abstracte substantieven", "Logische connectoren"], vocabularyCategory: "Filosofie", status: "locked"
  },
  {
    id: "d27", day: 27, level: "B1+", title: "Dag 27: Solliciteren (Advanced)", topic: "Advanced Career",
    description: "Mock interview at a B1+ level. Negotiating salary and conditions.",
    grammarFocus: ["Onderhandelingstaal", "Idiomen"], vocabularyCategory: "Carrière", status: "locked"
  },
  {
    id: "d28", day: 28, level: "B1+", title: "Dag 28: Emoties & Gevoelens", topic: "Emotions",
    description: "Deepening your ability to express complex feelings in Dutch.",
    grammarFocus: ["Expressieve werkwoorden", "Samenstellingen"], vocabularyCategory: "Psychologie", status: "locked"
  },
  {
    id: "d29", day: 29, level: "B1+", title: "Dag 29: Voorbereiding op B1 Examen", topic: "Exam Prep",
    description: "Final run-through of all B1 exam components.",
    grammarFocus: ["Examenstrategieën", "Tijdbeheer"], vocabularyCategory: "Examen", status: "locked"
  },
  {
    id: "d30", day: 30, level: "B1+", title: "Dag 30: Het Grote B1 Examen", topic: "Final Mastery",
    description: "Final test to prove your B1 mastery and unlock your certificate.",
    grammarFocus: ["Comprehensive Mastery"], vocabularyCategory: "Final DutchMaster", status: "locked"
  }
];
