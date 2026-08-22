import React, { useState, useRef } from 'react';
import { Upload, Trash2, Download, RefreshCw, CheckCircle2, FileText, Check } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';

export default function PdfPageRemoverTool() {
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pagesToDelete, setPagesToDelete] = useState(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultPdfUrl, setResultPdfUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile || !selectedFile.name.endsWith('.pdf')) {
      alert('Please select a valid PDF file.');
      return;
    }
    setFile(selectedFile);
    setPagesToDelete(new Set());
    setResultPdfUrl(null);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setTotalPages(doc.getPageCount());
    } catch (err) {
      alert('Could not read PDF: ' + err.message);
    }
  };

  const togglePageDelete = (pageNum) => {
    setPagesToDelete(prev => {
      const next = new Set(prev);
      if (next.has(pageNum)) {
        next.delete(pageNum);
      } else {
        if (next.size >= totalPages - 1) {
          alert('Cannot delete all pages. At least 1 page must remain.');
          return prev;
        }
        next.add(pageNum);
      }
      return next;
    });
    setResultPdfUrl(null);
  };

  const handleRemovePages = async () => {
    if (!file || pagesToDelete.size === 0) return;
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      // Sort descending so indices don't shift when removing
      const sortedIndices = Array.from(pagesToDelete).sort((a, b) => b - a);
      sortedIndices.forEach(idx => {
        doc.removePage(idx - 1);
      });

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultPdfUrl(URL.createObjectURL(blob));
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      console.error('Remove pages error:', err);
      alert('Error removing pages: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-500 p-12 rounded-3xl text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/40 space-y-3"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
          <div className="w-16 h-16 bg-rose-500/10 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <Trash2 className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload PDF to Remove Unwanted Pages</h3>
            <p className="text-xs text-slate-500 mt-1">Select and delete unnecessary or blank pages from your PDF</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition">
            <Upload className="h-3.5 w-3.5" /> Select PDF Document
          </span>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="space-y-0.5 truncate max-w-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Document ({totalPages} Total Pages)</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setFile(null); setPagesToDelete(new Set()); }}
                className="px-3 py-1.5 text-xs font-bold border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Change PDF
              </button>
              <button
                onClick={handleRemovePages}
                disabled={pagesToDelete.size === 0 || isProcessing}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                Delete {pagesToDelete.size} Pages
              </button>
            </div>
          </div>

          {/* Grid of Pages to Click/Toggle */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase">
              Click any page below to mark for deletion:
            </span>

            <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-96 overflow-y-auto p-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isMarked = pagesToDelete.has(pageNum);
                return (
                  <div
                    key={pageNum}
                    onClick={() => togglePageDelete(pageNum)}
                    className={`aspect-[3/4] p-3 rounded-2xl border-2 cursor-pointer transition flex flex-col items-center justify-between text-center select-none ${
                      isMarked
                        ? 'border-rose-500 bg-rose-500/10 text-rose-600'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <FileText className={`h-6 w-6 ${isMarked ? 'text-rose-500' : 'text-slate-400'}`} />
                    <span className="text-xs font-black">Page {pageNum}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isMarked ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                      {isMarked ? 'REMOVE' : 'KEEP'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Result */}
          {resultPdfUrl && (
            <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4" /> Pages Removed! ({totalPages - pagesToDelete.size} pages remaining)
              </div>
              <a
                href={resultPdfUrl}
                download={`${file.name.replace('.pdf', '')}-modified.pdf`}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" /> Download Modified PDF
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
