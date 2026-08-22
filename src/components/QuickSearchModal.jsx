import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';
import { TOOLS_REGISTRY } from '../data/toolsRegistry';

export default function QuickSearchModal({ isOpen, onClose, onSelectTool }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTools = TOOLS_REGISTRY.filter((t) => {
    const q = query.toLowerCase().trim();
    return (
      t.name.toLowerCase().includes(q) ||
      (t.shortDescription && t.shortDescription.toLowerCase().includes(q)) ||
      (t.seo?.keywords && t.seo.keywords.toLowerCase().includes(q)) ||
      (t.category && t.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type tool name (e.g. PDF merger, QR Code, Background remover...)"
            className="w-full text-base bg-transparent focus:outline-none placeholder-slate-400"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 flex-1">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  onSelectTool(tool.slug);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition">
                      {tool.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{tool.shortDescription}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-slate-500">
              No matching tools found for "{query}".
            </div>
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono">ESC</kbd> to exit</span>
          <span>{filteredTools.length} tools available</span>
        </div>
      </div>
    </div>
  );
}
