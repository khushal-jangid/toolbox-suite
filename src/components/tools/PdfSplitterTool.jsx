import { downloadFile } from "../../utils/fileDownloader";
import React, { useState, useRef } from 'react';
import { Upload, Scissors, Download, RefreshCw, CheckCircle2, FileText, Layers, Check } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';

export default function PdfSplitterTool() {
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [splitMode, setSplitMode] = useState('range'); // 'range', 'all', 'single'
  const [pageRange, setPageRange] = useState('1');
  const [selectedSinglePage, setSelectedSinglePage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultPdfUrl, setResultPdfUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile || !selectedFile.name.endsWith('.pdf')) {
      alert('Please select a valid PDF file.');
      return;
    }
    setFile(selectedFile);
    setResultPdfUrl(null);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = doc.getPageCount();
      setTotalPages(count);
      setPageRange(`1-${Math.min(count, 3)}`);
      setSelectedSinglePage(1);
    } catch (err) {
      alert('Could not read PDF: ' + err.message);
    }
  };

  // Parse page range like "1-3, 5, 7-10"
  const parsePageRange = (rangeStr, maxPages) => {
    const pages = new Set();
    const parts = rangeStr.split(',').map(s => s.trim()).filter(Boolean);

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          const from = Math.max(1, Math.min(start, end));
          const to = Math.min(maxPages, Math.max(start, end));
          for (let p = from; p <= to; p++) {
            pages.add(p - 1); // 0-indexed
          }
        }
      } else {
        const p = Number(part);
        if (!isNaN(p) && p >= 1 && p <= maxPages) {
          pages.add(p - 1);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplitPdf = async () => {
    if (!file || totalPages === 0) return;
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      if (splitMode === 'all') {
        // Extract each page into separate PDF and zip them
        const zip = new JSZip();
        const baseName = file.name.replace('.pdf', '');

        for (let i = 0; i < totalPages; i++) {
          const newDoc = await PDFDocument.create();
          const [copiedPage] = await newDoc.copyPages(srcDoc, [i]);
          newDoc.addPage(copiedPage);
          const pdfBytes = await newDoc.save();
          zip.file(`${baseName}-page-${i + 1}.pdf`, pdfBytes);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(zipBlob);
        a.download = `${baseName}-split-pages.zip`;
        a.click();
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
      } else if (splitMode === 'range') {
        const pageIndices = parsePageRange(pageRange, totalPages);
        if (pageIndices.length === 0) {
          alert('Please enter a valid page range (e.g. 1-3, 5).');
          setIsProcessing(false);
          return;
        }

        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
        copiedPages.forEach(p => newDoc.addPage(p));

        const pdfBytes = await newDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        setResultPdfUrl(URL.createObjectURL(blob));
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
      } else if (splitMode === 'single') {
        const newDoc = await PDFDocument.create();
        const [copiedPage] = await newDoc.copyPages(srcDoc, [selectedSinglePage - 1]);
        newDoc.addPage(copiedPage);

        const pdfBytes = await newDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        setResultPdfUrl(URL.createObjectURL(blob));
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
      }
    } catch (err) {
      console.error('PDF Split error:', err);
      alert('Error splitting PDF: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 p-12 rounded-2xl text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/40 space-y-3"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
          <div className="w-16 h-16 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mx-auto">
            <Scissors className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload PDF to Split or Extract Pages</h3>
            <p className="text-xs text-slate-500 mt-1">Extract specific page ranges or split all pages into separate PDFs</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition">
            <Upload className="h-3.5 w-3.5" /> Select PDF File
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Meta Header */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="space-y-0.5 truncate max-w-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">Target Document</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
            </div>
            <span className="px-3 py-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs rounded-xl border border-purple-500/20">
              {totalPages} Total Pages
            </span>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => { setSplitMode('range'); setResultPdfUrl(null); }}
              className={`p-4 rounded-xl border text-left transition ${
                splitMode === 'range'
                  ? 'border-purple-600 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-black">Custom Page Range</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Extract ranges like 1-3, 5, 8</div>
            </button>

            <button
              onClick={() => { setSplitMode('all'); setResultPdfUrl(null); }}
              className={`p-4 rounded-xl border text-left transition ${
                splitMode === 'all'
                  ? 'border-purple-600 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-black">Extract All Pages</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Save each page as individual PDF (ZIP)</div>
            </button>

            <button
              onClick={() => { setSplitMode('single'); setResultPdfUrl(null); }}
              className={`p-4 rounded-xl border text-left transition ${
                splitMode === 'single'
                  ? 'border-purple-600 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-black">Single Page</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Extract exactly one specific page</div>
            </button>
          </div>

          {/* Configuration Input */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            {splitMode === 'range' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Enter Page Numbers or Ranges (1 to {totalPages})
                </label>
                <input
                  type="text"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  placeholder="e.g. 1-3, 5, 7-10"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold font-mono focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">
                  Example: "1-3, 5" will extract page 1, 2, 3, and 5 into one PDF.
                </span>
              </div>
            )}

            {splitMode === 'single' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select Page to Extract: Page {selectedSinglePage}
                </label>
                <input
                  type="range"
                  min="1"
                  max={totalPages}
                  value={selectedSinglePage}
                  onChange={(e) => setSelectedSinglePage(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
            )}

            {splitMode === 'all' && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-600 dark:text-slate-400">
                All <strong>{totalPages} pages</strong> will be extracted into separate PDF files and compressed into a single .ZIP download.
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => { setFile(null); setResultPdfUrl(null); }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
              >
                Change PDF
              </button>
              <button
                onClick={handleSplitPdf}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Scissors className="h-4 w-4" />}
                {splitMode === 'all' ? 'Split All & Download ZIP' : 'Extract PDF'}
              </button>
            </div>
          </div>

          {/* Download Result Link */}
          {resultPdfUrl && (
            <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4" /> Extracted PDF is ready!
              </div>
              <button type="button" onClick={(e) => { e.preventDefault(); downloadFile(resultPdfUrl, `${file.name.replace('.pdf', '')}-extracted.pdf`, "application/pdf"); }}  
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" /> Download Extracted PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
