import React, { useState } from 'react';
import { Braces, Copy, Download, Trash2, Check, AlertTriangle, Minimize2, Maximize2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function JsonFormatterTool() {
  const [jsonInput, setJsonInput] = useState('{\n  "name": "OmniTools",\n  "status": "active",\n  "toolsCount": 50\n}');
  const [formattedOutput, setFormattedOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    if (!jsonInput.trim()) {
      setFormattedOutput('');
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      setFormattedOutput(JSON.stringify(parsed, null, indent));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMinify = () => {
    if (!jsonInput.trim()) return;
    try {
      const parsed = JSON.parse(jsonInput);
      setFormattedOutput(JSON.stringify(parsed));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCopy = () => {
    const textToCopy = formattedOutput || jsonInput;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload = formattedOutput || jsonInput;
    if (!textToDownload) return;
    const blob = new Blob([textToDownload], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'formatted.json';
    a.click();
    confetti({ particleCount: 40, spread: 40, origin: { y: 0.8 } });
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-500">Indent Spacing:</label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
          >
            <option value={2}>2 Spaces</option>
            <option value={4}>4 Spaces</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleFormat}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 transition"
          >
            <Braces className="h-3.5 w-3.5" /> Prettify JSON
          </button>

          <button
            onClick={handleMinify}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-white dark:bg-slate-700 hover:bg-slate-900 transition"
          >
            <Minimize2 className="h-3.5 w-3.5" /> Minify
          </button>

          <button
            onClick={handleCopy}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            title="Copy Output"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            title="Download JSON"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-2xl text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Invalid JSON Syntax</p>
            <p className="text-xs opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Pane */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Raw JSON Input</span>
            <button onClick={() => setJsonInput('')} className="text-xs text-rose-500 hover:underline">Clear</button>
          </div>
          <textarea
            rows={14}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your raw JSON string here..."
            className="w-full p-4 font-mono text-xs bg-transparent focus:outline-none resize-none flex-1 leading-relaxed"
          />
        </div>

        {/* Output Pane */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Formatted Output</span>
          </div>
          <textarea
            rows={14}
            readOnly
            value={formattedOutput || jsonInput}
            className="w-full p-4 font-mono text-xs bg-slate-50/30 dark:bg-slate-950/30 focus:outline-none resize-none flex-1 leading-relaxed text-emerald-600 dark:text-emerald-400"
          />
        </div>
      </div>
    </div>
  );
}
