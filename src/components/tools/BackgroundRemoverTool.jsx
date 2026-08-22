import React, { useState, useRef } from 'react';
import { Upload, Wand2, Download, RefreshCw, Eye, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BackgroundRemoverTool() {
  const [file, setFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [targetColor, setTargetColor] = useState('#ffffff');
  const [tolerance, setTolerance] = useState(30);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile || !selectedFile.type.startsWith('image/')) return;
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setOriginalUrl(url);

    // Auto detect top-left pixel color as initial target
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const pixel = ctx.getImageData(0, 0, 1, 1).data;
      const hex = '#' + [pixel[0], pixel[1], pixel[2]].map(x => x.toString(16).padStart(2, '0')).join('');
      setTargetColor(hex);
      processBackgroundRemoval(img, hex, tolerance);
    };
  };

  const processBackgroundRemoval = (img, colorHex, tol) => {
    setIsProcessing(true);

    // Convert hex to rgb
    const rTarget = parseInt(colorHex.slice(1, 3), 16);
    const gTarget = parseInt(colorHex.slice(3, 5), 16);
    const bTarget = parseInt(colorHex.slice(5, 7), 16);

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const diff = Math.sqrt(
        Math.pow(r - rTarget, 2) +
        Math.pow(g - gTarget, 2) +
        Math.pow(b - bTarget, 2)
      );

      if (diff < tol * 2.5) {
        data[i + 3] = 0; // Set alpha to transparent
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setResultUrl(canvas.toDataURL('image/png'));
    setIsProcessing(false);
  };

  const handleApplySettings = () => {
    if (!originalUrl) return;
    const img = new Image();
    img.src = originalUrl;
    img.onload = () => processBackgroundRemoval(img, targetColor, tolerance);
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = 'transparent-background.png';
    a.click();
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="dropzone cursor-pointer rounded-2xl p-12 text-center transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 mb-4">
            <Wand2 className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Upload Image to Remove Background</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Isolate backdrop color and output transparent PNG
          </p>
          <span className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl bg-purple-600 text-white shadow-sm hover:bg-purple-700 transition">
            Select Photo
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Settings */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-6">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Key Backdrop Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={targetColor}
                    onChange={(e) => setTargetColor(e.target.value)}
                    className="h-9 w-12 rounded cursor-pointer border border-slate-200 dark:border-slate-700"
                  />
                  <span className="text-xs font-mono">{targetColor}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Color Threshold ({tolerance})</label>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-36 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            </div>

            <button
              onClick={handleApplySettings}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition"
            >
              <Wand2 className="h-3.5 w-3.5" /> Re-apply Removal
            </button>
          </div>

          {/* Results grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Original Image</span>
              <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-xl flex items-center justify-center min-h-[260px] flex-1">
                {originalUrl && <img src={originalUrl} alt="Original" className="max-h-[300px] object-contain rounded" />}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Transparent Output</span>
              <div
                className="p-2 rounded-xl flex items-center justify-center min-h-[260px] flex-1 border border-slate-200 dark:border-slate-800"
                style={{
                  backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 0)',
                  backgroundSize: '12px 12px'
                }}
              >
                {isProcessing ? (
                  <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
                ) : resultUrl ? (
                  <img src={resultUrl} alt="Transparent Result" className="max-h-[300px] object-contain" />
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => { setFile(null); setResultUrl(null); }}
              className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Select Another Image
            </button>

            <button
              onClick={handleDownload}
              disabled={!resultUrl || isProcessing}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-purple-600 text-white shadow-md hover:bg-purple-700 disabled:opacity-50 transition"
            >
              <Download className="h-4 w-4" /> Download Transparent PNG
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
