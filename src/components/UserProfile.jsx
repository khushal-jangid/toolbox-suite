import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Save, Sparkles, CheckCircle2, Clock, ShieldCheck, ArrowLeft, Star, LogOut, Briefcase } from 'lucide-react';

export default function UserProfile({ currentUser, onUpdateUser, onLogout, onNavigate, onOpenProModal }) {
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [bio, setBio] = useState(currentUser?.bio || 'Web Developer & ToolBox User');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState({ type: '', text: '' });

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-4">
          <div className="w-12 h-12 bg-[#3525cd] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <User className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Profile Access Required</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Please Sign In to view and edit your profile settings.</p>
          <button
            onClick={() => onNavigate('home')}
            className="w-full py-2.5 rounded-xl bg-[#3525cd] text-white font-bold text-xs shadow-md hover:bg-indigo-600 transition"
          >
            Back to Home & Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleProfileSave = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const existingUsers = JSON.parse(localStorage.getItem('toolbox_users')) || [];
      
      const updatedUser = {
        ...currentUser,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        bio: bio.trim()
      };

      const updatedUsersList = existingUsers.map(u => {
        if (u.id === currentUser.id || u.email.toLowerCase() === currentUser.email.toLowerCase()) {
          return updatedUser;
        }
        return u;
      });

      localStorage.setItem('toolbox_users', JSON.stringify(updatedUsersList));
      localStorage.setItem('toolbox_current_user', JSON.stringify(updatedUser));

      onUpdateUser(updatedUser);
      setMessage({ type: 'success', text: 'Profile details updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (currentPassword !== currentUser.password) {
      setMessage({ type: 'error', text: 'Current password is incorrect.' });
      return;
    }

    if (newPassword.length < 4) {
      setMessage({ type: 'error', text: 'New password must be at least 4 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    try {
      const existingUsers = JSON.parse(localStorage.getItem('toolbox_users')) || [];
      
      const updatedUser = {
        ...currentUser,
        password: newPassword
      };

      const updatedUsersList = existingUsers.map(u => {
        if (u.id === currentUser.id || u.email.toLowerCase() === currentUser.email.toLowerCase()) {
          return updatedUser;
        }
        return u;
      });

      localStorage.setItem('toolbox_users', JSON.stringify(updatedUsersList));
      localStorage.setItem('toolbox_current_user', JSON.stringify(updatedUser));

      onUpdateUser(updatedUser);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to change password.' });
    }
  };

  const userStatus = currentUser.status || 'FREE';

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-8 py-10 space-y-8 text-left">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3525cd] to-indigo-600 text-white flex items-center justify-center text-xl font-black shadow-md shadow-indigo-500/20">
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">{currentUser.name}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{currentUser.email}</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Home
        </button>
      </div>

      {/* Subscription Card */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subscription Plan</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                userStatus === 'APPROVED'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : userStatus === 'PENDING'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {userStatus === 'APPROVED' ? 'PRO SUITE ACTIVE' : userStatus === 'PENDING' ? 'PENDING ADMIN APPROVAL' : 'FREE PLAN'}
              </span>
            </div>
          </div>

          {userStatus !== 'APPROVED' && (
            <button
              onClick={onOpenProModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 text-white font-bold text-xs shadow-md hover:opacity-95 transition flex items-center gap-1.5"
            >
              <Sparkles className="h-4 w-4" /> {userStatus === 'PENDING' ? 'View Payment UTR Status' : 'Upgrade to Pro Suite (₹199)'}
            </button>
          )}
        </div>

        {currentUser.transactionId && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-xs font-mono space-y-1">
            <span className="text-slate-400 font-bold">Submitted UTR / Transaction ID:</span>
            <div className="text-amber-600 dark:text-amber-400 font-bold">{currentUser.transactionId}</div>
          </div>
        )}
      </div>

      {/* Success / Error Message Banner */}
      {message.text && (
        <div className={`p-4 rounded-2xl text-xs font-bold text-center ${
          message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Editable Profile Form */}
      <form onSubmit={handleProfileSave} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <User className="h-5 w-5 text-[#3525cd]" /> Edit Profile Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
            <div className="relative flex items-center">
              <User className="h-4 w-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#3525cd]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="h-4 w-4 text-slate-400 absolute left-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#3525cd]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mobile / WhatsApp Number</label>
            <div className="relative flex items-center">
              <Phone className="h-4 w-4 text-slate-400 absolute left-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#3525cd]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Occupation / Bio</label>
            <div className="relative flex items-center">
              <Briefcase className="h-4 w-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Senior Web Developer"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#3525cd]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-[#3525cd] hover:bg-indigo-600 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
        >
          <Save className="h-4 w-4" /> Save Profile Changes
        </button>
      </form>

      {/* Change Password Form */}
      <form onSubmit={handlePasswordChange} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="h-5 w-5 text-indigo-500" /> Change Security Password
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#3525cd]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#3525cd]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#3525cd]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-md transition flex items-center gap-2"
        >
          <Lock className="h-4 w-4" /> Update Password
        </button>
      </form>

      {/* Logout Action */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold text-xs hover:bg-rose-500/20 transition"
        >
          <LogOut className="h-4 w-4" /> Sign Out of Account
        </button>
      </div>
    </div>
  );
}
