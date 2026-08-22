import { downloadFile } from "../../utils/fileDownloader";
import React, { useState } from 'react';
import { ShoppingBag, CheckCircle, Scale, Tag } from 'lucide-react';

export default function UnitPriceTool() {
  const [itemA, setItemA] = useState({ name: 'Option A (Standard Pack)', quantity: 500, price: 120 });
  const [itemB, setItemB] = useState({ name: 'Option B (Large Pack)', quantity: 750, price: 165 });
  const [unit, setUnit] = useState('grams');

  const qA = parseFloat(itemA.quantity) || 1;
  const pA = parseFloat(itemA.price) || 0;
  const unitPriceA = (pA / qA).toFixed(4);

  const qB = parseFloat(itemB.quantity) || 1;
  const pB = parseFloat(itemB.price) || 0;
  const unitPriceB = (pB / qB).toFixed(4);

  const isABetter = parseFloat(unitPriceA) < parseFloat(unitPriceB);
  const isBBetter = parseFloat(unitPriceB) < parseFloat(unitPriceA);

  const savingsPercent = isABetter
    ? (((parseFloat(unitPriceB) - parseFloat(unitPriceA)) / parseFloat(unitPriceB)) * 100).toFixed(1)
    : isBBetter
    ? (((parseFloat(unitPriceA) - parseFloat(unitPriceB)) / parseFloat(unitPriceA)) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6 max-w-xl mx-auto text-left">
      {/* Unit Type Selection */}
      <div className="flex justify-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
        {['grams', 'ml', 'kg', 'pcs', 'liters'].map((u) => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition ${
              unit === u
                ? 'bg-[#3525cd] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {u}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Item A */}
        <div className={`p-4 rounded-2xl border transition ${isABetter ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-200 dark:border-slate-800'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-xs text-slate-900 dark:text-slate-100">Option A</span>
            {isABetter && (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                Best Deal
              </span>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-500">Quantity ({unit})</label>
              <input
                type="number"
                value={itemA.quantity}
                onChange={(e) => setItemA({ ...itemA, quantity: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500">Price ($)</label>
              <input
                type="number"
                value={itemA.price}
                onChange={(e) => setItemA({ ...itemA, price: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Unit Price</span>
              <div className="text-base font-mono font-black text-slate-900 dark:text-slate-100">
                ${unitPriceA} / {unit}
              </div>
            </div>
          </div>
        </div>

        {/* Item B */}
        <div className={`p-4 rounded-2xl border transition ${isBBetter ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-200 dark:border-slate-800'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-xs text-slate-900 dark:text-slate-100">Option B</span>
            {isBBetter && (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                Best Deal
              </span>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-500">Quantity ({unit})</label>
              <input
                type="number"
                value={itemB.quantity}
                onChange={(e) => setItemB({ ...itemB, quantity: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500">Price ($)</label>
              <input
                type="number"
                value={itemB.price}
                onChange={(e) => setItemB({ ...itemB, price: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Unit Price</span>
              <div className="text-base font-mono font-black text-slate-900 dark:text-slate-100">
                ${unitPriceB} / {unit}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Verdict */}
      <div className="p-4 rounded-2xl bg-[#3525cd]/10 border border-[#3525cd]/20 text-center space-y-1">
        <span className="text-xs font-black uppercase tracking-wider text-[#3525cd] dark:text-[#c3c0ff]">
          {isABetter ? 'Option A is Cheaper!' : isBBetter ? 'Option B is Cheaper!' : 'Both Options Cost Exactly the Same!'}
        </span>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          You save approximately <strong>{savingsPercent}%</strong> per unit with the winning choice!
        </p>
      </div>
    </div>
  );
}
