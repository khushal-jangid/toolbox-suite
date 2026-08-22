import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Coins, RefreshCw, TrendingUp, DollarSign } from 'lucide-react';

const POPULAR_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', flag: '🇸🇦' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' }
];

// Fallback rates relative to 1 USD
const FALLBACK_RATES = {
  USD: 1,
  INR: 86.85,
  EUR: 0.96,
  GBP: 0.81,
  JPY: 154.20,
  CAD: 1.42,
  AUD: 1.58,
  AED: 3.67,
  SAR: 3.75,
  SGD: 1.35,
  CHF: 0.90,
  CNY: 7.28,
  NZD: 1.76,
  BRL: 6.05,
  RUB: 98.50,
  KRW: 1435.0,
  TRY: 35.80,
  ZAR: 18.20
};

export default function CurrencyConverterTool() {
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [rates, setRates] = useState(FALLBACK_RATES);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await res.json();
      if (data && data.rates) {
        setRates(data.rates);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch {
      // Fallback
      setRates(FALLBACK_RATES);
      setLastUpdated('Using cached standard rates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Conversion formula: Amount * (Rate_TO / Rate_FROM)
  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;
  const convertedAmount = ((amount / fromRate) * toRate).toFixed(2);
  const singleUnitRate = ((1 / fromRate) * toRate).toFixed(4);

  const fromCurrObj = POPULAR_CURRENCIES.find(c => c.code === fromCurrency);
  const toCurrObj = POPULAR_CURRENCIES.find(c => c.code === toCurrency);

  return (
    <div className="space-y-6 text-left max-w-2xl mx-auto">
      {/* Main Converter Card */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Coins className="h-4 w-4 text-[#3525cd]" /> Real-Time Converter
          </span>
          <button
            onClick={fetchRates}
            disabled={isLoading}
            className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Rates
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Enter Amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                {fromCurrObj?.symbol || '$'}
              </span>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-bold font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] items-center gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">From</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
              >
                {POPULAR_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-center sm:pt-4">
              <button
                onClick={swapCurrencies}
                className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-[#3525cd] hover:text-white border border-slate-200 dark:border-slate-700 transition"
                title="Swap Currencies"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">To</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
              >
                {POPULAR_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Amount Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[10, 50, 100, 500, 1000, 5000].map(val => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  amount === val ? 'bg-[#3525cd] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                +{val}
              </button>
            ))}
          </div>
        </div>

        {/* Result Display Box */}
        <div className="p-6 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-2xl text-center space-y-2">
          <div className="text-xs font-bold text-slate-500">
            {amount} {fromCurrency} =
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-black text-slate-900 dark:text-white">
            {toCurrObj?.symbol} {parseFloat(convertedAmount).toLocaleString()} {toCurrency}
          </div>
          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold font-mono">
            1 {fromCurrency} = {singleUnitRate} {toCurrency}
          </div>
        </div>
      </div>

      {/* Popular Comparison Matrix */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-500 uppercase">Top Currency Comparisons (1 {fromCurrency})</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {POPULAR_CURRENCIES.filter(c => c.code !== fromCurrency).slice(0, 6).map(c => {
            const r = ((1 / fromRate) * (rates[c.code] || 1)).toFixed(2);
            return (
              <div key={c.code} className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{c.flag}</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{c.code}</span>
                </div>
                <span className="text-xs font-mono font-black text-slate-900 dark:text-white">
                  {c.symbol} {r}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
