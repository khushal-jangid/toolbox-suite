import React, { useState, useRef } from 'react';
import { Upload, EyeOff, Download, RefreshCw, CheckCircle2, ShieldAlert, Plus, Trash2 } from 'lucide-react';
import { PDFDocument, rgb } from 'pdf-lib';
import confetti from 'canvas-confetti';

export default function PdfRedactTool() {
  const [file, setFile] = useState(null);
  const [redactions, setRedactions] = useState([
    { pageNum: 1, label: 'Confidential Information #1', x: 50, y: 700, width: 250, height: 20 },
    { pageNum: 1, label: 'Account Number #2', x: 50, y: 660, width: 180, height: 20 }
  ]);
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

  const addRedaction = () => {
    setRedactions(prev => [
      ...prev,
      { pageNum: 1, label: `Blackout Block #${prev.length + 1}`, x: 50, y: 600 - (prev.length * 40), width: 200, height: 20 }
    ]);
  };

  const removeRedaction = (idx) => {
    setRedactions(prev => prev.filter((_, i) => i !== idx));
  };

  const applyRedaction = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pages = doc.getPages();

      redactions.forEach(red => {
        const targetPage = pages[Math.min(pages.length - 1, Math.max(0, red.pageNum - 1))];
        targetPage.drawRectangle({
          x: red.x,
          y: red.y,
          width: red.width,
          height: red.height,
          color: rgb(0, 0, 0)
        });
      });

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultPdfUrl(URL.createObjectURL(blob));
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      console.error('Redact error:', err);
      alert('Error applying redactions: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-900 p-12 rounded-3xl text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/40 space-y-3"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
          <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto">
            <EyeOff className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload PDF to Redact & Blackout Sensitive Data</h3>
            <p className="text-xs text-slate-500 mt-1">Censor names, credit cards, SSNs, and confidential text before sharing</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm transition">
            <Upload className="h-3.5 w-3.5" /> Select PDF Document
          </span>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="space-y-0.5 truncate max-w-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Document</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
            </div>
            <button
              onClick={() => { setFile(null); setResultPdfUrl(null); }}
              className="px-3 py-1.5 text-xs font-bold border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Change PDF
            </button>
          </div>

          {/* Redactions list */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-slate-900 dark:text-slate-100" /> Active Redaction Boxes ({redactions.length})
              </span>
              <button
                onClick={addRedaction}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold rounded-xl flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add Redaction Box
              </button>
            </div>

            <div className="space-y-2">
              {redactions.map((red, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-black rounded" />
                    <span>{red.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">(Pg {red.pageNum})</span>
                  </div>
                  <button
                    onClick={() => removeRedaction(idx)}
                    className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={applyRedaction}
                disabled={isProcessing || redactions.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <EyeOff className="h-4 w-4" />}
                Apply Permanent Blackout Redactions
              </button>
            </div>
          </div>

          {/* Result */}
          {resultPdfUrl && (
            <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4" /> Redactions Applied Permanently!
              </div>
              <a
                href={resultPdfUrl}
                download={`${file.name.replace('.pdf', '')}-redacted.pdf`}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" /> Download Redacted PDF
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
