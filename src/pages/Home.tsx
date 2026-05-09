// src/pages/Home.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Timer, Hash, BookOpen, AlertTriangle } from 'lucide-react';
import { useQuizStore } from '../store/useQuizStore';

export default function Home() {
  const navigate = useNavigate();
  const { 
    selectedSubject, setSubject, 
    selectedUnits, toggleUnit,
    questionCount, setQuestionCount,
    timePerQuestion, setTimer,
    resetQuizState 
  } = useQuizStore();

  // --- NEW: Custom Error State ---
  const [error, setError] = useState<string | null>(null);

  // Auto-hide the error message after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const subjects = [
    { name: "Emerging Trends in CE & IT", available: true },
    { name: "Management", available: false }
  ];
  
  const allUnits = [1, 2, 3, 4, 5];
  const counts = [15, 30, 50, 70];
  const timers = [{ label: "Off", value: null }, { label: "30s", value: 30 }, { label: "60s", value: 60 }];

  // --- UPDATED: Replaced alerts with setError ---
  const handleStart = () => {
    if (!selectedSubject) return setError("Please select a subject first!");
    if (selectedUnits.length === 0) return setError("Please select at least one Unit!");
    setError(null);
    resetQuizState(); 
    navigate('/quiz');
  };

  const handleStudy = () => {
    if (!selectedSubject) return setError("Please select a subject first!");
    if (selectedUnits.length === 0) return setError("Please select at least one Unit!");
    setError(null);
    navigate('/study');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 relative pb-10"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          Exam Prep Pro
        </h1>
        <p className="text-slate-400 text-lg">Select your parameters to begin the session.</p>
      </div>

      {/* Subject Selection */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
          <BrainCircuit className="text-indigo-400" /> Choose Subject
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((sub) => (
            <button
              key={sub.name}
              disabled={!sub.available}
              onClick={() => setSubject(sub.name)}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-200 text-lg font-medium text-left overflow-hidden
                ${!sub.available 
                  ? 'border-slate-800 bg-slate-900/50 text-slate-600 cursor-not-allowed' 
                  : selectedSubject === sub.name 
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.2)] text-white' 
                    : 'border-slate-800 bg-slate-800/50 hover:border-slate-700 text-slate-300'}`}
            >
              {sub.name}
              {!sub.available && (
                <span className="absolute top-4 right-4 text-xs font-bold px-2 py-1 bg-slate-800 text-slate-400 rounded-md">
                  Coming Soon
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Unit Selection */}
      <AnimatePresence>
        {selectedSubject && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
              <BookOpen className="text-emerald-400" /> Select Units
            </h2>
            <div className="flex flex-wrap gap-3">
              {allUnits.map((unit) => (
                <button
                  key={unit}
                  onClick={() => toggleUnit(unit)}
                  className={`px-6 py-3 rounded-xl border-2 transition-all font-medium
                    ${selectedUnits.includes(unit) 
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                      : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-slate-300'}`}
                >
                  Unit {unit}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
            <Hash className="text-cyan-400" /> Question Amount
          </h2>
          <div className="flex flex-wrap gap-3">
            {counts.map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`px-6 py-3 rounded-xl border-2 transition-all font-medium
                  ${questionCount === count 
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' 
                    : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-slate-300'}`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
            <Timer className="text-rose-400" /> Time Per Question
          </h2>
          <div className="flex flex-wrap gap-3">
            {timers.map((t) => (
              <button
                key={t.label}
                onClick={() => setTimer(t.value)}
                className={`px-6 py-3 rounded-xl border-2 transition-all font-medium
                  ${timePerQuestion === t.value 
                    ? 'border-rose-500 bg-rose-500/10 text-rose-400' 
                    : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-slate-300'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white text-xl font-bold shadow-lg transform transition active:scale-[0.98]"
        >
          Start Quiz
        </button>
        <button
          onClick={handleStudy}
          className="w-full py-4 rounded-2xl border-2 border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xl font-bold shadow-lg transform transition active:scale-[0.98]"
        >
          Study Mode
        </button>
      </div>

      {/* --- NEW: The Floating Custom Toast --- */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 bg-rose-500/90 backdrop-blur-md text-white font-bold rounded-full shadow-[0_10px_40px_rgba(244,63,94,0.4)] border border-rose-400"
          >
            <AlertTriangle size={24} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}