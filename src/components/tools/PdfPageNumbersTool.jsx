import React, { useState, useRef } from 'react';
import { Upload, Hash, Download, RefreshCw, CheckCircle2 } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import confetti from 'canvas-confetti';

export default function PdfPageNumbersTool() {
  const [file, setFile] = useState(null);
  const [position, setPosition] = useState('bottom-center'); // 'bottom-center', 'bottom-right', 'top-right', 'bottom-left'
  const [format, setFormat] = useState('page-x-of-y'); // 'num-only', 'page-x-of-y', 'x-slash-y', 'dash-x-dash'
  const [startNum, setStartNum] = useState(1);
  const [fontSize, setFontSize] = useState(10);
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

  const addPageNumbers = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const total = doc.getPageCount();

      const pages = doc.getPages();
      pages.forEach((page, idx) => {
        const pageNum = idx + startNum;
        let text = '';
        if (format === 'num-only') text = `${pageNum}`;
        else if (format === 'page-x-of-y') text = `Page ${pageNum} of ${total}`;
        else if (format === 'x-slash-y') text = `${pageNum}/${total}`;
        else if (format === 'dash-x-dash') text = `- ${pageNum} -`;

        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const { width, height } = page.getSize();
        const margin = 28;

        let x = margin;
        let y = margin;

        if (position === 'bottom-center') {
          x = (width - textWidth) / 2;
          y = margin;
        } else if (position === 'bottom-right') {
          x = width - margin - textWidth;
          y = margin;
        } else if (position === 'bottom-left') {
          x = margin;
          y = margin;
        } else if (position === 'top-right') {
          x = width - margin - textWidth;
          y = height - margin;
        } else if (position === 'top-center') {
          x = (width - textWidth) / 2;
          y = height - margin;
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.3, 0.3, 0.35)
        });
      });

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultPdfUrl(URL.createObjectURL(blob));
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      console.error('Page numbers error:', err);
      alert('Error adding page numbers: ' + err.message);
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
            <Hash className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload PDF to Add Page Numbers</h3>
            <p className="text-xs text-slate-500 mt-1">Insert custom headers, footers, and page numbers with customizable position</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#3525cd] text-white text-xs font-bold rounded-xl shadow-sm transition">
            <Upload className="h-3.5 w-3.5" /> Select PDF Document
          </span>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="space-y-0.5 truncate max-w-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Selected PDF</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
            </div>
            <button
              onClick={() => { setFile(null); setResultPdfUrl(null); }}
              className="px-3 py-1.5 text-xs font-bold border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Change PDF
            </button>
          </div>

          {/* Settings Bar */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">Position</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
                >
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-center">Top Center</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">Numbering Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
                >
                  <option value="page-x-of-y">Page 1 of 10</option>
                  <option value="x-slash-y">1/10</option>
                  <option value="num-only">1</option>
                  <option value="dash-x-dash">- 1 -</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">Starting Number</label>
                <input
                  type="number"
                  min="1"
                  value={startNum}
                  onChange={(e) => setStartNum(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">Font Size: {fontSize}pt</label>
                <input
                  type="range"
                  min="8"
                  max="16"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-[#3525cd] mt-2"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={addPageNumbers}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#3525cd] hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Hash className="h-4 w-4" />}
                Apply Page Numbers
              </button>
            </div>
          </div>

          {/* Result */}
          {resultPdfUrl && (
            <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4" /> Page Numbers Applied Successfully!
              </div>
              <a
                href={resultPdfUrl}
                download={`${file.name.replace('.pdf', '')}-numbered.pdf`}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" /> Download Numbered PDF
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
