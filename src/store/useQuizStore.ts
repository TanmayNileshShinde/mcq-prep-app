// src/store/useQuizStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Mistake {
  question: string;
  userAnswer: string;
  correctAnswer: string;
}

interface QuizState {
  selectedSubject: string | null;
  selectedUnits: number[];
  questionCount: number;
  timePerQuestion: number | null; 
  
  currentStreak: number;
  score: number;
  mistakes: Mistake[]; 
  seenQuestionIds: string[]; // <--- NEW: Tracks every question you've ever seen

  setSubject: (subject: string) => void;
  toggleUnit: (unit: number) => void;
  setQuestionCount: (count: number) => void;
  setTimer: (time: number | null) => void;
  
  incrementStreak: () => void;
  resetStreak: () => void;
  incrementScore: () => void;
  addMistake: (mistake: Mistake) => void;
  markAsSeen: (id: string) => void; // <--- NEW: Action to mark a question seen
  resetQuizState: () => void; 
  clearAllProgress: () => void; // <--- NEW: Reset your progress for finals!
}

// We wrap the store in 'persist' so it saves to your browser's Local Storage
export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      selectedSubject: null,
      selectedUnits: [],
      questionCount: 15,
      timePerQuestion: null,
      
      currentStreak: 0,
      score: 0,
      mistakes: [],
      seenQuestionIds: [],

      setSubject: (subject) => set({ selectedSubject: subject, selectedUnits: [] }),
      
      toggleUnit: (unit) => set((state) => {
        const units = state.selectedUnits.includes(unit)
          ? state.selectedUnits.filter(u => u !== unit) 
          : [...state.selectedUnits, unit];             
        return { selectedUnits: units };
      }),

      setQuestionCount: (count) => set({ questionCount: count }),
      setTimer: (time) => set({ timePerQuestion: time }),

      incrementStreak: () => set((state) => ({ currentStreak: state.currentStreak + 1 })),
      resetStreak: () => set({ currentStreak: 0 }),
      incrementScore: () => set((state) => ({ score: state.score + 1 })),
      addMistake: (mistake) => set((state) => ({ mistakes: [...state.mistakes, mistake] })),
      
      markAsSeen: (id) => set((state) => ({
        seenQuestionIds: state.seenQuestionIds.includes(id) 
          ? state.seenQuestionIds 
          : [...state.seenQuestionIds, id]
      })),

      resetQuizState: () => set({ currentStreak: 0, score: 0, mistakes: [] }), 
      clearAllProgress: () => set({ seenQuestionIds: [] }),
    }),
    {
      name: 'exam-prep-storage', // The name of the file in your browser storage
    }
  )
);