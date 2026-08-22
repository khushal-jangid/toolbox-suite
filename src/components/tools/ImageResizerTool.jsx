import React, { useState, useRef } from 'react';
import { Upload, Download, Scaling, Lock, Unlock, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ImageResizerTool() {
  const [file, setFile] = useState(null);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [targetWidth, setTargetWidth] = useState(0);
  const [targetHeight, setTargetHeight] = useState(0);
  const [aspectRatioLock, setAspectRatioLock] = useState(true);
  const [format, setFormat] = useState('image/png');
  const [resizedUrl, setResizedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile || !selectedFile.type.startsWith('image/')) return;
    setFile(selectedFile);

    const img = new Image();
    const url = URL.createObjectURL(selectedFile);
    img.src = url;
    img.onload = () => {
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setTargetWidth(img.width);
      setTargetHeight(img.height);
      processResize(selectedFile, img.width, img.height, format);
    };
  };

  const handleWidthChange = (val) => {
    const w = Math.max(1, Number(val));
    setTargetWidth(w);
    if (aspectRatioLock && originalWidth > 0) {
      const h = Math.round((w * originalHeight) / originalWidth);
      setTargetHeight(h);
      if (file) processResize(file, w, h, format);
    } else if (file) {
      processResize(file, w, targetHeight, format);
    }
  };

  const handleHeightChange = (val) => {
    const h = Math.max(1, Number(val));
    setTargetHeight(h);
    if (aspectRatioLock && originalHeight > 0) {
      const w = Math.round((h * originalWidth) / originalHeight);
      setTargetWidth(w);
      if (file) processResize(file, w, h, format);
    } else if (file) {
      processResize(file, targetWidth, h, format);
    }
  };

  const applyScalePreset = (percent) => {
    if (!originalWidth) return;
    const w = Math.round((originalWidth * percent) / 100);
    const h = Math.round((originalHeight * percent) / 100);
    setTargetWidth(w);
    setTargetHeight(h);
    if (file) processResize(file, w, h, format);
  };

  const processResize = (imgFile, w, h, fmt) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.readAsDataURL(imgFile);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        canvas.toBlob((blob) => {
          if (blob) {
            setResizedUrl(URL.createObjectURL(blob));
          }
          setIsProcessing(false);
        }, fmt, 0.9);
      };
    };
  };

  const handleDownload = () => {
    if (!resizedUrl) return;
    const a = document.createElement('a');
    a.href = resizedUrl;
    const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';
    a.download = `resized-${targetWidth}x${targetHeight}.${ext}`;
    a.click();
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
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
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mb-4">
            <Scaling className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Upload Image to Resize Dimensions</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Change width, height, aspect ratio, or scale preset
          </p>
          <span className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition">
            Choose Image
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Width (px)</label>
                  <input
                    type="number"
                    value={targetWidth}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    className="w-32 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => setAspectRatioLock(!aspectRatioLock)}
                  className={`self-end p-2.5 rounded-xl border transition ${
                    aspectRatioLock
                      ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 text-blue-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                  title={aspectRatioLock ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}
                >
                  {aspectRatioLock ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                </button>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Height (px)</label>
                  <input
                    type="number"
                    value={targetHeight}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    className="w-32 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Target Format</label>
                <select
                  value={format}
                  onChange={(e) => {
                    setFormat(e.target.value);
                    if (file) processResize(file, targetWidth, targetHeight, e.target.value);
                  }}
                  className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                >
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPG</option>
                  <option value="image/webp">WebP</option>
                </select>
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-medium mr-2">Quick Scale Presets:</span>
              {[25, 50, 75, 100].map((p) => (
                <button
                  key={p}
                  onClick={() => applyScalePreset(p)}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 transition"
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>

          {/* Resized Image Preview */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl flex items-center justify-center min-h-[300px] mb-4">
              {isProcessing ? (
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
              ) : resizedUrl ? (
                <img src={resizedUrl} alt="Resized" className="max-h-[360px] object-contain rounded" />
              ) : null}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => { setFile(null); setResizedUrl(null); }}
                className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Upload Different Image
              </button>

              <button
                onClick={handleDownload}
                disabled={!resizedUrl || isProcessing}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition"
              >
                <Download className="h-4 w-4" /> Download Resized Image ({targetWidth} x {targetHeight})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
