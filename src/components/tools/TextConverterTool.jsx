import React, { useState } from 'react';
import { CaseSensitive, Copy, Check, RefreshCw } from 'lucide-react';

export default function TextConverterTool() {
  const [text, setText] = useState('Hello world! Welcome to OmniTools website.');
  const [copied, setCopied] = useState(false);

  const transformations = [
    {
      label: 'UPPERCASE',
      convert: (s) => s.toUpperCase()
    },
    {
      label: 'lowercase',
      convert: (s) => s.toLowerCase()
    },
    {
      label: 'Title Case',
      convert: (s) => s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
    },
    {
      label: 'Sentence case',
      convert: (s) => s.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase())
    },
    {
      label: 'camelCase',
      convert: (s) =>
        s
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => (index === 0 ? letter.toLowerCase() : letter.toUpperCase()))
          .replace(/\s+/g, '')
          .replace(/[^a-zA-Z0-9]/g, '')
    },
    {
      label: 'kebab-case',
      convert: (s) =>
        s
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
    },
    {
      label: 'snake_case',
      convert: (s) =>
        s
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '')
    },
    {
      label: 'CONSTANT_CASE',
      convert: (s) =>
        s
          .toUpperCase()
          .replace(/[^A-Z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '')
    },
    {
      label: 'Reverse String',
      convert: (s) => s.split('').reverse().join('')
    },
    {
      label: 'Base64 Encode',
      convert: (s) => {
        try {
          return btoa(unescape(encodeURIComponent(s)));
        } catch {
          return 'Error encoding Base64';
        }
      }
    }
  ];

  const applyTransformation = (fn) => {
    setText(fn(text));
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Transformation buttons */}
      <div className="flex flex-wrap gap-2 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {transformations.map((t) => (
          <button
            key={t.label}
            onClick={() => applyTransformation(t.convert)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/60 hover:text-amber-600 dark:hover:text-amber-400 transition"
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Editor box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <span className="text-xs font-semibold text-slate-500">Live Editor</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={!text}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition flex items-center gap-1"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
          </div>
        </div>

        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 font-mono text-sm bg-transparent focus:outline-none resize-none leading-relaxed"
        />
      </div>
    </div>
  );
}
