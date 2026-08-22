import React from 'react';
import { 
  FileText, FileSpreadsheet, Presentation, ArrowRight, ShieldCheck, Lock, Unlock,
  Scissors, RotateCw, PenTool, Hash, ScanText, Wrench, EyeOff, Crop, Image,
  FolderArchive, Code2, QrCode, KeyRound, Sparkles, Check, ArrowLeftRight,
  Calculator, Calendar, Timer, Coins, DollarSign, Layers, Zap, CheckCircle2, Award
} from 'lucide-react';

export default function ToolVisualPreview({ toolId, category, name }) {
  // 1. PDF to Word
  if (toolId === 'pdf-to-word') {
    return (
      <div className="h-28 w-full bg-[#fef2f2] dark:bg-rose-950/40 rounded-2xl p-3 flex items-center justify-center gap-3 relative overflow-hidden border-2 border-slate-900 dark:border-slate-700 bg-paper-dots">
        <div className="w-14 h-20 bg-rose-500 text-white rounded-lg p-1.5 flex flex-col justify-between shadow-[2px_2px_0px_0px_#0f172a] border-2 border-slate-900 transform -rotate-6 transition group-hover:rotate-0">
          <span className="text-[8px] font-black bg-white text-rose-600 px-1 rounded self-start">PDF</span>
          <div className="space-y-1">
            <div className="h-1 bg-white/80 rounded w-full" />
            <div className="h-1 bg-white/80 rounded w-2/3" />
          </div>
        </div>
        <div className="w-6 h-6 rounded-full bg-yellow-300 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] flex items-center justify-center text-slate-900 font-black text-xs z-10">
          ➔
        </div>
        <div className="w-14 h-20 bg-sky-500 text-white rounded-lg p-1.5 flex flex-col justify-between shadow-[2px_2px_0px_0px_#0f172a] border-2 border-slate-900 transform rotate-6 transition group-hover:rotate-0">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-black bg-white text-sky-600 px-1 rounded">DOC</span>
            <FileText className="h-2.5 w-2.5 text-white" />
          </div>
          <div className="space-y-1">
            <div className="h-1 bg-white/80 rounded w-full" />
            <div className="h-1 bg-white/80 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  // 2. PDF to Excel
  if (toolId === 'pdf-to-excel' || toolId === 'excel-to-pdf') {
    return (
      <div className="h-28 w-full bg-[#f0fdf4] dark:bg-emerald-950/40 rounded-2xl p-3 flex items-center justify-center gap-3 relative overflow-hidden border-2 border-slate-900 dark:border-slate-700 bg-paper-dots">
        <div className="w-14 h-20 bg-rose-500 text-white rounded-lg p-1.5 flex flex-col justify-between shadow-[2px_2px_0px_0px_#0f172a] border-2 border-slate-900 transform -rotate-3">
          <span className="text-[8px] font-black bg-white text-rose-600 px-1 rounded self-start">PDF</span>
          <div className="space-y-1">
            <div className="h-1 bg-white/80 rounded w-full" />
          </div>
        </div>
        <div className="w-6 h-6 rounded-full bg-yellow-300 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] flex items-center justify-center text-slate-900 font-black text-xs z-10">
          ➔
        </div>
        <div className="w-18 h-20 bg-emerald-500 text-white rounded-lg p-1.5 flex flex-col justify-between shadow-[2px_2px_0px_0px_#0f172a] border-2 border-slate-900 transform rotate-3">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-black bg-white text-emerald-700 px-1 rounded">XLSX</span>
            <FileSpreadsheet className="h-3 w-3 text-white" />
          </div>
          <div className="grid grid-cols-2 gap-1 bg-emerald-600/60 p-1 rounded border border-emerald-400">
            <div className="h-1.5 bg-white rounded-xs" />
            <div className="h-1.5 bg-white rounded-xs" />
            <div className="h-1.5 bg-white rounded-xs" />
            <div className="h-1.5 bg-white rounded-xs" />
          </div>
        </div>
      </div>
    );
  }

  // 3. PDF to PowerPoint
  if (toolId === 'pdf-to-powerpoint' || toolId === 'powerpoint-to-pdf') {
    return (
      <div className="h-28 w-full bg-[#fff7ed] dark:bg-orange-950/40 rounded-2xl p-3 flex items-center justify-center gap-3 relative overflow-hidden border-2 border-slate-900 dark:border-slate-700 bg-paper-dots">
        <div className="w-14 h-20 bg-rose-500 text-white rounded-lg p-1.5 flex flex-col justify-between shadow-[2px_2px_0px_0px_#0f172a] border-2 border-slate-900 transform -rotate-3">
          <span className="text-[8px] font-black bg-white text-rose-600 px-1 rounded self-start">PDF</span>
          <div className="h-1 bg-white/80 rounded w-full" />
        </div>
        <div className="w-6 h-6 rounded-full bg-yellow-300 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] flex items-center justify-center text-slate-900 font-black text-xs z-10">
          ➔
        </div>
        <div className="w-20 h-16 bg-orange-500 text-white rounded-lg p-1.5 flex flex-col justify-between shadow-[2px_2px_0px_0px_#0f172a] border-2 border-slate-900 transform rotate-3">
          <div className="flex items-center justify-between">
            <span className="text-[7px] font-black bg-white text-orange-600 px-1 rounded">16:9 PPT</span>
            <Presentation className="h-3 w-3 text-white" />
          </div>
          <div className="flex items-end gap-1 h-4 bg-orange-600/50 p-1 rounded">
            <div className="w-1/3 h-2 bg-yellow-300 rounded-t" />
            <div className="w-1/3 h-3 bg-white rounded-t" />
            <div className="w-1/3 h-2 bg-yellow-300 rounded-t" />
          </div>
        </div>
      </div>
    );
  }

  // 4. Image Compressor
  if (toolId === 'image-compressor') {
    return (
      <div className="h-28 w-full bg-[#ecfeff] dark:bg-teal-950/40 rounded-2xl p-3 flex flex-col justify-between relative overflow-hidden border-2 border-slate-900 dark:border-slate-700 bg-paper-grid">
        <div className="flex items-center justify-between text-xs font-black">
          <span className="text-slate-500 line-through bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-900/30 text-[10px]">
            5.2 MB
          </span>
          <span className="px-2 py-0.5 bg-yellow-300 text-slate-900 rounded-md text-[10px] font-black border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0f172a]">
            ⚡ -88% SAVED
          </span>
          <span className="text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-900/30 text-xs font-black">
            620 KB
          </span>
        </div>
        <div className="space-y-1">
          <div className="w-full bg-white dark:bg-slate-800 h-3 rounded-full border-2 border-slate-900 overflow-hidden flex shadow-xs">
            <div className="bg-emerald-500 h-full w-[25%]" />
            <div className="bg-rose-400 h-full w-[75%]" />
          </div>
          <div className="flex justify-between text-[9px] font-bold text-slate-700 dark:text-slate-300">
            <span>High Quality</span>
            <span>Ultra Compressed</span>
          </div>
        </div>
      </div>
    );
  }

  // 5. Background Remover
  if (toolId === 'background-remover') {
    return (
      <div className="h-28 w-full bg-[#f3e8ff] dark:bg-purple-950/40 rounded-2xl p-3 flex items-center justify-center gap-3 relative overflow-hidden border-2 border-slate-900 dark:border-slate-700">
        <div className="w-18 h-18 rounded-xl bg-violet-400 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center relative overflow-hidden">
          <div className="w-7 h-7 rounded-full bg-yellow-300 border-2 border-slate-900" />
          <span className="absolute bottom-1 text-[7px] font-black bg-white text-slate-900 px-1 rounded">Photo</span>
        </div>
        <div className="w-6 h-6 rounded-full bg-yellow-300 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] flex items-center justify-center text-slate-900 font-bold z-10">
          ➔
        </div>
        <div className="w-18 h-18 rounded-xl bg-[linear-gradient(45deg,#cbd5e1_25%,transparent_25%),linear-gradient(-45deg,#cbd5e1_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#cbd5e1_75%),linear-gradient(-45deg,transparent_75%,#cbd5e1_75%)] bg-[size:8px_8px] border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center relative">
          <div className="w-7 h-7 rounded-full bg-yellow-300 border-2 border-slate-900" />
          <span className="absolute bottom-1 text-[7px] font-black bg-emerald-400 text-slate-900 px-1 rounded">Cutout</span>
        </div>
      </div>
    );
  }

  // 6. Sign PDF
  if (toolId === 'sign-pdf') {
    return (
      <div className="h-28 w-full bg-[#fefce8] dark:bg-amber-950/40 rounded-2xl p-3 flex items-center justify-center relative overflow-hidden border-2 border-slate-900 dark:border-slate-700 bg-paper-dots">
        <div className="w-40 h-20 bg-white dark:bg-slate-950 border-2 border-slate-900 rounded-xl p-2 flex flex-col justify-between shadow-[3px_3px_0px_0px_#0f172a]">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-black bg-purple-500 text-white px-1.5 py-0.2 rounded">CONTRACT</span>
            <Award className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="border-b-2 border-dashed border-purple-400 pb-0.5 flex items-center justify-between">
            <span className="font-serif italic font-black text-xs text-purple-700 dark:text-purple-300 tracking-wider">
              Khushal Jangid ✍️
            </span>
            <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold">✓</div>
          </div>
        </div>
      </div>
    );
  }

  // 7. QR & Barcode
  if (toolId === 'qr-generator' || toolId === 'barcode-generator') {
    return (
      <div className="h-28 w-full bg-[#ede9fe] dark:bg-purple-950/40 rounded-2xl p-3 flex items-center justify-center relative overflow-hidden border-2 border-slate-900 dark:border-slate-700 bg-paper-grid">
        <div className="w-18 h-18 bg-white dark:bg-slate-950 border-2 border-slate-900 rounded-xl p-1.5 flex flex-col items-center justify-center shadow-[3px_3px_0px_0px_#0f172a]">
          {toolId === 'qr-generator' ? (
            <QrCode className="h-10 w-10 text-slate-900 dark:text-white" />
          ) : (
            <div className="flex items-center gap-0.5 h-8">
              <div className="w-1.5 h-full bg-black dark:bg-white" />
              <div className="w-0.5 h-full bg-black dark:bg-white" />
              <div className="w-2 h-full bg-black dark:bg-white" />
              <div className="w-0.5 h-full bg-black dark:bg-white" />
              <div className="w-1 h-full bg-black dark:bg-white" />
              <div className="w-2.5 h-full bg-black dark:bg-white" />
            </div>
          )}
          <span className="text-[7px] font-mono font-black bg-yellow-300 text-slate-900 px-1 rounded mt-1 border border-slate-900">
            SCANNABLE
          </span>
        </div>
      </div>
    );
  }

  // 8. Currency Converter
  if (toolId === 'currency-converter') {
    return (
      <div className="h-28 w-full bg-[#dcfce7] dark:bg-emerald-950/40 rounded-2xl p-3 flex items-center justify-center gap-2 relative overflow-hidden border-2 border-slate-900 dark:border-slate-700 bg-paper-dots">
        <div className="px-3 py-2 bg-yellow-300 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#0f172a] text-center">
          <span className="text-[8px] font-black text-slate-700 block">USD</span>
          <span className="text-xs font-black text-slate-900">$100</span>
        </div>
        <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] flex items-center justify-center text-slate-900 dark:text-white font-bold">
          ⇄
        </div>
        <div className="px-3 py-2 bg-emerald-400 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#0f172a] text-center">
          <span className="text-[8px] font-black text-slate-700 block">INR</span>
          <span className="text-xs font-black text-slate-900">₹8,650</span>
        </div>
      </div>
    );
  }

  // 9. Split / Remove PDF Pages
  if (toolId === 'pdf-splitter' || toolId === 'remove-pdf-pages' || toolId === 'crop-pdf') {
    return (
      <div className="h-28 w-full bg-[#fef3c7] dark:bg-amber-950/40 rounded-2xl p-3 flex items-center justify-center gap-2 relative overflow-hidden border-2 border-slate-900 dark:border-slate-700 bg-paper-grid">
        <div className="w-14 h-18 bg-rose-500 border-2 border-slate-900 rounded-lg p-1 text-white shadow-[2px_2px_0px_0px_#0f172a] flex flex-col justify-between">
          <span className="text-[7px] font-black bg-white text-rose-600 px-1 rounded self-start">PG 1</span>
          <div className="h-1 bg-white/80 rounded w-full" />
        </div>
        <div className="flex flex-col items-center">
          <Scissors className="h-5 w-5 text-slate-900 dark:text-yellow-300 animate-bounce" />
          <span className="text-[8px] font-mono font-bold text-slate-500">---</span>
        </div>
        <div className="w-14 h-18 bg-emerald-500 border-2 border-slate-900 rounded-lg p-1 text-white shadow-[2px_2px_0px_0px_#0f172a] flex flex-col justify-between">
          <span className="text-[7px] font-black bg-white text-emerald-700 px-1 rounded self-start">PG 2</span>
          <div className="h-1 bg-white/80 rounded w-full" />
        </div>
      </div>
    );
  }

  // 10. PDF Suite General Fallback
  if (category === 'pdf') {
    return (
      <div className="h-28 w-full bg-[#ffe4e6] dark:bg-rose-950/40 rounded-2xl p-3 flex items-center justify-center relative overflow-hidden border-2 border-slate-900 dark:border-slate-700 bg-paper-dots">
        <div className="w-18 h-20 bg-rose-500 text-white rounded-xl p-2 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-black bg-white text-rose-600 px-1 rounded">PDF</span>
            <FileText className="h-3 w-3 text-white" />
          </div>
          <div className="space-y-1">
            <div className="h-1 bg-white/80 rounded w-full" />
            <div className="h-1 bg-white/80 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  // 11. Image Suite General Fallback
  if (category === 'image') {
    return (
      <div className="h-28 w-full bg-[#e0f2fe] dark:bg-sky-950/40 rounded-2xl p-3 flex items-center justify-center relative overflow-hidden border-2 border-slate-900 dark:border-slate-700 bg-paper-grid">
        <div className="w-20 h-18 bg-sky-400 text-slate-900 rounded-xl p-2 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center justify-center">
          <Image className="h-8 w-8 text-slate-900" />
        </div>
      </div>
    );
  }

  // 12. Dev Suite General Fallback
  if (category === 'dev') {
    return (
      <div className="h-28 w-full bg-slate-950 rounded-2xl p-2.5 flex flex-col justify-between font-mono text-[9px] text-slate-300 relative overflow-hidden border-2 border-slate-800 shadow-[3px_3px_0px_0px_#0f172a]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span className="text-[8px] bg-emerald-400 text-slate-950 font-black px-1 rounded">CODE ✓</span>
        </div>
        <div className="space-y-0.5 text-[9px] text-cyan-300">
          <span>&lt;ToolBox /&gt;</span>
          <span className="text-yellow-300 block">{`{ "fast": true }`}</span>
        </div>
      </div>
    );
  }

  // 13. Calculator & Converters Fallback
  if (category === 'calculator' || category === 'converter') {
    return (
      <div className="h-28 w-full bg-[#fef9c3] dark:bg-amber-950/40 rounded-2xl p-3 flex items-center justify-center relative overflow-hidden border-2 border-slate-900 dark:border-slate-700 bg-paper-dots">
        <div className="w-18 h-18 bg-yellow-400 text-slate-900 rounded-xl p-2 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex flex-col items-center justify-center">
          <Calculator className="h-7 w-7 text-slate-900" />
          <span className="text-[8px] font-black uppercase mt-1">100% Math</span>
        </div>
      </div>
    );
  }

  // Default Fallback
  return (
    <div className="h-28 w-full bg-[#f3e8ff] dark:bg-purple-950/40 rounded-2xl p-3 flex items-center justify-center relative overflow-hidden border-2 border-slate-900 dark:border-slate-700 bg-paper-dots">
      <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center">
        <Sparkles className="h-6 w-6 text-yellow-300" />
      </div>
    </div>
  );
}
