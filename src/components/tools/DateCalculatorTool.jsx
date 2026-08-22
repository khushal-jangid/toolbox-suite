import React, { useState } from 'react';
import { Calendar, Clock, Plus, Minus, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function DateCalculatorTool() {
  const [tab, setTab] = useState('diff'); // 'diff', 'addsub', 'info'

  // Tab 1: Diff state
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  // Tab 2: Add/Sub state
  const [baseDate, setBaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [operation, setOperation] = useState('add'); // 'add' or 'sub'
  const [addYears, setAddYears] = useState(0);
  const [addMonths, setAddMonths] = useState(1);
  const [addWeeks, setAddWeeks] = useState(0);
  const [addDays, setAddDays] = useState(15);

  // Tab 3: Info state
  const [infoDate, setInfoDate] = useState(new Date().toISOString().split('T')[0]);

  // DIFF CALCULATIONS
  const d1 = new Date(startDate);
  const d2 = new Date(endDate);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = (diffDays / 7).toFixed(1);
  const diffHours = (diffDays * 24).toLocaleString();
  const diffMinutes = (diffDays * 24 * 60).toLocaleString();

  // Calculate working days (Mon-Fri)
  let workingDays = 0;
  let cur = new Date(Math.min(d1.getTime(), d2.getTime()));
  const endLimit = new Date(Math.max(d1.getTime(), d2.getTime()));
  while (cur <= endLimit) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) workingDays++;
    cur.setDate(cur.getDate() + 1);
  }

  // Calculate Year, Month, Day breakdown
  const earlier = d1 < d2 ? d1 : d2;
  const later = d1 < d2 ? d2 : d1;
  let yDiff = later.getFullYear() - earlier.getFullYear();
  let mDiff = later.getMonth() - earlier.getMonth();
  let dayDiff = later.getDate() - earlier.getDate();

  if (dayDiff < 0) {
    mDiff--;
    const prevMonth = new Date(later.getFullYear(), later.getMonth(), 0);
    dayDiff += prevMonth.getDate();
  }
  if (mDiff < 0) {
    yDiff--;
    mDiff += 12;
  }

  // ADD/SUB RESULT CALCULATION
  const targetDateObj = new Date(baseDate);
  const factor = operation === 'add' ? 1 : -1;
  targetDateObj.setFullYear(targetDateObj.getFullYear() + factor * (parseInt(addYears) || 0));
  targetDateObj.setMonth(targetDateObj.getMonth() + factor * (parseInt(addMonths) || 0));
  const totalDaysToAdd = (parseInt(addWeeks) || 0) * 7 + (parseInt(addDays) || 0);
  targetDateObj.setDate(targetDateObj.getDate() + factor * totalDaysToAdd);
  const formattedTargetDate = targetDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // INFO DATE CALCULATION
  const targetInfo = new Date(infoDate);
  const dayName = targetInfo.toLocaleDateString('en-US', { weekday: 'long' });
  const startOfYear = new Date(targetInfo.getFullYear(), 0, 1);
  const dayOfYear = Math.ceil((targetInfo - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
  const isLeapYear = (targetInfo.getFullYear() % 4 === 0 && targetInfo.getFullYear() % 100 !== 0) || (targetInfo.getFullYear() % 400 === 0);

  return (
    <div className="space-y-6 text-left max-w-2xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
        <button
          onClick={() => setTab('diff')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            tab === 'diff' ? 'bg-[#3525cd] text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Date Difference
        </button>
        <button
          onClick={() => setTab('addsub')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            tab === 'addsub' ? 'bg-[#3525cd] text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Add / Subtract Date
        </button>
        <button
          onClick={() => setTab('info')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            tab === 'info' ? 'bg-[#3525cd] text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Date Details
        </button>
      </div>

      {/* TAB 1: DIFFERENCE */}
      {tab === 'diff' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-center space-y-2">
            <span className="text-[10px] font-bold text-[#3525cd] uppercase tracking-wider">Exact Duration</span>
            <div className="text-2xl sm:text-3xl font-black text-[#3525cd]">
              {yDiff > 0 && `${yDiff} Years, `}{mDiff} Months, {dayDiff} Days
            </div>
            <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
              Total {diffDays} calendar days ({workingDays} business / working days)
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Days</span>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{diffDays}</div>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Weeks</span>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{diffWeeks}</div>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Hours</span>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{diffHours}</div>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Work Days</span>
              <div className="text-base font-bold text-emerald-600 mt-0.5">{workingDays}</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ADD/SUBTRACT */}
      {tab === 'addsub' && (
        <div className="space-y-6">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Base Start Date</label>
                <input
                  type="date"
                  value={baseDate}
                  onChange={(e) => setBaseDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Operation</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOperation('add')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                      operation === 'add' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-slate-800'
                    }`}
                  >
                    + Add Time
                  </button>
                  <button
                    onClick={() => setOperation('sub')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                      operation === 'sub' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 dark:bg-slate-800'
                    }`}
                  >
                    - Subtract Time
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Years</label>
                <input
                  type="number"
                  min="0"
                  value={addYears}
                  onChange={(e) => setAddYears(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold mt-1"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Months</label>
                <input
                  type="number"
                  min="0"
                  value={addMonths}
                  onChange={(e) => setAddMonths(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold mt-1"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Weeks</label>
                <input
                  type="number"
                  min="0"
                  value={addWeeks}
                  onChange={(e) => setAddWeeks(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold mt-1"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Days</label>
                <input
                  type="number"
                  min="0"
                  value={addDays}
                  onChange={(e) => setAddDays(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold mt-1"
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Calculated Target Date</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-300">
              {formattedTargetDate}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DATE INFO */}
      {tab === 'info' && (
        <div className="space-y-6">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Choose Any Date</label>
            <input
              type="date"
              value={infoDate}
              onChange={(e) => setInfoDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-center">
              <span className="text-[10px] font-bold text-[#3525cd] uppercase">Day of the Week</span>
              <div className="text-xl font-black text-[#3525cd] mt-1">{dayName}</div>
            </div>

            <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
              <span className="text-[10px] font-bold text-emerald-600 uppercase">Day of the Year</span>
              <div className="text-xl font-black text-emerald-600 mt-1">Day #{dayOfYear}</div>
            </div>

            <div className="p-5 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-center">
              <span className="text-[10px] font-bold text-purple-600 uppercase">Leap Year Status</span>
              <div className="text-xl font-black text-purple-600 mt-1">{isLeapYear ? 'Yes (366 Days)' : 'No (365 Days)'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
