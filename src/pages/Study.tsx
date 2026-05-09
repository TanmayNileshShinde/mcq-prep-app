// src/pages/Study.tsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpenCheck } from 'lucide-react';
import { useQuizStore } from '../store/useQuizStore';
import { questionBank } from '../data/questions';

export default function Study() {
  const navigate = useNavigate();
  const { selectedSubject, selectedUnits } = useQuizStore();

  const filteredQuestions = questionBank.filter(
    q => q.subject === selectedSubject && selectedUnits.includes(q.unit)
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-slate-900/80 backdrop-blur-md py-4 z-20 border-b border-slate-800">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="text-right">
          <h1 className="text-xl font-bold text-emerald-400 flex items-center gap-2 justify-end">
            Study Mode <BookOpenCheck size={20} />
          </h1>
          <p className="text-xs text-slate-500">{selectedSubject} - Units {selectedUnits.join(', ')}</p>
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-6">
        {filteredQuestions.map((q, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            key={q.id} 
            className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 space-y-4"
          >
            <div className="flex justify-between items-start gap-4">
              <span className="bg-slate-700 text-slate-300 text-xs font-bold px-2 py-1 rounded">Q {i + 1}</span>
              <p className="text-lg font-semibold text-slate-100 flex-1">{q.text}</p>
            </div>

            <div className="grid grid-cols-1 gap-2 ml-4">
              {q.options.map((option, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border ${
                    idx === q.correctAnswerIndex 
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-bold' 
                    : 'bg-slate-900/30 border-slate-800 text-slate-500'
                  }`}
                >
                  <span className="mr-3 opacity-50">{String.fromCharCode(65 + idx)})</span>
                  {option}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredQuestions.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-500">No questions found for the selected units.</p>
        </div>
      )}
    </div>
  );
}