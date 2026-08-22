import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, CheckCircle2, XCircle, Users, Clock, Sparkles, RefreshCw, Key } from 'lucide-react';

export default function AdminDashboard({ onNavigate }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('toolbox_admin_logged') === 'true';
  });

  const [adminEmail, setAdminEmail] = useState('admin@khushal.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [usersList, setUsersList] = useState([]);
  const [demoProActive, setDemoProActive] = useState(() => {
    return localStorage.getItem('toolbox_demo_pro') === 'true';
  });

  const loadUsers = () => {
    try {
      const users = JSON.parse(localStorage.getItem('toolbox_users')) || [];
      setUsersList(users);
    } catch {
      setUsersList([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    if (
      (adminEmail.toLowerCase() === 'admin@khushal.com' || adminEmail.toLowerCase() === 'khushal@toolbox.com') &&
      adminPassword === 'Khushal@2026'
    ) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('toolbox_admin_logged', 'true');
    } else {
      setLoginError('Invalid Admin credentials. Default Email: admin@khushal.com | Password: Khushal@2026');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('toolbox_admin_logged');
  };

  const approveUser = (userEmail) => {
    try {
      const updatedUsers = usersList.map(u => {
        if (u.email.toLowerCase() === userEmail.toLowerCase()) {
          return { ...u, status: 'APPROVED' };
        }
        return u;
      });

      localStorage.setItem('toolbox_users', JSON.stringify(updatedUsers));
      
      // Update logged in user if matching
      const curr = JSON.parse(localStorage.getItem('toolbox_current_user'));
      if (curr && curr.email.toLowerCase() === userEmail.toLowerCase()) {
        curr.status = 'APPROVED';
        localStorage.setItem('toolbox_current_user', JSON.stringify(curr));
      }

      setUsersList(updatedUsers);
      alert(`Subscription APPROVED for ${userEmail}! Pro suite is now unlocked for this user.`);
    } catch (err) {
      alert('Error approving user.');
    }
  };

  const rejectUser = (userEmail) => {
    try {
      const updatedUsers = usersList.map(u => {
        if (u.email.toLowerCase() === userEmail.toLowerCase()) {
          return { ...u, status: 'REJECTED' };
        }
        return u;
      });

      localStorage.setItem('toolbox_users', JSON.stringify(updatedUsers));
      setUsersList(updatedUsers);
    } catch (err) {
      alert('Error rejecting user.');
    }
  };

  const toggleDemoPro = () => {
    const nextState = !demoProActive;
    setDemoProActive(nextState);
    localStorage.setItem('toolbox_demo_pro', nextState ? 'true' : 'false');
    window.location.reload();
  };

  const pendingUsers = usersList.filter(u => u.status === 'PENDING');
  const approvedUsers = usersList.filter(u => u.status === 'APPROVED');

  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-center">
          <div className="w-14 h-14 bg-[#3525cd] text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Admin Portal Login</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Verify & Approve Pro Subscription Requests</p>
          </div>

          {/* Admin Default Credentials Notice */}
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-left space-y-1">
            <div className="font-bold text-[#3525cd] dark:text-[#c3c0ff] flex items-center gap-1">
              <Key className="h-3.5 w-3.5" /> Admin Credentials:
            </div>
            <div className="font-mono text-slate-700 dark:text-slate-300">
              Email: <strong>admin@khushal.com</strong>
            </div>
            <div className="font-mono text-slate-700 dark:text-slate-300">
              Password: <strong>Khushal@2026</strong>
            </div>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Admin Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#3525cd]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Admin Password</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter Khushal@2026"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#3525cd]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#3525cd] hover:bg-indigo-600 text-white font-black text-xs shadow-md transition"
            >
              Sign In to Admin Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10 space-y-8">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-[#3525cd]" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Admin Verification Dashboard</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Logged in as <strong className="text-slate-900 dark:text-white">{adminEmail}</strong> (Owner: Khushal Jangid)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDemoPro}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
              demoProActive
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            {demoProActive ? 'Demo Pro: ACTIVE' : 'Enable Demo Pro Mode'}
          </button>

          <button
            onClick={handleAdminLogout}
            className="px-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-1 shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="h-4 w-4 text-indigo-500" /> Total Registered Users
          </span>
          <div className="text-3xl font-mono font-black text-slate-900 dark:text-white">{usersList.length}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-1 shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-amber-500" /> Pending Payment Proofs
          </span>
          <div className="text-3xl font-mono font-black text-amber-600 dark:text-amber-400">{pendingUsers.length}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-1 shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-emerald-500" /> Active Pro Members
          </span>
          <div className="text-3xl font-mono font-black text-emerald-600 dark:text-emerald-400">{approvedUsers.length}</div>
        </div>
      </div>

      {/* Pending Approval Requests Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" /> Pending Subscription Payments
          </h3>
          <button
            onClick={loadUsers}
            className="flex items-center gap-1 text-xs font-bold text-[#3525cd] hover:underline"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh List
          </button>
        </div>

        {pendingUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">UTR / Transaction ID</th>
                  <th className="py-3 px-4">Date Submitted</th>
                  <th className="py-3 px-4 text-center">Admin Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {pendingUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">{user.name}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono">{user.email}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono">{user.phone || 'N/A'}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                      {user.transactionId || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{user.dateSubmitted || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => approveUser(user.email)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approve Pro
                        </button>
                        <button
                          onClick={() => rejectUser(user.email)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl text-slate-500 text-xs">
            No pending payment verification requests at the moment.
          </div>
        )}
      </div>

      {/* Approved Users Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden space-y-4 p-6">
        <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Approved Pro Members ({approvedUsers.length})
        </h3>

        {approvedUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">UTR / Transaction ID</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {approvedUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">{user.name}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono">{user.email}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{user.transactionId || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                        PRO APPROVED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 text-center text-slate-400 text-xs">No approved members yet.</div>
        )}
      </div>
    </div>
  );
}
