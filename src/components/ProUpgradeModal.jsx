import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Lock, ShieldCheck, Send, Clock, CheckCircle2, User, Copy, Zap, ArrowRight, Smartphone, RefreshCw, Layers } from 'lucide-react';
import QRCode from 'qrcode';

export default function ProUpgradeModal({ isOpen, onClose, toolName, currentUser, onRequireAuth, onStatusUpdate }) {
  const [transactionId, setTransactionId] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [selectedApp, setSelectedApp] = useState('gpay');

  const upiId = '7303354598@omni';
  const payeeName = 'Khushal Jangid';
  const amount = '199';
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=ToolBox%20Pro%20Lifetime`;

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', color: 'from-blue-600 to-emerald-500', icon: '🔵' },
    { id: 'phonepe', name: 'PhonePe', color: 'from-[#5f259f] to-purple-600', icon: '🟣' },
    { id: 'paytm', name: 'Paytm', color: 'from-[#00b9f1] to-blue-500', icon: '🔷' },
    { id: 'bhim', name: 'BHIM / Any UPI', color: 'from-orange-500 to-amber-600', icon: '🟠' }
  ];

  useEffect(() => {
    if (isOpen && currentUser) {
      const cleanSaved = (currentUser.transactionId || '').replace(/\D/g, '').slice(0, 12);
      setTransactionId(cleanSaved);
      setPhone(currentUser.phone || '');
    }

    if (isOpen) {
      QRCode.toDataURL(upiString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#090d16',
          light: '#ffffff'
        }
      })
        .then(url => setQrCodeUrl(url))
        .catch(() => setQrCodeUrl(''));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      onRequireAuth();
      return;
    }

    const cleanUtr = transactionId.replace(/\D/g, '').slice(0, 12);
    if (!cleanUtr || cleanUtr.length !== 12) {
      setError('Please enter a valid 12-digit numeric UPI UTR / Transaction Reference Number.');
      return;
    }

    try {
      const existingUsers = JSON.parse(localStorage.getItem('toolbox_users')) || [];
      const updatedUsers = existingUsers.map(u => {
        if (u.email.toLowerCase() === currentUser.email.toLowerCase()) {
          return {
            ...u,
            transactionId: cleanUtr,
            phone: phone.trim(),
            status: 'PENDING',
            dateSubmitted: new Date().toLocaleString()
          };
        }
        return u;
      });

      const updatedCurrentUser = {
        ...currentUser,
        transactionId: cleanUtr,
        phone: phone.trim(),
        status: 'PENDING',
        dateSubmitted: new Date().toLocaleString()
      };

      localStorage.setItem('toolbox_users', JSON.stringify(updatedUsers));
      localStorage.setItem('toolbox_current_user', JSON.stringify(updatedCurrentUser));

      setSubmitted(true);
      onStatusUpdate(updatedCurrentUser);
    } catch (err) {
      setError('Failed to submit payment proof.');
    }
  };

  const userStatus = currentUser?.status || 'FREE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#090d16] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition z-20"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-black uppercase tracking-wider mx-auto">
            <Sparkles className="h-3.5 w-3.5" /> Lifetime Developer Access
          </div>
          <h3 className="text-2xl font-black tracking-tight text-white">
            {toolName ? `Unlock Pro: ${toolName}` : 'Unlock ToolBox Pro Suite'}
          </h3>
          <p className="text-xs text-slate-400">
            Scan & Pay via UPI to unlock all 27+ Pro Tools for <strong>Lifetime Access</strong>!
          </p>
        </div>

        {/* User Status Banner */}
        {userStatus === 'APPROVED' ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-black text-sm">
              <CheckCircle2 className="h-5 w-5" /> Premium Active & Verified!
            </div>
            <p className="text-xs text-slate-300">
              Admin <strong>Khushal Jangid</strong> has approved your Pro subscription! Enjoy unlimited access to all tools.
            </p>
          </div>
        ) : userStatus === 'PENDING' ? (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-amber-400 font-black text-sm">
              <Clock className="h-5 w-5 animate-spin" /> Payment Pending Admin Approval
            </div>
            <p className="text-xs text-slate-300">
              12-Digit UTR: <strong>{currentUser?.transactionId}</strong> submitted on {currentUser?.dateSubmitted}. Admin <strong>Khushal Jangid</strong> will verify your payment shortly!
            </p>
          </div>
        ) : (
          /* 3D Holographic Cyberpunk Card Experience */
          <div className="space-y-5">
            
            {/* Interactive Payment App Tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
              {upiApps.map(app => (
                <button
                  key={app.id}
                  onClick={() => setSelectedApp(app.id)}
                  className={`py-2 px-1 text-center rounded-xl transition text-[11px] font-extrabold flex flex-col items-center gap-1 ${
                    selectedApp === app.id
                      ? `bg-gradient-to-r ${app.color} text-white shadow-md shadow-indigo-500/20 scale-105`
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-xs">{app.icon}</span>
                  <span className="truncate w-full">{app.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* 3D Cyberpunk Holographic QR Payment Card */}
            <div className="relative rounded-3xl p-0.5 bg-gradient-to-br from-indigo-500 via-purple-600 to-amber-500 shadow-2xl overflow-hidden group">
              <div className="bg-[#0b101c] p-6 rounded-[22px] text-center space-y-4 relative overflow-hidden">
                
                {/* Circuit Grid Decorative Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#3525cd_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none"></div>

                {/* Card Top Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 text-xs font-mono relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                    <span className="text-slate-300 font-bold">Khushal Jangid</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 line-through text-[11px]">₹499</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs border border-emerald-500/30">
                      ₹199 ONLY
                    </span>
                  </div>
                </div>

                {/* Holographic Target Frame with QR */}
                <div className="relative w-56 h-56 mx-auto bg-white p-3 rounded-2xl shadow-2xl border-4 border-indigo-500/30 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
                  
                  {/* Holographic Glowing Sweep */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-amber-500/10 pointer-events-none"></div>
                  
                  {/* Corner Target Accents */}
                  <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-indigo-600"></div>
                  <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-indigo-600"></div>
                  <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-indigo-600"></div>
                  <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-indigo-600"></div>

                  {/* Real QR Code */}
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="Khushal Jangid UPI QR" className="w-full h-full object-contain rounded-lg relative z-10" />
                  ) : (
                    <img src="/qr-payment.png" alt="Khushal Jangid UPI QR" className="w-full h-full object-contain rounded-lg relative z-10" />
                  )}
                </div>

                {/* Direct Mobile Deep Link Button */}
                <div className="space-y-2">
                  <a
                    href={upiString}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Smartphone className="h-4 w-4" /> Open Payment App Directly (Mobile)
                  </a>

                  {/* Copy UPI Box */}
                  <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs font-mono">
                    <span className="text-slate-300">UPI ID: <strong className="text-emerald-400 select-all font-bold">{upiId}</strong></span>
                    <button
                      onClick={handleCopyUpi}
                      className="px-3 py-1 bg-[#3525cd] hover:bg-indigo-600 text-white rounded-lg font-bold flex items-center gap-1 transition shadow-sm active:scale-95"
                    >
                      {copiedUpi ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedUpi ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-medium pt-1">
                  ⚡ Scans with Google Pay, PhonePe, Paytm, BHIM & OmniCard with ₹199 Auto-Filled!
                </div>
              </div>
            </div>

            {/* Verification Form */}
            {!currentUser ? (
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-center space-y-2">
                <p className="text-xs font-semibold text-slate-300">
                  Please Sign In or Create an Account first to submit your payment proof & track your approval status.
                </p>
                <button
                  onClick={onRequireAuth}
                  className="px-6 py-2.5 rounded-xl bg-[#3525cd] text-white font-bold text-xs shadow-md hover:bg-indigo-600 transition flex items-center justify-center gap-1.5 mx-auto"
                >
                  <User className="h-4 w-4" /> Sign In / Create Account
                </button>
              </div>
            ) : (
              <form onSubmit={handlePaymentSubmit} className="space-y-3 text-left">
                {error && (
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-xl text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      UPI Transaction ID / UTR Number (12 Digits) *
                    </label>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {transactionId.length}/12
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    value={transactionId}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                      setTransactionId(val);
                    }}
                    placeholder="e.g. 423589104729 (12 Digits Only)"
                    className="w-full px-3 py-2.5 bg-[#0b101c] border border-slate-800 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:border-[#3525cd]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Your Mobile Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-3 py-2.5 bg-[#0b101c] border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white font-black text-xs shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" /> Submit Payment Proof for Admin Approval
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
