import React, { useState } from 'react';
import { ArrowLeftRight, Copy, Check } from 'lucide-react';

export default function UnitConverterTool() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [inputValue, setInputValue] = useState(1);
  const [copied, setCopied] = useState(false);

  const unitsData = {
    length: {
      title: 'Length & Distance',
      base: 'm',
      units: {
        m: { label: 'Meter (m)', factor: 1 },
        km: { label: 'Kilometer (km)', factor: 1000 },
        cm: { label: 'Centimeter (cm)', factor: 0.01 },
        mm: { label: 'Millimeter (mm)', factor: 0.001 },
        in: { label: 'Inch (in)', factor: 0.0254 },
        ft: { label: 'Feet (ft)', factor: 0.3048 },
        yd: { label: 'Yard (yd)', factor: 0.9144 },
        mi: { label: 'Mile (mi)', factor: 1609.344 }
      }
    },
    weight: {
      title: 'Mass & Weight',
      base: 'kg',
      units: {
        kg: { label: 'Kilogram (kg)', factor: 1 },
        g: { label: 'Gram (g)', factor: 0.001 },
        mg: { label: 'Milligram (mg)', factor: 0.000001 },
        lb: { label: 'Pound (lbs)', factor: 0.45359237 },
        oz: { label: 'Ounce (oz)', factor: 0.0283495231 },
        ton: { label: 'Metric Ton (t)', factor: 1000 }
      }
    },
    temperature: {
      title: 'Temperature',
      isTemp: true,
      units: {
        C: { label: 'Celsius (°C)' },
        F: { label: 'Fahrenheit (°F)' },
        K: { label: 'Kelvin (K)' }
      }
    },
    storage: {
      title: 'Digital Data Storage',
      base: 'B',
      units: {
        B: { label: 'Byte (B)', factor: 1 },
        KB: { label: 'Kilobyte (KB)', factor: 1024 },
        MB: { label: 'Megabyte (MB)', factor: 1048576 },
        GB: { label: 'Gigabyte (GB)', factor: 1073741824 },
        TB: { label: 'Terabyte (TB)', factor: 1099511627776 }
      }
    },
    speed: {
      title: 'Speed & Velocity',
      base: 'mps',
      units: {
        mps: { label: 'Meters / second (m/s)', factor: 1 },
        kmh: { label: 'Kilometers / hour (km/h)', factor: 0.277778 },
        mph: { label: 'Miles / hour (mph)', factor: 0.44704 },
        knot: { label: 'Knot (kn)', factor: 0.514444 }
      }
    }
  };

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    const available = Object.keys(unitsData[newCat].units);
    setFromUnit(available[0]);
    setToUnit(available[1] || available[0]);
  };

  const calculateResult = () => {
    const val = Number(inputValue);
    if (isNaN(val)) return 0;

    if (category === 'temperature') {
      if (fromUnit === toUnit) return val;
      let celsius = val;
      if (fromUnit === 'F') celsius = (val - 32) * (5 / 9);
      if (fromUnit === 'K') celsius = val - 273.15;

      if (toUnit === 'C') return celsius;
      if (toUnit === 'F') return celsius * (9 / 5) + 32;
      if (toUnit === 'K') return celsius + 273.15;
    } else {
      const catData = unitsData[category];
      const fromFactor = catData.units[fromUnit].factor;
      const toFactor = catData.units[toUnit].factor;
      const baseVal = val * fromFactor;
      return baseVal / toFactor;
    }
    return 0;
  };

  const result = calculateResult();

  const handleCopy = () => {
    navigator.clipboard.writeText(`${result}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        {Object.keys(unitsData).map((key) => (
          <button
            key={key}
            onClick={() => handleCategoryChange(key)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition ${
              category === key ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Converter Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* From Input */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">From Unit</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-4 py-3 text-lg font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
            >
              {Object.entries(unitsData[category].units).map(([uKey, uVal]) => (
                <option key={uKey} value={uKey}>{uVal.label}</option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pt-4 md:pt-0">
            <button
              onClick={swapUnits}
              className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 transition shadow-sm"
              title="Swap units"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
          </div>

          {/* To Output */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">To Result</label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                className="w-full px-4 py-3 text-lg font-mono font-bold bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-blue-600 dark:text-blue-400 focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="absolute right-2 top-2 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                title="Copy Value"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
            >
              {Object.entries(unitsData[category].units).map(([uKey, uVal]) => (
                <option key={uKey} value={uKey}>{uVal.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
