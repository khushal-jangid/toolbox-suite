import React, { useState, useEffect } from 'react';
import { Calculator, Delete, RotateCcw, Copy, Check } from 'lucide-react';

export default function CalculatorTool() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  const handleNum = (num) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOp = (op) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleBackspace = () => {
    if (display.length === 1 || display === 'Error') {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleScientific = (fn) => {
    const val = parseFloat(display);
    if (isNaN(val)) return;
    let res = 0;
    try {
      if (fn === 'sin') res = Math.sin((val * Math.PI) / 180);
      else if (fn === 'cos') res = Math.cos((val * Math.PI) / 180);
      else if (fn === 'tan') res = Math.tan((val * Math.PI) / 180);
      else if (fn === 'sqrt') res = Math.sqrt(val);
      else if (fn === 'log') res = Math.log10(val);
      else if (fn === 'ln') res = Math.log(val);
      else if (fn === 'sq') res = val * val;

      const formatted = parseFloat(res.toFixed(8)).toString();
      setDisplay(formatted);
    } catch {
      setDisplay('Error');
    }
  };

  const handleCalculate = () => {
    if (!equation) return;
    const fullExpr = equation + display;
    try {
      // Safe math eval
      const sanitized = fullExpr.replace(/×/g, '*').replace(/÷/g, '/');
      // eslint-disable-next-line no-eval
      const res = Function(`'use strict'; return (${sanitized})`)();
      const formatted = parseFloat(res.toFixed(8)).toString();

      setHistory(prev => [{ eq: fullExpr, res: formatted }, ...prev.slice(0, 5)]);
      setDisplay(formatted);
      setEquation('');
    } catch {
      setDisplay('Error');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') handleNum(e.key);
      else if (e.key === '.') handleNum('.');
      else if (e.key === '+') handleOp('+');
      else if (e.key === '-') handleOp('-');
      else if (e.key === '*') handleOp('×');
      else if (e.key === '/') { e.preventDefault(); handleOp('÷'); }
      else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); handleCalculate(); }
      else if (e.key === 'Backspace') handleBackspace();
      else if (e.key === 'Escape') handleClear();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, equation]);

  const handleCopy = () => {
    navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Calculator display */}
      <div className="bg-slate-900 p-5 rounded-2xl shadow-xl text-right font-mono space-y-1 border border-slate-800">
        <div className="h-5 text-xs text-slate-400 truncate">{equation}</div>
        <div className="text-3xl font-extrabold text-white tracking-wider truncate flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="p-1 text-slate-500 hover:text-slate-200 text-xs font-sans font-normal"
            title="Copy Result"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>
          <span>{display}</span>
        </div>
      </div>

      {/* Calculator keypad */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        {/* Scientific Row */}
        <div className="grid grid-cols-4 gap-2">
          {['sin', 'cos', 'tan', 'sqrt'].map((f) => (
            <button
              key={f}
              onClick={() => handleScientific(f)}
              className="py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
            >
              {f}
            </button>
          ))}
        </div>

        {/* Action Row */}
        <div className="grid grid-cols-4 gap-2">
          <button onClick={handleClear} className="py-3 text-xs font-bold rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-200 transition">
            AC
          </button>
          <button onClick={handleBackspace} className="py-3 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition flex items-center justify-center">
            <Delete className="h-4 w-4" />
          </button>
          <button onClick={() => handleScientific('sq')} className="py-3 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition">
            x²
          </button>
          <button onClick={() => handleOp('÷')} className="py-3 text-sm font-bold rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition">
            ÷
          </button>
        </div>

        {/* Number Keypad */}
        <div className="grid grid-cols-4 gap-2">
          {['7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+'].map((btn) => (
            <button
              key={btn}
              onClick={() => {
                if (['×', '-', '+'].includes(btn)) handleOp(btn);
                else handleNum(btn);
              }}
              className={`py-3 text-base font-bold rounded-xl transition ${
                ['×', '-', '+'].includes(btn)
                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100'
                  : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100'
              }`}
            >
              {btn}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => handleNum('0')} className="col-span-2 py-3 text-base font-bold rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition">
            0
          </button>
          <button onClick={() => handleNum('.')} className="py-3 text-base font-bold rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition">
            .
          </button>
          <button onClick={handleCalculate} className="py-3 text-base font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow transition">
            =
          </button>
        </div>
      </div>

      {/* Calculations History */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">History</span>
          <div className="space-y-1 font-mono text-xs">
            {history.map((h, i) => (
              <div key={i} className="flex justify-between py-1 text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-850 last:border-0">
                <span>{h.eq} =</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{h.res}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
