import React, { useState } from 'react';
import { Type, Copy, Trash2, Check, Clock, MessageSquare, AlignLeft, Hash } from 'lucide-react';

export default function WordCounterTool() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const cleanText = text.trim();
  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const charCountWithSpaces = text.length;
  const charCountNoSpaces = text.replace(/\s/g, '').length;
  
  const sentences = cleanText ? cleanText.split(/[.!?]+/).filter(Boolean) : [];
  const sentenceCount = sentences.length;

  const paragraphs = cleanText ? cleanText.split(/\n+/).filter(Boolean) : [];
  const paragraphCount = paragraphs.length;

  // Reading time (avg 200 wpm), Speaking time (avg 130 wpm)
  const readingTimeMinutes = Math.ceil(wordCount / 200);
  const speakingTimeMinutes = Math.ceil(wordCount / 130);

  // Word frequency
  const getFrequency = () => {
    if (words.length === 0) return [];
    const freq = {};
    words.forEach(w => {
      const sanitized = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (sanitized.length > 2) {
        freq[sanitized] = (freq[sanitized] || 0) + 1;
      }
    });

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  };

  const frequencies = getFrequency();

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Words</p>
          <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{wordCount}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Characters</p>
          <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{charCountWithSpaces}</p>
          <p className="text-[11px] text-slate-400">({charCountNoSpaces} no spaces)</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Sentences</p>
          <p className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">{sentenceCount}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Paragraphs</p>
          <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{paragraphCount}</p>
        </div>
      </div>

      {/* Editor & Secondary Stats */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-500" /> ~{readingTimeMinutes} min read
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-indigo-500" /> ~{speakingTimeMinutes} min speak
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={!text}
              className="p-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 transition flex items-center gap-1"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={() => setText('')}
              disabled={!text}
              className="p-1.5 text-xs font-semibold rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 disabled:opacity-30 transition flex items-center gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </button>
          </div>
        </div>

        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your content here to calculate word counts, character density, and reading duration..."
          className="w-full p-5 text-base bg-transparent focus:outline-none resize-none leading-relaxed"
        />
      </div>

      {/* Top Word Frequency Table */}
      {frequencies.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Word Frequency</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {frequencies.map(([word, count]) => (
              <div key={word} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{word}</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
