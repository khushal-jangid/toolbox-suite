import React, { useState, useRef } from 'react';
import { Lock, Unlock, Upload, Download, Key, ShieldCheck, RefreshCw, CheckCircle2, Eye, EyeOff, FileCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FileEncryptorTool() {
  const [mode, setMode] = useState('encrypt'); // 'encrypt' or 'decrypt'
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [resultFileName, setResultFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setResultUrl(null);
    setErrorMsg('');
  };

  // Derive AES-GCM Key using PBKDF2
  const deriveKey = async (pass, salt) => {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(pass),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  };

  const handleEncrypt = async () => {
    if (!file || !password) {
      alert('Please select a file and enter a password.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      const fileData = await file.arrayBuffer();
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const key = await deriveKey(password, salt);

      const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        fileData
      );

      // Package into custom format:
      // [4 bytes Magic "ENC1"] [16 bytes Salt] [12 bytes IV] [2 bytes Filename Length] [Filename Bytes] [Encrypted Content]
      const enc = new TextEncoder();
      const filenameBytes = enc.encode(file.name);
      const filenameLen = filenameBytes.length;

      const headerLen = 4 + 16 + 12 + 2 + filenameLen;
      const totalLen = headerLen + encryptedData.byteLength;
      const outputBuffer = new Uint8Array(totalLen);

      // Magic
      outputBuffer.set(enc.encode('ENC1'), 0);
      // Salt
      outputBuffer.set(salt, 4);
      // IV
      outputBuffer.set(iv, 20);
      // Filename length (16-bit uint)
      outputBuffer[32] = (filenameLen >> 8) & 0xff;
      outputBuffer[33] = filenameLen & 0xff;
      // Filename
      outputBuffer.set(filenameBytes, 34);
      // Encrypted Data
      outputBuffer.set(new Uint8Array(encryptedData), headerLen);

      const blob = new Blob([outputBuffer], { type: 'application/octet-stream' });
      const outName = `${file.name}.enc`;
      setResultUrl(URL.createObjectURL(blob));
      setResultFileName(outName);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
    } catch (err) {
      console.error('Encryption error:', err);
      setErrorMsg('Encryption failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecrypt = async () => {
    if (!file || !password) {
      alert('Please select an encrypted file and enter your password.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      const fileData = new Uint8Array(await file.arrayBuffer());

      // Verify Magic
      const dec = new TextDecoder();
      const magic = dec.decode(fileData.slice(0, 4));
      if (magic !== 'ENC1') {
        throw new Error('Invalid or corrupted encrypted file format.');
      }

      const salt = fileData.slice(4, 20);
      const iv = fileData.slice(20, 32);
      const filenameLen = (fileData[32] << 8) | fileData[33];
      const origFilename = dec.decode(fileData.slice(34, 34 + filenameLen));
      const encryptedBytes = fileData.slice(34 + filenameLen);

      const key = await deriveKey(password, salt);

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encryptedBytes
      );

      const blob = new Blob([decryptedBuffer]);
      setResultUrl(URL.createObjectURL(blob));
      setResultFileName(origFilename || file.name.replace('.enc', ''));
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.8 } });
    } catch (err) {
      console.error('Decryption error:', err);
      setErrorMsg('Decryption failed! Incorrect password or corrupted file.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Mode Switch Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-md mx-auto">
        <button
          onClick={() => { setMode('encrypt'); setFile(null); setResultUrl(null); setErrorMsg(''); }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            mode === 'encrypt'
              ? 'bg-[#3525cd] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Lock className="h-4 w-4" /> Encrypt File (AES-256)
        </button>
        <button
          onClick={() => { setMode('decrypt'); setFile(null); setResultUrl(null); setErrorMsg(''); }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            mode === 'decrypt'
              ? 'bg-[#3525cd] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Unlock className="h-4 w-4" /> Decrypt File
        </button>
      </div>

      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#3525cd] dark:hover:border-[#c3c0ff] p-8 rounded-2xl text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/40 space-y-3"
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
        />
        <div className="w-14 h-14 bg-indigo-500/10 text-[#3525cd] dark:text-[#c3c0ff] rounded-2xl flex items-center justify-center mx-auto">
          {mode === 'encrypt' ? <Lock className="h-7 w-7" /> : <Unlock className="h-7 w-7" />}
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            {mode === 'encrypt' ? 'Select Any File to Encrypt' : 'Select Encrypted (.enc) File to Decrypt'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">100% in-browser AES-GCM 256-bit encryption. Zero server storage.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3525cd] text-white text-xs font-bold rounded-xl shadow-sm">
          <Upload className="h-3.5 w-3.5" /> Choose File
        </span>
      </div>

      {file && (
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="truncate max-w-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">Selected File</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
              {formatBytes(file.size)}
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Key className="h-3.5 w-3.5 text-[#3525cd]" /> Secret Encryption Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a strong password or passkey..."
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold font-mono focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <span className="text-[10px] text-slate-400">
              {mode === 'encrypt' ? 'Remember this password! It cannot be recovered if lost.' : 'Enter the same password used during encryption.'}
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold rounded-xl">
              {errorMsg}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={mode === 'encrypt' ? handleEncrypt : handleDecrypt}
              disabled={isProcessing || !password}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#3525cd] hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
            >
              {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              {mode === 'encrypt' ? 'Encrypt & Protect File' : 'Decrypt File'}
            </button>
          </div>

          {resultUrl && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4" /> {mode === 'encrypt' ? 'File Encrypted!' : 'File Decrypted!'}
              </div>
              <a
                href={resultUrl}
                download={resultFileName}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" /> Download {resultFileName}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
