import React, { useState, useRef, useEffect } from 'react';
import { Upload, Edit3, Type, Download, RefreshCw, CheckCircle2, Square, PenTool } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import confetti from 'canvas-confetti';

export default function PdfEditTool() {
  const [file, setFile] = useState(null);
  const [annotations, setAnnotations] = useState([]); // { text, x, y, size, color }
  const [inputText, setInputText] = useState('Approved & Verified');
  const [textColor, setTextColor] = useState('#3525cd');
  const [textSize, setTextSize] = useState(14);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultPdfUrl, setResultPdfUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile || !selectedFile.name.endsWith('.pdf')) {
      alert('Please select a valid PDF file.');
      return;
    }
    setFile(selectedFile);
    setAnnotations([]);
    setResultPdfUrl(null);
  };

  const addAnnotation = () => {
    if (!inputText.trim()) return;
    setAnnotations(prev => [...prev, {
      text: inputText,
      x: 60,
      y: 720 - (prev.length * 30),
      size: textSize,
      color: textColor
    }]);
  };

  const removeAnnotation = (idx) => {
    setAnnotations(prev => prev.filter((_, i) => i !== idx));
  };

  const saveEditedPdf = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const pages = doc.getPages();
      const firstPage = pages[0];

      annotations.forEach(ann => {
        // Hex to RGB
        const r = parseInt(ann.color.slice(1, 3), 16) / 255;
        const g = parseInt(ann.color.slice(3, 5), 16) / 255;
        const b = parseInt(ann.color.slice(5, 7), 16) / 255;

        firstPage.drawText(ann.text, {
          x: ann.x,
          y: ann.y,
          size: ann.size,
          font,
          color: rgb(r, g, b)
        });
      });

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultPdfUrl(URL.createObjectURL(blob));
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      console.error('Edit PDF error:', err);
      alert('Error saving edited PDF: ' + err.message);
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
            <Edit3 className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload PDF to Add Text & Annotations</h3>
            <p className="text-xs text-slate-500 mt-1">Insert custom text, approvals, badges, and markup onto your PDF pages</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#3525cd] text-white text-xs font-bold rounded-xl shadow-sm transition">
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

          {/* Add Annotation Controls */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Type className="h-4 w-4 text-[#3525cd]" /> Add Custom Text Annotation
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Text to stamp on PDF..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-10 h-9 p-0.5 border rounded-xl bg-transparent cursor-pointer"
                />
                <button
                  onClick={addAnnotation}
                  className="flex-1 py-2 bg-[#3525cd] hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-sm transition"
                >
                  + Add Text
                </button>
              </div>
            </div>

            {/* List of active annotations */}
            {annotations.length > 0 && (
              <div className="space-y-2 pt-2 border-t">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Active Annotations ({annotations.length})</span>
                <div className="space-y-1.5">
                  {annotations.map((ann, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold">
                      <span style={{ color: ann.color }}>{ann.text}</span>
                      <button
                        onClick={() => removeAnnotation(i)}
                        className="text-rose-500 hover:text-rose-700 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={saveEditedPdf}
                disabled={isProcessing || annotations.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#3525cd] hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Save & Download Edited PDF
              </button>
            </div>
          </div>

          {/* Result */}
          {resultPdfUrl && (
            <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4" /> PDF Text Annotations Applied!
              </div>
              <a
                href={resultPdfUrl}
                download={`${file.name.replace('.pdf', '')}-edited.pdf`}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" /> Download Edited PDF
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
