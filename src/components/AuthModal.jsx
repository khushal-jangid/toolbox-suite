import React, { useState } from 'react';
import { X, Lock, User, Mail, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    // Admin Direct Auto-Redirect Check
    if (
      (cleanEmail === 'admin@khushal.com' || cleanEmail === 'khushal@toolbox.com') &&
      cleanPassword === 'Khushal@2026'
    ) {
      localStorage.setItem('toolbox_admin_logged', 'true');
      const adminUser = {
        id: 'admin_khushal',
        name: 'Khushal Jangid (Admin)',
        email: 'admin@khushal.com',
        status: 'APPROVED',
        isAdmin: true
      };
      localStorage.setItem('toolbox_current_user', JSON.stringify(adminUser));
      onLoginSuccess(adminUser);
      onClose();
      window.location.hash = '/admin';
      return;
    }

    try {
      const existingUsers = JSON.parse(localStorage.getItem('toolbox_users')) || [];

      if (isRegister) {
        if (existingUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
          setError('An account with this email already exists. Please login instead.');
          return;
        }

        const newUser = {
          id: Date.now().toString(),
          name: name.trim() || cleanEmail.split('@')[0],
          email: cleanEmail,
          password: cleanPassword,
          status: 'FREE',
          transactionId: '',
          dateRegistered: new Date().toLocaleDateString()
        };

        existingUsers.push(newUser);
        localStorage.setItem('toolbox_users', JSON.stringify(existingUsers));
        localStorage.setItem('toolbox_current_user', JSON.stringify(newUser));

        onLoginSuccess(newUser);
        onClose();
      } else {
        const found = existingUsers.find(u => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword);
        
        if (!found) {
          setError('Invalid email or password. If you do not have an account, please Sign Up.');
          return;
        }

        localStorage.setItem('toolbox_current_user', JSON.stringify(found));
        onLoginSuccess(found);
        onClose();
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative p-6 sm:p-8 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3525cd] text-white shadow-lg shadow-indigo-500/20 mx-auto">
            <User className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {isRegister ? 'Create Account' : 'User & Admin Sign In'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isRegister ? 'Register to submit Pro payment & track approval' : 'Sign in for User Profile or Admin Panel access'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Your Full Name</label>
              <div className="relative flex items-center">
                <User className="h-4 w-4 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Khushal Jangid"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#3525cd]"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="h-4 w-4 text-slate-400 absolute left-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com or admin@khushal.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#3525cd]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative flex items-center">
              <Lock className="h-4 w-4 text-slate-400 absolute left-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#3525cd]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#3525cd] hover:bg-indigo-600 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <span>{isRegister ? 'Register Account' : 'Sign In Now'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            {isRegister ? 'Already have an account? Sign In' : 'Need an account? Create one now'}
          </button>
        </div>
      </div>
    </div>
  );
}
