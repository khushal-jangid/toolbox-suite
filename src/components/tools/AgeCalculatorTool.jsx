import { downloadFile } from "../../utils/fileDownloader";
import React, { useState, useEffect } from 'react';
import { Calendar, Cake, Clock, Sparkles, Heart, Compass, Star } from 'lucide-react';

const ZODIAC_SIGNS = [
  { name: 'Capricorn', symbol: '♑', element: 'Earth', start: [12, 22], end: [1, 19] },
  { name: 'Aquarius', symbol: '♒', element: 'Air', start: [1, 20], end: [2, 18] },
  { name: 'Pisces', symbol: '♓', element: 'Water', start: [2, 19], end: [3, 20] },
  { name: 'Aries', symbol: '♈', element: 'Fire', start: [3, 21], end: [4, 19] },
  { name: 'Taurus', symbol: '♉', element: 'Earth', start: [4, 20], end: [5, 20] },
  { name: 'Gemini', symbol: '♊', element: 'Air', start: [5, 21], end: [6, 20] },
  { name: 'Cancer', symbol: '♋', element: 'Water', start: [6, 21], end: [7, 22] },
  { name: 'Leo', symbol: '♌', element: 'Fire', start: [7, 23], end: [8, 22] },
  { name: 'Virgo', symbol: '♍', element: 'Earth', start: [8, 23], end: [9, 22] },
  { name: 'Libra', symbol: '♎', element: 'Air', start: [9, 23], end: [10, 22] },
  { name: 'Scorpio', symbol: '♏', element: 'Water', start: [10, 23], end: [11, 21] },
  { name: 'Sagittarius', symbol: '♐', element: 'Fire', start: [11, 22], end: [12, 21] }
];

const CHINESE_ZODIAC = ['Rat 🐀', 'Ox 🐂', 'Tiger 🐅', 'Rabbit 🐇', 'Dragon 🐉', 'Snake 🐍', 'Horse 🐎', 'Goat 🐐', 'Monkey 🐒', 'Rooster 🐓', 'Dog 🐕', 'Pig 🐖'];

export default function AgeCalculatorTool() {
  const [dob, setDob] = useState('2000-01-01');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const birth = new Date(dob);
  const target = new Date(targetDate);

  // Age calculations
  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonthDays = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  // Total times lived
  const diffMs = Math.max(0, target.getTime() - birth.getTime());
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalSeconds = Math.floor(diffMs / 1000);

  // Heartbeats approx (average 75 bpm)
  const approxHeartbeats = (totalMinutes * 75).toLocaleString();
  // Breaths approx (average 16 bpm)
  const approxBreaths = (totalMinutes * 16).toLocaleString();

  // Next Birthday countdown
  const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBday < now) {
    nextBday.setFullYear(now.getFullYear() + 1);
  }
  const diffBdayMs = nextBday.getTime() - now.getTime();
  const bdayDays = Math.floor(diffBdayMs / (1000 * 60 * 60 * 24));
  const bdayHours = Math.floor((diffBdayMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const bdayMins = Math.floor((diffBdayMs % (1000 * 60 * 60)) / (1000 * 60));
  const bdaySecs = Math.floor((diffBdayMs % (1000 * 60)) / 1000);

  // Western Zodiac sign
  const bMonth = birth.getMonth() + 1;
  const bDay = birth.getDate();
  const zodiac = ZODIAC_SIGNS.find(z => {
    const [sm, sd] = z.start;
    const [em, ed] = z.end;
    if (sm === 12 && bMonth === 12 && bDay >= sd) return true;
    if (sm === 12 && bMonth === 1 && bDay <= ed) return true;
    if (bMonth === sm && bDay >= sd) return true;
    if (bMonth === em && bDay <= ed) return true;
    return false;
  }) || ZODIAC_SIGNS[0];

  // Chinese Zodiac
  const chineseAnimal = CHINESE_ZODIAC[(birth.getFullYear() - 4) % 12] || CHINESE_ZODIAC[0];

  // Day of the week born
  const dayOfWeekBorn = birth.toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="space-y-6 text-left max-w-2xl mx-auto">
      {/* Date Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Cake className="h-3.5 w-3.5 text-rose-500" /> Date of Birth (DOB)
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-[#3525cd]" /> Age At Date
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
          />
        </div>
      </div>

      {/* Hero Age Result */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-3xl text-center space-y-3 shadow-sm">
        <span className="text-[11px] font-bold text-[#3525cd] uppercase tracking-wider">Your Exact Age</span>
        <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {years} <span className="text-lg sm:text-2xl font-bold text-slate-500 font-sans">years</span> {months} <span className="text-lg sm:text-2xl font-bold text-slate-500 font-sans">months</span> {days} <span className="text-lg sm:text-2xl font-bold text-slate-500 font-sans">days</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
          Born on a <strong>{dayOfWeekBorn}</strong> • Chinese Zodiac: <strong>{chineseAnimal}</strong>
        </p>
      </div>

      {/* Next Birthday Countdown Card */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
            <Cake className="h-4 w-4 text-rose-500" /> Next Birthday Countdown
          </span>
          <span className="text-xs font-bold text-rose-500">
            Turns {years + 1}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-3 bg-rose-500/10 rounded-xl">
            <div className="text-lg sm:text-2xl font-black text-rose-600">{bdayDays}</div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Days</span>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-xl">
            <div className="text-lg sm:text-2xl font-black text-rose-600">{bdayHours}</div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Hours</span>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-xl">
            <div className="text-lg sm:text-2xl font-black text-rose-600">{bdayMins}</div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Mins</span>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-xl">
            <div className="text-lg sm:text-2xl font-black text-rose-600">{bdaySecs}</div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Secs</span>
          </div>
        </div>
      </div>

      {/* Total Life Stats Breakdown */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-500 uppercase">Total Time Lived Breakdown</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Months</span>
            <div className="text-lg font-mono font-black text-slate-900 dark:text-white mt-0.5">{totalMonths.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Weeks</span>
            <div className="text-lg font-mono font-black text-slate-900 dark:text-white mt-0.5">{totalWeeks.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Days</span>
            <div className="text-lg font-mono font-black text-slate-900 dark:text-white mt-0.5">{totalDays.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Hours</span>
            <div className="text-lg font-mono font-black text-slate-900 dark:text-white mt-0.5">{totalHours.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Minutes</span>
            <div className="text-lg font-mono font-black text-slate-900 dark:text-white mt-0.5">{totalMinutes.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Seconds</span>
            <div className="text-lg font-mono font-black text-emerald-600 mt-0.5">{totalSeconds.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Astrology & Vital Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-amber-500" /> Astrology & Zodiac
          </span>
          <div className="flex items-center gap-3 pt-1">
            <div className="text-3xl">{zodiac.symbol}</div>
            <div>
              <div className="font-black text-slate-900 dark:text-white text-base">{zodiac.name}</div>
              <div className="text-xs text-slate-500 font-medium">Element: {zodiac.element}</div>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <Heart className="h-3.5 w-3.5 text-rose-500" /> Approximate Body Vitals
          </span>
          <div className="space-y-1 text-xs pt-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Heartbeats:</span>
              <strong className="text-slate-900 dark:text-white font-mono">~{approxHeartbeats}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Breaths:</span>
              <strong className="text-slate-900 dark:text-white font-mono">~{approxBreaths}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
