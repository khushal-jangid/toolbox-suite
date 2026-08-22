import React, { useState, useRef } from 'react';
import { Upload, ArrowRightLeft, Download, RefreshCw, CheckCircle2, Sliders, Trash2 } from 'lucide-react';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';

export default function ImageConverterTool() {
  const [images, setImages] = useState([]);
  const [targetFormat, setTargetFormat] = useState('image/png'); // 'image/png', 'image/jpeg', 'image/webp'
  const [quality, setQuality] = useState(90);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedList, setConvertedList] = useState([]);
  const fileInputRef = useRef(null);

  const formatExtensions = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp'
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;

    const items = files.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type
    }));

    setImages(prev => [...prev, ...items]);
    setConvertedList([]);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
    setConvertedList([]);
  };

  const handleConvertAll = async () => {
    if (images.length === 0) return;
    setIsConverting(true);
    setConvertedList([]);

    const results = [];

    for (const item of images) {
      const res = await new Promise((resolve) => {
        const img = new Image();
        img.src = item.url;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');

          // If converting to JPEG, fill white background for transparency
          if (targetFormat === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          ctx.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            if (blob) {
              const ext = formatExtensions[targetFormat];
              const baseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
              const newName = `${baseName}.${ext}`;
              resolve({
                id: item.id,
                name: newName,
                blob,
                url: URL.createObjectURL(blob),
                size: blob.size
              });
            } else {
              resolve(null);
            }
          }, targetFormat, quality / 100);
        };
      });

      if (res) results.push(res);
    }

    setConvertedList(results);
    setIsConverting(false);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
  };

  const downloadAllAsZip = async () => {
    if (convertedList.length === 0) return;
    const zip = new JSZip();
    convertedList.forEach(item => {
      zip.file(item.name, item.blob);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `converted-images-${formatExtensions[targetFormat]}.zip`;
    a.click();
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 text-left">
      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 p-10 rounded-2xl text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/40 space-y-3"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
          <ArrowRightLeft className="h-7 w-7" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Upload Images to Convert</h3>
          <p className="text-xs text-slate-500 mt-1">Convert between PNG, JPG, and WebP with zero quality loss</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm">
          Select Photos
        </span>
      </div>

      {images.length > 0 && (
        <div className="space-y-6">
          {/* Settings Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Target Output Format</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'PNG', mime: 'image/png' },
                  { label: 'JPG / JPEG', mime: 'image/jpeg' },
                  { label: 'WebP', mime: 'image/webp' }
                ].map(fmt => (
                  <button
                    key={fmt.mime}
                    onClick={() => { setTargetFormat(fmt.mime); setConvertedList([]); }}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      targetFormat === fmt.mime
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-500">Output Quality</label>
                <span className="text-xs font-mono font-bold text-emerald-600">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                disabled={targetFormat === 'image/png'}
                className="w-full accent-emerald-600 disabled:opacity-40"
              />
              <span className="text-[10px] text-slate-400">
                {targetFormat === 'image/png' ? 'PNG format uses lossless compression' : 'Adjust compression vs quality balance'}
              </span>
            </div>
          </div>

          {/* Action Row */}
          {convertedList.length === 0 ? (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-slate-500">
                {images.length} images queued for conversion to <strong>{formatExtensions[targetFormat].toUpperCase()}</strong>
              </span>
              <button
                onClick={handleConvertAll}
                disabled={isConverting}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
              >
                {isConverting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ArrowRightLeft className="h-4 w-4" />}
                Convert {images.length} Photos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> All {convertedList.length} images converted successfully!
                </span>
                {convertedList.length > 1 && (
                  <button
                    onClick={downloadAllAsZip}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" /> Download All as ZIP
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {convertedList.map(item => (
                  <div
                    key={item.id}
                    className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between"
                  >
                    <div className="h-28 bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-1 mb-2">
                      <img src={item.url} alt={item.name} className="max-h-full max-w-full object-contain rounded" />
                    </div>
                    <div className="space-y-2">
                      <div className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                        {item.name}
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-mono">{formatBytes(item.size)}</span>
                        <a
                          href={item.url}
                          download={item.name}
                          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-lg font-bold transition flex items-center gap-1 text-xs"
                        >
                          <Download className="h-3.5 w-3.5" /> Save
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
