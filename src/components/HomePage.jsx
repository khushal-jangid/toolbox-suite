import React, { useState } from 'react';
import { 
  Search, Star, Sparkles, Shield, Zap, Lock, ArrowRight, Check, Code2, Terminal, CheckCircle2,
  Maximize2, Files, FileImage, QrCode, KeyRound, FileSpreadsheet, Braces, Scaling, Wand2, 
  CaseSensitive, Video, ArrowLeftRight, Calculator, AlignLeft, Code, Link, Fingerprint, 
  Binary, Palette, FileCode, GitCompare, FileEdit, AppWindow, Landmark, HeartPulse, 
  Percent, Ruler, Pipette, Globe, Eye, Scan, ShieldAlert, Calendar, TextSearch, Tag, Timer, Laptop, Monitor,
  FolderArchive, FileDown, Scissors, Coins, Crop, FileText, Presentation, Trash2, RotateCw, Hash, PenTool,
  Unlock, ScanText, Wrench, Edit3, EyeOff
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { TOOLS_REGISTRY } from '../data/toolsRegistry';
import ToolVisualPreview from './ToolVisualPreview';

const ICON_MAP = {
  Maximize2, Files, FileImage, QrCode, KeyRound, FileSpreadsheet, Braces, Scaling, Wand2,
  CaseSensitive, Video, ArrowLeftRight, Calculator, AlignLeft, Code, Link, Fingerprint,
  Binary, Palette, FileCode, GitCompare, Lock, FileEdit, AppWindow, Landmark, HeartPulse,
  Percent, Ruler, Pipette, Globe, Eye, Scan, ShieldAlert, Calendar, TextSearch, Tag, Code2,
  Timer, Laptop, Monitor, FolderArchive, FileDown, Scissors, Coins, Crop, FileText, Presentation,
  Trash2, RotateCw, Hash, PenTool, Unlock, ScanText, Wrench, Edit3, EyeOff
};

const CATEGORY_CARD_THEMES = {
  pdf: {
    bg: 'bg-[#fff5f5] dark:bg-[#1a1218]',
    border: 'border-2 border-slate-900 dark:border-slate-700',
    shadow: 'shadow-[4px_4px_0px_0px_#0f172a] dark:shadow-[4px_4px_0px_0px_#000]',
    badgeBg: 'bg-rose-500 text-white',
    accentText: 'text-rose-600 dark:text-rose-400',
    tag: '📄 PDF Suite'
  },
  image: {
    bg: 'bg-[#f0f9ff] dark:bg-[#0f1d2e]',
    border: 'border-2 border-slate-900 dark:border-slate-700',
    shadow: 'shadow-[4px_4px_0px_0px_#0f172a] dark:shadow-[4px_4px_0px_0px_#000]',
    badgeBg: 'bg-sky-500 text-white',
    accentText: 'text-sky-600 dark:text-sky-400',
    tag: '🖼️ Image Studio'
  },
  dev: {
    bg: 'bg-[#f0fdf4] dark:bg-[#0c2217]',
    border: 'border-2 border-slate-900 dark:border-slate-700',
    shadow: 'shadow-[4px_4px_0px_0px_#0f172a] dark:shadow-[4px_4px_0px_0px_#000]',
    badgeBg: 'bg-emerald-500 text-white',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    tag: '💻 Dev Tool'
  },
  security: {
    bg: 'bg-[#faf5ff] dark:bg-[#1e1333]',
    border: 'border-2 border-slate-900 dark:border-slate-700',
    shadow: 'shadow-[4px_4px_0px_0px_#0f172a] dark:shadow-[4px_4px_0px_0px_#000]',
    badgeBg: 'bg-purple-500 text-white',
    accentText: 'text-purple-600 dark:text-purple-400',
    tag: '🔐 Security'
  },
  calculator: {
    bg: 'bg-[#fffbeb] dark:bg-[#261f0e]',
    border: 'border-2 border-slate-900 dark:border-slate-700',
    shadow: 'shadow-[4px_4px_0px_0px_#0f172a] dark:shadow-[4px_4px_0px_0px_#000]',
    badgeBg: 'bg-yellow-400 text-slate-950',
    accentText: 'text-amber-600 dark:text-amber-400',
    tag: '🧮 Calculator'
  },
  converter: {
    bg: 'bg-[#ecfeff] dark:bg-[#0b2226]',
    border: 'border-2 border-slate-900 dark:border-slate-700',
    shadow: 'shadow-[4px_4px_0px_0px_#0f172a] dark:shadow-[4px_4px_0px_0px_#000]',
    badgeBg: 'bg-cyan-500 text-slate-950',
    accentText: 'text-cyan-600 dark:text-cyan-400',
    tag: '🔄 Converter'
  },
  text: {
    bg: 'bg-[#fff7ed] dark:bg-[#26170d]',
    border: 'border-2 border-slate-900 dark:border-slate-700',
    shadow: 'shadow-[4px_4px_0px_0px_#0f172a] dark:shadow-[4px_4px_0px_0px_#000]',
    badgeBg: 'bg-orange-500 text-white',
    accentText: 'text-orange-600 dark:text-orange-400',
    tag: '✍️ Text'
  },
  social: {
    bg: 'bg-[#eef2ff] dark:bg-[#151936]',
    border: 'border-2 border-slate-900 dark:border-slate-700',
    shadow: 'shadow-[4px_4px_0px_0px_#0f172a] dark:shadow-[4px_4px_0px_0px_#000]',
    badgeBg: 'bg-indigo-600 text-white',
    accentText: 'text-indigo-600 dark:text-indigo-400',
    tag: '🌐 Web/SEO'
  }
};

const DEFAULT_THEME = {
  bg: 'bg-white dark:bg-slate-900',
  border: 'border-2 border-slate-900 dark:border-slate-700',
  shadow: 'shadow-[4px_4px_0px_0px_#0f172a] dark:shadow-[4px_4px_0px_0px_#000]',
  badgeBg: 'bg-indigo-600 text-white',
  accentText: 'text-indigo-600 dark:text-indigo-400',
  tag: '⚡ Tool'
};

export default function HomePage({ onNavigate, activeCategoryFilter, favorites = [], toggleFavorite }) {
  const [selectedCategory, setSelectedCategory] = useState(activeCategoryFilter || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    if (activeCategoryFilter) {
      setSelectedCategory(activeCategoryFilter);
    }
  }, [activeCategoryFilter]);

  const filteredTools = TOOLS_REGISTRY.filter(t => {
    const matchesCat = selectedCategory === 'all' || (selectedCategory === 'favorites' ? (Array.isArray(favorites) && favorites.includes(t.id)) : t.category === selectedCategory);
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      t.name.toLowerCase().includes(q) ||
      t.shortDescription?.toLowerCase().includes(q) ||
      t.seo?.keywords?.toLowerCase().includes(q)
    );
    return matchesCat && matchesSearch;
  });

  const handleToolClick = (tool) => {
    onNavigate('tool', tool.slug);
  };

  return (
    <div className="space-y-12 pb-20 bg-paper-grid min-h-screen">
      {/* Modern High-Impact Hero Banner */}
      <section className="relative w-full bg-gradient-to-b from-amber-100/60 via-[#faf7f2] to-[#faf7f2] dark:from-[#1b192e] dark:via-[#0f141c] dark:to-[#0f141c] pt-14 pb-16 px-4 md:px-8 text-center flex flex-col items-center justify-center border-b-2 border-slate-900 dark:border-slate-800 overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto w-full space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-300 dark:bg-yellow-950 text-slate-950 dark:text-yellow-200 text-xs font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] mx-auto">
            <span>✨ 100% FREE</span> • <span>🔒 PRIVATE CLIENT-SIDE</span> • <span>⚡ ZERO SERVER UPLOADS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Handcrafted Web Utilities & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-rose-600 via-purple-600 to-sky-600 bg-clip-text text-transparent underline decoration-wavy decoration-yellow-400">
              PDF & Image Tools
            </span>
          </h1>

          {/* Interactive Search Box */}
          <div className="relative w-full max-w-2xl mx-auto pt-3">
            <div className="relative flex items-center">
              <Search className="h-5 w-5 text-slate-500 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 66+ tools (e.g. PDF to Word, Compress Image, Sign PDF, QR Code, JSON)..."
                className="w-full pl-12 pr-28 py-4 bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-2xl text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none shadow-[4px_4px_0px_0px_#0f172a] dark:shadow-[4px_4px_0px_0px_#000] transition-all"
              />
              <div className="absolute right-3.5 hidden sm:flex items-center gap-1.5">
                <span className="text-xs font-mono font-black text-slate-900 bg-yellow-300 px-2 py-1 rounded border-2 border-slate-900 shadow-xs">
                  Ctrl + K
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-3 sm:px-6 md:px-8 space-y-6 sm:space-y-10">
        {/* Category Navigation Pills - Mobile Sticky App Bar */}
        <section className="space-y-4 sm:space-y-6">
          <div className="sticky top-16 z-30 bg-[#faf7f2]/95 dark:bg-[#0f141c]/95 backdrop-blur-md py-2 border-b-2 border-slate-900/40 dark:border-slate-800 -mx-3 px-3 sm:-mx-6 sm:px-6 overflow-x-auto flex items-center justify-start gap-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-black rounded-xl border-2 border-slate-900 transition whitespace-nowrap flex items-center gap-1.5 active:scale-95 ${
                selectedCategory === 'all'
                  ? 'bg-yellow-300 text-slate-950 shadow-[2px_2px_0px_0px_#0f172a]'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-yellow-100'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" /> All ({TOOLS_REGISTRY.length})
            </button>

            {favorites.length > 0 && (
              <button
                onClick={() => setSelectedCategory('favorites')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-black rounded-xl border-2 border-slate-900 transition flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
                  selectedCategory === 'favorites'
                    ? 'bg-amber-400 text-slate-950 shadow-[2px_2px_0px_0px_#0f172a]'
                    : 'bg-white dark:bg-slate-900 text-amber-700 hover:bg-amber-50'
                }`}
              >
                <Star className="h-3.5 w-3.5 fill-current" /> Saved ({favorites.length})
              </button>
            )}

            {CATEGORIES.map((cat) => {
              const catCount = TOOLS_REGISTRY.filter(t => t.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-black rounded-xl border-2 border-slate-900 transition whitespace-nowrap flex items-center gap-1.5 active:scale-95 ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#0f172a] dark:bg-white dark:text-slate-900'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full border border-slate-900 ${selectedCategory === cat.id ? 'bg-yellow-300 text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-700'}`}>
                    {catCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Visual Tool Cards Grid - 2 Column on Mobile */}
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filteredTools.map((tool) => {
                const theme = CATEGORY_CARD_THEMES[tool.category] || DEFAULT_THEME;
                const isFav = Array.isArray(favorites) && favorites.includes(tool.id);

                return (
                  <div
                    key={tool.id}
                    onClick={() => handleToolClick(tool)}
                    className={`${theme.bg} ${theme.border} shadow-[3px_3px_0px_0px_#0f172a] sm:shadow-[4px_4px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#0f172a] hover:shadow-[5px_5px_0px_0px_#0f172a] rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 transition-all duration-150 cursor-pointer group flex flex-col justify-between h-full relative`}
                  >
                    <div>
                      {/* Top Visual Mockup Image/Graphic */}
                      <div className="mb-2 sm:mb-3.5 overflow-hidden rounded-xl sm:rounded-2xl">
                        <ToolVisualPreview toolId={tool.id} category={tool.category} name={tool.name} />
                      </div>

                      {/* Title & Badge */}
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h3 className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-snug line-clamp-1 group-hover:underline">
                          {tool.name}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(tool.id);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-amber-500 transition shrink-0 active:scale-75"
                          title="Save to favorites"
                        >
                          <Star className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
                        </button>
                      </div>

                      <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-tight sm:leading-relaxed font-medium">
                        {tool.shortDescription}
                      </p>
                    </div>

                    {/* Footer Action */}
                    <div className="pt-2 sm:pt-3 flex items-center justify-between text-xs font-black border-t border-slate-900/20 dark:border-slate-800 mt-2 sm:mt-4 text-slate-900 dark:text-slate-100">
                      <span className={`text-[9px] sm:text-[10px] uppercase tracking-wider font-mono px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full border border-slate-900 ${theme.badgeBg} truncate max-w-[80px] sm:max-w-none`}>
                        {theme.tag}
                      </span>
                      <span className="flex items-center gap-0.5 sm:gap-1 bg-white dark:bg-slate-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg border border-slate-900 text-[10px] sm:text-[11px] shadow-[1px_1px_0px_0px_#0f172a]">
                        Open <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 sm:p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] text-slate-700 space-y-2">
              <p className="text-sm sm:text-base font-black">No tools found matching "{searchQuery}"</p>
              <p className="text-xs text-slate-500">Try searching for "PDF", "Image", "QR", "JSON", or "Converter".</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-3 px-4 py-2 bg-yellow-300 text-slate-900 text-xs font-black rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] inline-block"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </section>

        {/* Bottom Paper Banner: Android App Download */}
        <section className="bg-[#fffbeb] dark:bg-[#1a160d] border-2 border-slate-900 dark:border-slate-700 rounded-3xl p-5 sm:p-8 shadow-[6px_6px_0px_0px_#0f172a] dark:shadow-[6px_6px_0px_0px_#000] relative overflow-hidden bg-paper-dots mt-10">
          <div className="absolute -top-3 left-6 bg-yellow-400 text-slate-950 px-4 py-0.5 text-[10px] font-black uppercase tracking-wider border-2 border-slate-900 shadow-xs rotate-1 z-10">
            📌 OFFICIAL ANDROID APP
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
            <div className="md:col-span-8 space-y-2 text-left">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl">📱</span>
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
                  Get <span className="bg-yellow-300 text-slate-950 px-2 py-0.5 rounded-lg border-2 border-slate-900 inline-block shadow-[2px_2px_0px_0px_#0f172a] -rotate-1">ToolBox</span> on your Phone!
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                Carry all 66+ PDF, image, code, and calculator utilities in your pocket with zero ads, offline support, and 100% privacy.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] font-black bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-900 text-slate-900 dark:text-slate-100">
                  ✨ 100% Free
                </span>
                <span className="text-[11px] font-black bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-900 text-slate-900 dark:text-slate-100">
                  ⚡ 4.75 MB
                </span>
                <span className="text-[11px] font-black bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-900 text-slate-900 dark:text-slate-100">
                  🔒 No Server Uploads
                </span>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-2.5 justify-center">
              <button
                onClick={() => onNavigate('download')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition cursor-pointer"
              >
                <span>📲 Download APK (4.75 MB)</span>
              </button>
              <button
                onClick={() => onNavigate('download')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold text-xs border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] hover:bg-yellow-100 active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
              >
                <span>Scan QR on Mobile ➔</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

