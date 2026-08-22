import { downloadFile } from "../../utils/fileDownloader";
import React, { useState, useRef } from 'react';
import { Upload, RotateCw, RotateCcw, Download, RefreshCw, CheckCircle2, FileText } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import confetti from 'canvas-confetti';

export default function PdfRotateTool() {
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [rotations, setRotations] = useState({}); // { pageIndex: degrees }
  const [globalRotation, setGlobalRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultPdfUrl, setResultPdfUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile || !selectedFile.name.endsWith('.pdf')) {
      alert('Please select a valid PDF file.');
      return;
    }
    setFile(selectedFile);
    setRotations({});
    setGlobalRotation(0);
    setResultPdfUrl(null);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setTotalPages(doc.getPageCount());
    } catch (err) {
      alert('Could not read PDF: ' + err.message);
    }
  };

  const rotateSinglePage = (pageIdx, delta) => {
    setRotations(prev => {
      const current = prev[pageIdx] !== undefined ? prev[pageIdx] : globalRotation;
      const next = (current + delta + 360) % 360;
      return { ...prev, [pageIdx]: next };
    });
    setResultPdfUrl(null);
  };

  const rotateAll = (delta) => {
    const nextGlobal = (globalRotation + delta + 360) % 360;
    setGlobalRotation(nextGlobal);
    const updated = {};
    for (let i = 0; i < totalPages; i++) {
      updated[i] = nextGlobal;
    }
    setRotations(updated);
    setResultPdfUrl(null);
  };

  const saveRotatedPdf = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pages = doc.getPages();

      pages.forEach((page, idx) => {
        const rot = rotations[idx] !== undefined ? rotations[idx] : globalRotation;
        const currentAngle = page.getRotation().angle;
        page.setRotation(degrees((currentAngle + rot) % 360));
      });

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultPdfUrl(URL.createObjectURL(blob));
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      console.error('Rotate PDF error:', err);
      alert('Error rotating PDF: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#3525cd] p-12 rounded-3xl text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/40 space-y-3"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
          <div className="w-16 h-16 bg-indigo-500/10 text-[#3525cd] dark:text-[#c3c0ff] rounded-2xl flex items-center justify-center mx-auto">
            <RotateCw className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload PDF to Rotate Pages</h3>
            <p className="text-xs text-slate-500 mt-1">Rotate all or individual pages 90°, 180°, or 270° clockwise</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#3525cd] text-white text-xs font-bold rounded-xl shadow-sm transition">
            <Upload className="h-3.5 w-3.5" /> Select PDF File
          </span>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="space-y-0.5 truncate max-w-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{totalPages} Total Pages</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => rotateAll(-90)}
                className="p-2 border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1"
                title="Rotate All Left 90°"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Rotate All -90°
              </button>
              <button
                onClick={() => rotateAll(90)}
                className="p-2 border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1"
                title="Rotate All Right 90°"
              >
                <RotateCw className="h-3.5 w-3.5" /> Rotate All +90°
              </button>
              <button
                onClick={saveRotatedPdf}
                disabled={isProcessing}
                className="px-4 py-2 bg-[#3525cd] hover:bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                Save Rotated PDF
              </button>
            </div>
          </div>

          {/* Grid of Pages */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-96 overflow-y-auto p-2">
            {Array.from({ length: totalPages }, (_, i) => i).map((pageIdx) => {
              const rot = rotations[pageIdx] !== undefined ? rotations[pageIdx] : globalRotation;
              return (
                <div key={pageIdx} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-between text-center space-y-2 shadow-sm">
                  <div
                    className="w-12 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center transition-transform duration-200 border"
                    style={{ transform: `rotate(${rot}deg)` }}
                  >
                    <FileText className="h-6 w-6 text-slate-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Page {pageIdx + 1}</span>
                    <span className="text-[10px] font-mono text-slate-400 block">{rot}°</span>
                  </div>
                  <div className="flex gap-1 pt-1">
                    <button
                      onClick={() => rotateSinglePage(pageIdx, -90)}
                      className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => rotateSinglePage(pageIdx, 90)}
                      className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                    >
                      <RotateCw className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Result */}
          {resultPdfUrl && (
            <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4" /> PDF Rotation Applied!
              </div>
              <button type="button" onClick={(e) => { e.preventDefault(); downloadFile(resultPdfUrl, `${file.name.replace('.pdf', '')}-rotated.pdf`, "application/pdf"); }}  
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" /> Download Rotated PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
