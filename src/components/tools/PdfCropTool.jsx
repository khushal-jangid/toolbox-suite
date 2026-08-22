import React, { useState, useRef } from 'react';
import { Upload, Crop, Download, RefreshCw, CheckCircle2, Sliders } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';

export default function PdfCropTool() {
  const [file, setFile] = useState(null);
  const [topMargin, setTopMargin] = useState(20);
  const [bottomMargin, setBottomMargin] = useState(20);
  const [leftMargin, setLeftMargin] = useState(20);
  const [rightMargin, setRightMargin] = useState(20);
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

  const handleCropPdf = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pages = doc.getPages();

      pages.forEach(page => {
        const { width, height } = page.getSize();
        const newX = leftMargin;
        const newY = bottomMargin;
        const newWidth = Math.max(50, width - leftMargin - rightMargin);
        const newHeight = Math.max(50, height - topMargin - bottomMargin);

        page.setCropBox(newX, newY, newWidth, newHeight);
      });

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultPdfUrl(URL.createObjectURL(blob));
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      console.error('Crop PDF error:', err);
      alert('Error cropping PDF: ' + err.message);
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
            <Crop className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload PDF to Crop Page Margins</h3>
            <p className="text-xs text-slate-500 mt-1">Trim unwanted white borders, header/footer margins, or zoom page areas</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#3525cd] text-white text-xs font-bold rounded-xl shadow-sm transition">
            <Upload className="h-3.5 w-3.5" /> Select PDF File
          </span>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="space-y-0.5 truncate max-w-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Target Document</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
            </div>
            <button
              onClick={() => { setFile(null); setResultPdfUrl(null); }}
              className="px-3 py-1.5 text-xs font-bold border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Change PDF
            </button>
          </div>

          {/* Margins Controls */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-[#3525cd]" /> Crop Margin Trim (in points)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Top: {topMargin}pt</label>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={topMargin}
                  onChange={(e) => setTopMargin(Number(e.target.value))}
                  className="w-full accent-[#3525cd]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Bottom: {bottomMargin}pt</label>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={bottomMargin}
                  onChange={(e) => setBottomMargin(Number(e.target.value))}
                  className="w-full accent-[#3525cd]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Left: {leftMargin}pt</label>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={leftMargin}
                  onChange={(e) => setLeftMargin(Number(e.target.value))}
                  className="w-full accent-[#3525cd]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Right: {rightMargin}pt</label>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={rightMargin}
                  onChange={(e) => setRightMargin(Number(e.target.value))}
                  className="w-full accent-[#3525cd]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleCropPdf}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#3525cd] hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Crop className="h-4 w-4" />}
                Crop PDF Document
              </button>
            </div>
          </div>

          {/* Result */}
          {resultPdfUrl && (
            <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4" /> PDF Cropped Successfully!
              </div>
              <a
                href={resultPdfUrl}
                download={`${file.name.replace('.pdf', '')}-cropped.pdf`}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" /> Download Cropped PDF
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
