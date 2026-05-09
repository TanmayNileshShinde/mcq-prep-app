// src/pages/Quiz.tsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Flame, CheckCircle2, XCircle } from 'lucide-react';
import { useQuizStore } from '../store/useQuizStore';
import { questionBank } from '../data/questions';

// Fisher-Yates Shuffle
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function Quiz() {
  const navigate = useNavigate();
  const { 
    selectedSubject, selectedUnits, questionCount, timePerQuestion, 
    incrementScore, currentStreak, incrementStreak, resetStreak,
    addMistake, seenQuestionIds, markAsSeen // <--- Pulled in our tracking data
  } = useQuizStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(timePerQuestion);

  // --- THE SMART MASTERY ALGORITHM ---
  const filteredQuestions = useMemo(() => {
    // 1. Get all questions for the selected subject and units
    const pool = questionBank.filter(
      q => q.subject === selectedSubject && selectedUnits.includes(q.unit)
    );

    // 2. Separate them into two piles
    const unseen = pool.filter(q => !seenQuestionIds.includes(q.id));
    const seen = pool.filter(q => seenQuestionIds.includes(q.id));

    // 3. Shuffle both piles separately, put Unseen on top!
    return [...shuffleArray(unseen), ...shuffleArray(seen)];
  }, [selectedSubject, selectedUnits, seenQuestionIds]);

  const currentQuestion = filteredQuestions[currentIndex];

  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return [];
    const optionsWithIndex = currentQuestion.options.map((text, originalIndex) => ({ text, originalIndex }));
    return shuffleArray(optionsWithIndex);
  }, [currentQuestion]);

  const handleSubmit = useCallback(() => {
    if (selectedOption === null || isSubmitted) return;
    
    setIsSubmitted(true);
    markAsSeen(currentQuestion.id); // <--- Mark it as seen the moment you answer it!
    
    const isTimeOut = selectedOption === -1;
    const isCorrect = !isTimeOut && shuffledOptions[selectedOption].originalIndex === currentQuestion.correctAnswerIndex;
    
    if (isCorrect) {
      incrementScore();
      incrementStreak();
    } else {
      resetStreak();
      addMistake({
        question: currentQuestion.text,
        userAnswer: isTimeOut ? "Time Ran Out" : shuffledOptions[selectedOption].text,
        correctAnswer: currentQuestion.options[currentQuestion.correctAnswerIndex]
      });
    }
  }, [selectedOption, isSubmitted, currentQuestion, shuffledOptions, incrementScore, incrementStreak, resetStreak, addMistake, markAsSeen]);

  const handleNext = () => {
    if (currentIndex + 1 >= Math.min(questionCount, filteredQuestions.length)) {
      navigate('/results'); 
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setTimeLeft(timePerQuestion); 
    }
  };

  useEffect(() => {
    if (timeLeft === null || isSubmitted) return;
    if (timeLeft === 0) {
      setSelectedOption(-1); 
      setIsSubmitted(true);
      resetStreak();
      markAsSeen(currentQuestion.id); // Mark seen even if time runs out
      addMistake({
        question: currentQuestion.text,
        userAnswer: "Time Ran Out",
        correctAnswer: currentQuestion.options[currentQuestion.correctAnswerIndex]
      });
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => (prev as number) - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, resetStreak, currentQuestion, addMistake, markAsSeen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted && e.key === 'Enter') {
        handleNext();
        return;
      }
      if (!isSubmitted) {
        if (e.key === 'Enter') handleSubmit();
        if (['1', '2', '3', '4'].includes(e.key)) {
          setSelectedOption(parseInt(e.key) - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitted, handleSubmit, handleNext]);

  if (!currentQuestion) {
    return (
      <div className="text-center mt-20 space-y-4">
        <h2 className="text-2xl text-rose-400">No questions found for this unit!</h2>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-indigo-500 rounded-lg text-white">Go Back Home</button>
      </div>
    );
  }

  const getCardStyle = (index: number) => {
    if (!isSubmitted) {
      return selectedOption === index 
        ? 'border-indigo-500 bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.3)] text-white' 
        : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700/50 text-slate-200';
    }
    
    const isCorrectOption = shuffledOptions[index].originalIndex === currentQuestion.correctAnswerIndex;
    
    if (isCorrectOption) {
      return 'border-emerald-500 bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.4)] text-white'; 
    }
    if (index === selectedOption) {
      return 'border-rose-500 bg-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.4)] text-white'; 
    }
    return 'border-slate-800 bg-slate-900/50 opacity-50 text-slate-500'; 
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-4">
          <span className="text-slate-400 font-medium tracking-wide">
            Q: <span className="text-white">{currentIndex + 1}</span> / {Math.min(questionCount, filteredQuestions.length)}
          </span>
          <div className="flex items-center gap-1.5 text-orange-400 font-bold bg-orange-500/10 px-3 py-1 rounded-full">
            <Flame size={18} className={currentStreak >= 3 ? "animate-pulse" : ""} />
            Streak: {currentStreak}
          </div>
        </div>
        
        {timeLeft !== null && (
          <div className={`flex items-center gap-2 font-mono text-xl font-bold px-4 py-1.5 rounded-full border 
            ${timeLeft <= 5 ? 'text-rose-400 border-rose-500/50 bg-rose-500/10 animate-pulse' : 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10'}`}>
            <Timer size={20} />
            {timeLeft}s
          </div>
        )}
      </div>

      <motion.div 
        key={currentQuestion.id} 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl md:text-3xl font-bold text-center leading-relaxed text-white"
      >
        {currentQuestion.text}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {shuffledOptions.map((optionObj, index) => (
          <button
            key={index}
            onClick={() => !isSubmitted && setSelectedOption(index)}
            disabled={isSubmitted}
            className={`relative p-6 rounded-2xl border-2 text-left text-lg font-medium transition-all duration-300 transform active:scale-[0.98]
              ${getCardStyle(index)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900/50 border border-slate-600 text-slate-400 text-sm">
                  {index + 1}
                </span>
                {optionObj.text}
              </div>
              
              {isSubmitted && optionObj.originalIndex === currentQuestion.correctAnswerIndex && (
                <CheckCircle2 className="text-emerald-500 animate-bounce" />
              )}
              {isSubmitted && index === selectedOption && optionObj.originalIndex !== currentQuestion.correctAnswerIndex && (
                <XCircle className="text-rose-500" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="pt-8 h-20">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.button
              key="submit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`w-full py-4 rounded-xl text-xl font-bold shadow-lg transition-all
                ${selectedOption !== null 
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
              Submit Answer (Enter)
            </motion.button>
          ) : (
            <motion.button
              key="next"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={handleNext}
              className="w-full py-4 rounded-xl text-xl font-bold bg-white text-slate-900 hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all"
            >
              {currentIndex + 1 >= Math.min(questionCount, filteredQuestions.length) ? 'View Results' : 'Next Question (Enter)'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}