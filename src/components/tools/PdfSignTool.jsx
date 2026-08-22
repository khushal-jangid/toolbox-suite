import { downloadFile } from "../../utils/fileDownloader";
import React, { useState, useRef, useEffect } from 'react';
import { Upload, PenTool, Download, RefreshCw, CheckCircle2, Eraser, Type } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';

export default function PdfSignTool() {
  const [file, setFile] = useState(null);
  const [signMode, setSignMode] = useState('draw'); // 'draw' or 'type'
  const [typedName, setTypedName] = useState('Khushal Jangid');
  const [penColor, setPenColor] = useState('#1e293b');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultPdfUrl, setResultPdfUrl] = useState(null);

  const sigCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2.5;
  }, [penColor, file]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const generateSignatureImage = () => {
    const outCanvas = document.createElement('canvas');
    outCanvas.width = 400;
    outCanvas.height = 160;
    const outCtx = outCanvas.getContext('2d');

    if (signMode === 'draw') {
      const srcCanvas = sigCanvasRef.current;
      if (!srcCanvas) return null;
      outCtx.drawImage(srcCanvas, 0, 0, 400, 160);
    } else {
      outCtx.fillStyle = penColor;
      outCtx.font = 'italic 38px "Brush Script MT", cursive, sans-serif';
      outCtx.textAlign = 'center';
      outCtx.textBaseline = 'middle';
      outCtx.fillText(typedName, 200, 80);
    }
    return outCanvas.toDataURL('image/png');
  };

  const applySignature = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const sigDataUrl = generateSignatureImage();
      if (!sigDataUrl) throw new Error('Signature is empty');

      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pages = doc.getPages();
      const lastPage = pages[pages.length - 1]; // Place on last page

      const pngImage = await doc.embedPng(sigDataUrl);
      const { width } = lastPage.getSize();

      // Draw signature on bottom right of last page
      const sigW = 160;
      const sigH = 64;
      lastPage.drawImage(pngImage, {
        x: width - sigW - 40,
        y: 40,
        width: sigW,
        height: sigH
      });

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultPdfUrl(URL.createObjectURL(blob));
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      console.error('Sign PDF error:', err);
      alert('Error applying signature: ' + err.message);
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
            onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
          />
          <div className="w-16 h-16 bg-indigo-500/10 text-[#3525cd] dark:text-[#c3c0ff] rounded-2xl flex items-center justify-center mx-auto">
            <PenTool className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload PDF to Add Digital Signature</h3>
            <p className="text-xs text-slate-500 mt-1">Draw or type your signature and embed it securely onto your PDF</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#3525cd] text-white text-xs font-bold rounded-xl shadow-sm transition">
            <Upload className="h-3.5 w-3.5" /> Select PDF Document
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

          {/* Signature Box */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setSignMode('draw')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${signMode === 'draw' ? 'bg-[#3525cd] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                >
                  <PenTool className="h-3.5 w-3.5" /> Draw Signature
                </button>
                <button
                  onClick={() => setSignMode('type')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${signMode === 'type' ? 'bg-[#3525cd] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                >
                  <Type className="h-3.5 w-3.5" /> Type Name
                </button>
              </div>

              <div className="flex items-center gap-2">
                {['#1e293b', '#2563eb', '#dc2626'].map(color => (
                  <button
                    key={color}
                    onClick={() => setPenColor(color)}
                    className={`w-6 h-6 rounded-full border-2 transition ${penColor === color ? 'border-indigo-500 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {signMode === 'draw' ? (
              <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 overflow-hidden">
                <canvas
                  ref={sigCanvasRef}
                  width={400}
                  height={160}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-40 cursor-crosshair touch-none"
                />
                <button
                  onClick={clearCanvas}
                  className="absolute bottom-3 right-3 px-2.5 py-1 bg-white dark:bg-slate-900 border rounded-lg text-[11px] font-bold text-rose-500 flex items-center gap-1 shadow-sm"
                >
                  <Eraser className="h-3 w-3" /> Clear Pad
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="Enter full name..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm font-bold"
                />
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border text-center font-serif italic text-3xl" style={{ color: penColor }}>
                  {typedName || 'Your Signature'}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={applySignature}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#3525cd] hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <PenTool className="h-4 w-4" />}
                Sign & Embed on PDF
              </button>
            </div>
          </div>

          {/* Result */}
          {resultPdfUrl && (
            <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4" /> Signature Applied Successfully!
              </div>
              <button type="button" onClick={(e) => { e.preventDefault(); downloadFile(resultPdfUrl, `${file.name.replace('.pdf', '')}-signed.pdf`, "application/pdf"); }}  
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" /> Download Signed PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
