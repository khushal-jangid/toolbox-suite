import { downloadFile } from "../../utils/fileDownloader";
import React, { useState } from 'react';
import { DollarSign, TrendingUp, Percent, ArrowUpRight } from 'lucide-react';

export default function ProfitMarginTool() {
  const [costPrice, setCostPrice] = useState(100);
  const [sellingPrice, setSellingPrice] = useState(150);

  const cp = parseFloat(costPrice) || 0;
  const sp = parseFloat(sellingPrice) || 0;

  const grossProfit = sp - cp;
  const marginPercent = sp > 0 ? ((grossProfit / sp) * 100).toFixed(2) : '0.00';
  const markupPercent = cp > 0 ? ((grossProfit / cp) * 100).toFixed(2) : '0.00';

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Cost Price */}
        <div className="space-y-2 text-left">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Cost Price (CP)</label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-slate-400 font-bold">$</span>
            <input
              type="number"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#3525cd]"
            />
          </div>
        </div>

        {/* Selling Price */}
        <div className="space-y-2 text-left">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Selling Price (SP)</label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-slate-400 font-bold">$</span>
            <input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#3525cd]"
            />
          </div>
        </div>
      </div>

      {/* Results Display */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Gross Profit
          </span>
          <div className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ${grossProfit.toFixed(2)}
          </div>
        </div>

        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3525cd] dark:text-[#c3c0ff]">
            Profit Margin %
          </span>
          <div className="text-2xl font-mono font-black text-[#3525cd] dark:text-[#c3c0ff] mt-1">
            {marginPercent}%
          </div>
        </div>

        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-400">
            Markup %
          </span>
          <div className="text-2xl font-mono font-black text-purple-600 dark:text-purple-400 mt-1">
            {markupPercent}%
          </div>
        </div>
      </div>
    </div>
  );
}
