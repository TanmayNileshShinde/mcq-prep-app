// src/pages/Results.tsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Target, RotateCcw, Home, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useQuizStore } from '../store/useQuizStore';
import { questionBank } from '../data/questions';

export default function Results() {
  const navigate = useNavigate();
  const { score, mistakes, questionCount, selectedSubject, selectedUnits, resetQuizState } = useQuizStore();

  const filteredQuestions = questionBank.filter(q => q.subject === selectedSubject && selectedUnits.includes(q.unit));
  const actualTotal = Math.min(questionCount, filteredQuestions.length);
  const percentage = actualTotal > 0 ? Math.round((score / actualTotal) * 100) : 0;

  let message = "Keep Practicing!";
  let colorClass = "text-rose-400";
  let strokeClass = "stroke-rose-500";
  
  if (percentage >= 80) {
    message = "Outstanding!";
    colorClass = "text-emerald-400";
    strokeClass = "stroke-emerald-500";
  } else if (percentage >= 50) {
    message = "Good Effort!";
    colorClass = "text-amber-400";
    strokeClass = "stroke-amber-500";
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const handleRetake = () => {
    resetQuizState();
    navigate('/quiz');
  };

  const handleHome = () => {
    resetQuizState();
    navigate('/');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto space-y-8 mt-10 pb-20"
    >
      <div className="text-center space-y-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center justify-center p-4 bg-indigo-500/20 rounded-full mb-4"
        >
          <Trophy size={48} className="text-indigo-400" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          Session Complete!
        </h1>
        <p className="text-xl text-slate-400">{selectedSubject}</p>
      </div>

      {/* Score Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden"
      >
        <h2 className={`text-3xl font-bold mb-8 z-10 ${colorClass}`}>{message}</h2>

        <div className="relative w-48 h-48 flex items-center justify-center z-10">
          <svg className="transform -rotate-90 w-full h-full">
            <circle cx="96" cy="96" r={radius} className="stroke-slate-700 fill-none" strokeWidth="12" />
            <motion.circle
              cx="96" cy="96" r={radius}
              className={`${strokeClass} fill-none drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
              strokeWidth="12" strokeLinecap="round" strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-white">{percentage}%</span>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2 text-lg text-slate-300 font-medium z-10">
          <Target className="text-cyan-400" size={24} />
          You scored <span className="text-white font-bold">{score}</span> out of <span className="text-white font-bold">{actualTotal}</span>
        </div>
      </motion.div>

      {/* Mistake Review Section */}
      {mistakes.length > 0 && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-4"
        >
          <h3 className="text-2xl font-bold flex items-center gap-2 text-rose-400 pb-2 border-b border-slate-700">
            <AlertCircle /> Review Mistakes
          </h3>
          <div className="space-y-4">
            {mistakes.map((mistake, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-3">
                <p className="text-lg font-medium text-white">{mistake.question}</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
                    <XCircle className="shrink-0 mt-0.5" size={18} />
                    <span><strong>Your Answer:</strong> {mistake.userAnswer}</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    <CheckCircle2 className="shrink-0 mt-0.5" size={18} />
                    <span><strong>Correct Answer:</strong> {mistake.correctAnswer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4"
      >
        <button
          onClick={handleRetake}
          className="flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-lg font-bold transition-all active:scale-[0.98]"
        >
          <RotateCcw size={20} />
          Retake Quiz
        </button>
        
        <button
          onClick={handleHome}
          className="flex items-center justify-center gap-2 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-lg font-bold transition-all shadow-lg active:scale-[0.98]"
        >
          <Home size={20} />
          Change Subject
        </button>
      </motion.div>
    </motion.div>
  );
}