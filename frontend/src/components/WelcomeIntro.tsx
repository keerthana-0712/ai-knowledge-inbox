import React, { useState, useEffect } from 'react';
import { TuriumLogo } from './TuriumLogo';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface WelcomeIntroProps {
  onComplete: () => void;
  isOpen: boolean;
}

export const WelcomeIntro: React.FC<WelcomeIntroProps> = ({ onComplete, isOpen }) => {
  const [step, setStep] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setIsClosing(false);
      return;
    }

    const t1 = setTimeout(() => setStep(1), 350);
    const t2 = setTimeout(() => setStep(2), 700);
    const t3 = setTimeout(() => setStep(3), 1100);
    const t4 = setTimeout(() => {
      handleDismiss();
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen]);

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      onComplete();
      setIsClosing(false);
    }, 450);
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-md transition-opacity duration-500 ${
        isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div 
        className={`w-full max-w-lg bg-gradient-to-b from-white via-[#fdfcfa] to-[#f7f4ee] border border-[#e4dfd4] rounded-2xl shadow-2xl p-8 relative overflow-hidden transition-all duration-500 transform ${
          isClosing ? 'scale-95 translate-y-3 opacity-0' : 'scale-100 translate-y-0 opacity-100'
        }`}
      >
        {/* Ambient violet backlight aura */}
        <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-[#6100ff]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-[#3b82f6]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-5">
          {/* 3D Animated Logo with Pulse Rings */}
          <div className="relative flex items-center justify-center my-1">
            <div className="absolute w-20 h-20 rounded-full bg-[#6100ff]/15 animate-ping opacity-60" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-white via-[#f7f2ff] to-[#ebe0ff] border border-[#d9c6ff] shadow-lg flex items-center justify-center p-2.5 animate-pulse-ripple">
              <TuriumLogo size={36} glow={true} />
            </div>
          </div>

          {/* Typography Lockup */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#f5f0ff] border border-[#d9c6ff] text-[10.5px] font-bold text-[#6100ff] tracking-[0.14em] uppercase">
              <Sparkles className="w-3 h-3 text-[#6100ff]" />
              <span>Turium Enterprise AI</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111114] font-display">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-[#6100ff] via-[#7d1aff] to-[#9d4edd] bg-clip-text text-transparent">
                Knowledge Inbox
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-[#555359] max-w-sm mx-auto leading-relaxed">
              Your autonomous personal knowledge engine with vector retrieval and anti-hallucination citations.
            </p>
          </div>

          {/* Initialization Stepper Checklist */}
          <div className="w-full bg-white/90 border border-[#e8e4dd] rounded-xl p-3.5 space-y-2 text-left shadow-xs">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#78757d]">
              <span className="font-semibold text-[#111114] uppercase tracking-wider text-[10px]">
                System Initialization
              </span>
              <span>{Math.min(100, (step + 1) * 33)}%</span>
            </div>

            <div className="w-full bg-[#f0eee6] rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#6100ff] to-[#9d4edd] h-full transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, (step + 1) * 33)}%` }}
              />
            </div>

            <div className="pt-1 space-y-1.5 text-xs">
              <div className={`flex items-center gap-2 transition-all duration-300 ${
                step >= 1 ? 'text-[#111114] opacity-100' : 'text-[#a7a5aa] opacity-40'
              }`}>
                <CheckCircle2 className={`w-3.5 h-3.5 ${step >= 1 ? 'text-emerald-500' : 'text-[#a7a5aa]'}`} />
                <span className="font-medium text-[11px]">SQLite WAL Vector Store & Chunker Mounted</span>
              </div>

              <div className={`flex items-center gap-2 transition-all duration-300 ${
                step >= 2 ? 'text-[#111114] opacity-100' : 'text-[#a7a5aa] opacity-40'
              }`}>
                <CheckCircle2 className={`w-3.5 h-3.5 ${step >= 2 ? 'text-emerald-500' : 'text-[#a7a5aa]'}`} />
                <span className="font-medium text-[11px]">In-Memory Cosine Similarity Engine Online</span>
              </div>

              <div className={`flex items-center gap-2 transition-all duration-300 ${
                step >= 3 ? 'text-[#111114] opacity-100' : 'text-[#a7a5aa] opacity-40'
              }`}>
                <CheckCircle2 className={`w-3.5 h-3.5 ${step >= 3 ? 'text-emerald-500' : 'text-[#a7a5aa]'}`} />
                <span className="font-medium text-[11px]">Grounded Citation & Anti-Hallucination Pipeline Armed</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleDismiss}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#6100ff] hover:bg-[#5200db] text-white text-xs font-bold tracking-wide transition-all shadow-md hover:shadow-lg active:scale-98"
          >
            <span>Enter Knowledge Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
