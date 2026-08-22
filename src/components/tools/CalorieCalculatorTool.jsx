import React, { useState } from 'react';
import { Flame, HeartPulse, Activity, Scale } from 'lucide-react';

export default function CalorieCalculatorTool() {
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(70); // kg
  const [height, setHeight] = useState(175); // cm
  const [activity, setActivity] = useState(1.375); // Light activity

  const w = parseFloat(weight) || 0;
  const h = parseFloat(height) || 0;
  const a = parseFloat(age) || 0;

  // Mifflin-St Jeor Equation
  let bmr = 10 * w + 6.25 * h - 5 * a;
  bmr = gender === 'male' ? bmr + 5 : bmr - 161;

  const tdee = Math.round(bmr * parseFloat(activity));
  const weightLossTdee = Math.round(tdee - 500);
  const weightGainTdee = Math.round(tdee + 500);

  return (
    <div className="space-y-6 max-w-xl mx-auto text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Gender */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Gender</label>
          <div className="flex gap-2">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                gender === 'male'
                  ? 'bg-[#3525cd] text-white border-[#3525cd]'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              Male
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                gender === 'female'
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              Female
            </button>
          </div>
        </div>

        {/* Age */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Age (years)</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none"
          />
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none"
          />
        </div>

        {/* Height */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none"
          />
        </div>
      </div>

      {/* Activity Level */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Daily Activity Level</label>
        <select
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none"
        >
          <option value="1.2">Sedentary (Little or no exercise)</option>
          <option value="1.375">Lightly Active (Exercise 1-3 days/week)</option>
          <option value="1.55">Moderately Active (Exercise 3-5 days/week)</option>
          <option value="1.725">Very Active (Hard exercise 6-7 days/week)</option>
        </select>
      </div>

      {/* Results Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Weight Loss Target
          </span>
          <div className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {weightLossTdee} kcal
          </div>
        </div>

        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3525cd] dark:text-[#c3c0ff]">
            Maintain Weight (TDEE)
          </span>
          <div className="text-xl font-mono font-black text-[#3525cd] dark:text-[#c3c0ff] mt-1">
            {tdee} kcal
          </div>
        </div>

        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-400">
            Weight Gain Target
          </span>
          <div className="text-xl font-mono font-black text-purple-600 dark:text-purple-400 mt-1">
            {weightGainTdee} kcal
          </div>
        </div>
      </div>
    </div>
  );
}
