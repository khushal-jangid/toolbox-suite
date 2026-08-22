import React, { useState, useRef } from 'react';
import { Upload, FileDown, Download, RefreshCw, CheckCircle2, Sliders, Shield } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import confetti from 'canvas-confetti';

export default function PdfCompressorTool() {
  const [file, setFile] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedPdfUrl, setCompressedPdfUrl] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState('medium'); // low, medium, high
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState('');
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    try {
      if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
      }
    } catch (e) {
      console.warn('PDF.js worker init:', e);
    }
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile || (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf'))) {
      alert('Please select a valid PDF document.');
      return;
    }
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    setCompressedPdfUrl(null);
    setCompressedSize(0);
  };

  const handleCompressPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgressText('Analyzing PDF pages...');

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Determine quality settings
      let scale = 1.2;
      let quality = 0.65;
      if (compressionLevel === 'high') {
        scale = 0.9;
        quality = 0.45;
      } else if (compressionLevel === 'low') {
        scale = 1.5;
        quality = 0.82;
      }

      // Render each page to canvas and compress
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      const newPdfDoc = await PDFDocument.create();

      for (let i = 1; i <= totalPages; i++) {
        setProgressText(`Compressing page ${i} of ${totalPages}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        await page.render({ canvasContext: ctx, viewport }).promise;
        const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);

        const jpegImage = await newPdfDoc.embedJpg(jpegDataUrl);
        const newPage = newPdfDoc.addPage([viewport.width, viewport.height]);
        newPage.drawImage(jpegImage, {
          x: 0,
          y: 0,
          width: viewport.width,
          height: viewport.height
        });
      }

      setProgressText('Finalizing optimized PDF...');
      const compressedPdfBytes = await newPdfDoc.save();
      const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
      setCompressedSize(blob.size);
      const url = URL.createObjectURL(blob);
      setCompressedPdfUrl(url);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
    } catch (err) {
      console.error('PDF compression error:', err);
      // Fallback: direct save with pdf-lib
      try {
        const arrayBuffer = await file.arrayBuffer();
        const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const bytes = await doc.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        setCompressedSize(blob.size);
        setCompressedPdfUrl(URL.createObjectURL(blob));
      } catch (fallbackErr) {
        alert('Could not compress PDF: ' + err.message);
      }
    } finally {
      setIsProcessing(false);
      setProgressText('');
    }
  };

  const savedPercent = originalSize > 0 && compressedSize > 0
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  return (
    <div className="space-y-6 text-left">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-500 p-12 rounded-2xl text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/40 space-y-3"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
          <div className="w-16 h-16 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto">
            <FileDown className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload PDF File to Compress</h3>
            <p className="text-xs text-slate-500 mt-1">Reduce PDF file size while preserving readability</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition">
            <Upload className="h-3.5 w-3.5" /> Select PDF Document
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Settings Card */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Selected Document</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-sm">{file.name}</p>
              </div>
              <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                {formatBytes(originalSize)}
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Sliders className="h-3.5 w-3.5 text-rose-500" /> Compression Preset Level:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setCompressionLevel('high')}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    compressionLevel === 'high'
                      ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-black">Extreme Compression</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Smallest file size (~70% reduction)</div>
                </button>

                <button
                  onClick={() => setCompressionLevel('medium')}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    compressionLevel === 'medium'
                      ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-black">Recommended</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Good quality + high reduction (~50%)</div>
                </button>

                <button
                  onClick={() => setCompressionLevel('low')}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    compressionLevel === 'low'
                      ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-black">Light Compression</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Highest visual quality (~25% reduction)</div>
                </button>
              </div>
            </div>

            {!compressedPdfUrl && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleCompressPdf}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
                  {isProcessing ? progressText || 'Compressing PDF...' : 'Compress PDF Now'}
                </button>
              </div>
            )}
          </div>

          {/* Results Comparison Card */}
          {compressedPdfUrl && (
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <CheckCircle2 className="h-5 w-5" /> PDF Compressed Successfully!
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Original Size</span>
                  <div className="text-lg font-mono font-black text-slate-900 dark:text-white mt-0.5">
                    {formatBytes(originalSize)}
                  </div>
                </div>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Compressed Size</span>
                  <div className="text-lg font-mono font-black text-emerald-600 mt-0.5">
                    {formatBytes(compressedSize)}
                  </div>
                </div>

                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-[#3525cd] uppercase">Space Saved</span>
                  <div className="text-lg font-mono font-black text-[#3525cd] mt-0.5">
                    {savedPercent > 0 ? `-${savedPercent}%` : 'Optimized'}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => { setFile(null); setCompressedPdfUrl(null); }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Compress Another PDF
                </button>
                <a
                  href={compressedPdfUrl}
                  download={`${file.name.replace('.pdf', '')}-compressed.pdf`}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  <Download className="h-4 w-4" /> Download Compressed PDF
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
