import React, { useState } from 'react';
import { Search, Wrench, Sparkles, User, LogIn, Menu, X, CheckCircle2, Sun, Moon } from 'lucide-react';

export default function Header({ onNavigate, onOpenSearch, activeCategory, onOpenProModal, currentUser, onOpenAuth, theme, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'image', label: 'Image Tools' },
    { id: 'pdf', label: 'PDF Suite' },
    { id: 'dev', label: 'Dev Utilities' },
    { id: 'text', label: 'Text Tools' },
    { id: 'security', label: 'Security' },
    { id: 'converter', label: 'Converters' },
    { id: 'calculator', label: 'Calculators' }
  ];

  const userStatus = currentUser?.status || 'FREE';

  return (
    <header className="w-full sticky top-0 z-50 bg-[#faf7f2]/95 dark:bg-[#0f141c]/95 border-b-2 border-slate-900 dark:border-slate-800 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex justify-between items-center h-16">
        
        {/* Brand Logo */}
        <button
          onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
          className="flex items-center gap-2.5 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-yellow-300 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] text-slate-950 flex items-center justify-center font-black group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
            <Wrench className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">ToolBox</span>
              <span className="text-[9px] font-black bg-rose-500 text-white px-1.5 py-0.2 rounded border border-slate-900 uppercase">FREE</span>
            </div>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 hidden sm:inline-block">
              Client-Side Paper Studio
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate('home', null, item.id)}
              className={`font-black text-xs px-2.5 py-1 rounded-lg border-2 transition-all cursor-pointer ${
                activeCategory === item.id
                  ? 'bg-yellow-300 text-slate-950 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                  : 'border-transparent text-slate-700 dark:text-slate-300 hover:border-slate-900 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Search Bar & Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Search Input */}
          <div
            onClick={onOpenSearch}
            className="hidden sm:flex items-center bg-white dark:bg-slate-800 rounded-xl px-3 py-1.5 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] cursor-pointer hover:bg-yellow-100 dark:hover:bg-slate-700 transition-all group"
          >
            <Search className="h-4 w-4 text-slate-600 dark:text-slate-300 mr-2 group-hover:text-slate-950 transition-colors" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mr-3">Search tools...</span>
            <kbd className="text-[10px] font-mono font-black text-slate-900 bg-yellow-300 px-1.5 py-0.5 rounded border border-slate-900">
              Ctrl+K
            </kbd>
          </div>

          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-xl border-2 border-slate-900 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-[2px_2px_0px_0px_#0f172a]"
            title="Search Tools"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Theme Toggle Button */}
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border-2 border-slate-900 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-[2px_2px_0px_0px_#0f172a] hover:bg-yellow-100 transition active:translate-x-0.5 active:translate-y-0.5"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-900" />}
            </button>
          )}

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border-2 border-slate-900 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-[2px_2px_0px_0px_#0f172a]"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">Tool Categories</span>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate('home', null, item.id);
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-xs font-bold text-left transition ${
                  activeCategory === item.id
                    ? 'bg-[#3525cd] text-white'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
