import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell, Sparkles, Check, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PomodoroTimerTool() {
  const [mode, setMode] = useState('work'); // 'work' (25m), 'shortBreak' (5m), 'longBreak' (15m)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef(null);

  const MODE_TIMES = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, mode]);

  const handleTimerComplete = () => {
    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch {}

    if (mode === 'work') {
      setSessionsCompleted((prev) => prev + 1);
      alert('Focus session completed! Time for a break ☕');
    } else {
      alert('Break finished! Ready to focus? 🚀');
    }
  };

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_TIMES[newMode]);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODE_TIMES[mode]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((MODE_TIMES[mode] - timeLeft) / MODE_TIMES[mode]) * 100;

  return (
    <div className="space-y-8 max-w-xl mx-auto text-center">
      {/* Mode Selector Tabs */}
      <div className="flex justify-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80">
        <button
          onClick={() => switchMode('work')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
            mode === 'work'
              ? 'bg-[#3525cd] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Work (25m)
        </button>

        <button
          onClick={() => switchMode('shortBreak')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
            mode === 'shortBreak'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Short Break (5m)
        </button>

        <button
          onClick={() => switchMode('longBreak')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
            mode === 'longBreak'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Long Break (15m)
        </button>
      </div>

      {/* Circular Timer Display */}
      <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="110"
            stroke="currentColor"
            strokeWidth="12"
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />
          <circle
            cx="128"
            cy="128"
            r="110"
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray={2 * Math.PI * 110}
            strokeDashoffset={2 * Math.PI * 110 * (1 - progressPercent / 100)}
            strokeLinecap="round"
            className={`transition-all duration-1000 ${
              mode === 'work' ? 'text-[#3525cd]' : mode === 'shortBreak' ? 'text-emerald-500' : 'text-purple-500'
            }`}
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
          <span className="text-5xl font-mono font-black tracking-tight text-slate-900 dark:text-white">
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {mode === 'work' ? 'Focus Session' : 'Rest & Relax'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm text-white shadow-lg transition active:scale-95 ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600'
              : mode === 'work'
              ? 'bg-[#3525cd] hover:bg-indigo-600'
              : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {isRunning ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
          {isRunning ? 'PAUSE' : 'START FOCUS'}
        </button>

        <button
          onClick={resetTimer}
          className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
          title="Reset Timer"
        >
          <RotateCcw className="h-5 w-5" />
        </button>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-3.5 rounded-2xl border transition active:scale-95 ${
            soundEnabled
              ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
              : 'border-slate-200 dark:border-slate-800 text-slate-400'
          }`}
          title="Toggle Alert Sounds"
        >
          {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
      </div>

      {/* Completed Sessions Counter */}
      <div className="pt-4 flex items-center justify-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
        <Sparkles className="h-4 w-4 text-amber-500" />
        <span>Completed Focus Sessions Today: </span>
        <span className="px-2 py-0.5 rounded-md bg-[#3525cd] text-white font-mono font-bold text-xs">
          {sessionsCompleted}
        </span>
      </div>
    </div>
  );
}
