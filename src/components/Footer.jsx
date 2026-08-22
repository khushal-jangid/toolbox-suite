import React from 'react';
import { Wrench, Shield, Zap, Lock, Heart, Code, ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '../data/categories';

export default function Footer({ onNavigate }) {
  return (
    <footer className="w-full bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Developer Story & Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#3525cd] text-white flex items-center justify-center font-bold">
                <Wrench className="h-4 w-4" />
              </div>
              <span className="font-black text-lg text-slate-900 dark:text-white">ToolBox</span>
            </div>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Handcrafted with precision by <strong className="text-slate-900 dark:text-slate-100 font-bold">Khushal Jangid</strong>. 40+ fast, privacy-first web utilities running entirely inside your browser.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300">
                <Code className="h-3.5 w-3.5 text-[#3525cd]" /> Developer Edition
              </span>
            </div>
          </div>

          {/* Suites Col 1 */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">PDF & Dev Suite</h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 4).map((cat) => (
                <li key={cat.id}>
                  <button onClick={() => onNavigate('home', null, cat.id)} className="hover:text-[#3525cd] dark:hover:text-[#c3c0ff] transition">
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Suites Col 2 */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">Utilities & Calculators</h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(4).map((cat) => (
                <li key={cat.id}>
                  <button onClick={() => onNavigate('home', null, cat.id)} className="hover:text-[#3525cd] dark:hover:text-[#c3c0ff] transition">
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Privacy & Guarantee */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">Client Privacy Guarantee</h4>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
              <Shield className="h-4 w-4 shrink-0" />
              <span>100% In-Browser Execution</span>
            </div>
            <div className="flex items-center gap-2 text-[#3525cd] dark:text-[#c3c0ff] font-semibold">
              <Zap className="h-4 w-4 shrink-0" />
              <span>Zero Server File Uploads</span>
            </div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold">
              <Lock className="h-4 w-4 shrink-0" />
              <span>No Ads & No Data Tracking</span>
            </div>
          </div>
        </div>

        {/* Developer Personal Note & Copyright */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 font-medium">
          <p className="flex items-center gap-1.5">
            Designed & Built with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> by <strong className="text-slate-900 dark:text-slate-200">Khushal Jangid</strong>
          </p>
          <p>© {new Date().getFullYear()} ToolBox by Khushal Jangid. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
