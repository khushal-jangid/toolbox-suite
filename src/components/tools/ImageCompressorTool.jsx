import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, Sliders, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ImageCompressorTool() {
  const [file, setFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(80);
  const [scale, setScale] = useState(100);
  const [format, setFormat] = useState('image/jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile || !selectedFile.type.startsWith('image/')) return;
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    
    const url = URL.createObjectURL(selectedFile);
    setOriginalUrl(url);
    compressImage(selectedFile, quality, scale, format);
  };

  const compressImage = (imgFile, q, s, fmt) => {
    if (!imgFile) return;
    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.readAsDataURL(imgFile);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const targetWidth = Math.round((img.width * s) / 100);
        const targetHeight = Math.round((img.height * s) / 100);
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCompressedSize(blob.size);
              const compressedObjUrl = URL.createObjectURL(blob);
              setCompressedUrl(compressedObjUrl);
            }
            setIsProcessing(false);
          },
          fmt,
          q / 100
        );
      };
    };
  };

  const handleQualityChange = (newQuality) => {
    setQuality(newQuality);
    if (file) compressImage(file, newQuality, scale, format);
  };

  const handleScaleChange = (newScale) => {
    setScale(newScale);
    if (file) compressImage(file, quality, newScale, format);
  };

  const handleFormatChange = (newFormat) => {
    setFormat(newFormat);
    if (file) compressImage(file, quality, scale, newFormat);
  };

  const handleDownload = () => {
    if (!compressedUrl) return;
    const a = document.createElement('a');
    a.href = compressedUrl;
    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `${nameWithoutExt}-compressed.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const savedPercent = originalSize > 0 && compressedSize > 0
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileSelect(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`dropzone cursor-pointer rounded-2xl p-12 text-center transition-all ${
            dragActive ? 'active' : ''
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-4">
            <Upload className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Click or drag & drop image here</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Supports JPG, PNG, and WebP up to 50MB
          </p>
          <span className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 transition">
            Choose Image File
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                Quality: {quality}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => handleQualityChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                Resize Scale: {scale}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={scale}
                onChange={(e) => handleScaleChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                Output Format
              </label>
              <select
                value={format}
                onChange={(e) => handleFormatChange(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="image/jpeg">JPG (Best for photos)</option>
                <option value="image/webp">WebP (Modern compressed)</option>
                <option value="image/png">PNG (Lossless)</option>
              </select>
            </div>
          </div>

          {/* Side by side preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Card */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Original Image</span>
                <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {formatBytes(originalSize)}
                </span>
              </div>
              <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-2 min-h-[220px]">
                {originalUrl && (
                  <img src={originalUrl} alt="Original preview" className="max-h-[300px] object-contain rounded" />
                )}
              </div>
            </div>

            {/* Compressed Card */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Compressed</span>
                  {savedPercent > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
                      -{savedPercent}% Saved
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  {formatBytes(compressedSize)}
                </span>
              </div>

              <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-2 min-h-[220px]">
                {isProcessing ? (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <RefreshCw className="h-5 w-5 animate-spin text-indigo-600" />
                    Compressing...
                  </div>
                ) : compressedUrl ? (
                  <img src={compressedUrl} alt="Compressed preview" className="max-h-[300px] object-contain rounded" />
                ) : null}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <button
              onClick={() => {
                setFile(null);
                setOriginalUrl(null);
                setCompressedUrl(null);
              }}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Compress Another Image
            </button>

            <button
              onClick={handleDownload}
              disabled={!compressedUrl || isProcessing}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-indigo-600 text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              <Download className="h-4 w-4" />
              Download Compressed Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
