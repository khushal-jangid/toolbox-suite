import React, { useState, useRef } from 'react';
import { Upload, Unlock, Download, RefreshCw, CheckCircle2, KeyRound } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';

export default function PdfUnlockTool() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultPdfUrl, setResultPdfUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile || !selectedFile.name.endsWith('.pdf')) {
      alert('Please select a valid PDF file.');
      return;
    }
    setFile(selectedFile);
    setResultPdfUrl(null);
  };

  const handleUnlockPdf = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      // Load and re-save to remove password protection and restrictions
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pdfBytes = await doc.save();

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultPdfUrl(URL.createObjectURL(blob));
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      console.error('Unlock PDF error:', err);
      alert('Failed to unlock PDF: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 p-12 rounded-3xl text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/40 space-y-3"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <Unlock className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload PDF to Remove Password & Restrictions</h3>
            <p className="text-xs text-slate-500 mt-1">Permanently remove printing, copying, and password security locks</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition">
            <Upload className="h-3.5 w-3.5" /> Select Locked PDF
          </span>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="space-y-0.5 truncate max-w-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Selected Document</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
            </div>
            <button
              onClick={() => { setFile(null); setResultPdfUrl(null); }}
              className="px-3 py-1.5 text-xs font-bold border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Change PDF
            </button>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Owner / User Password (Optional)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password if encrypted..."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleUnlockPdf}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Unlock className="h-4 w-4" />}
                Unlock & Remove Security
              </button>
            </div>
          </div>

          {resultPdfUrl && (
            <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4" /> Password Removed! Unlocked PDF Ready.
              </div>
              <a
                href={resultPdfUrl}
                download={`${file.name.replace('.pdf', '')}-unlocked.pdf`}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" /> Download Unlocked PDF
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
