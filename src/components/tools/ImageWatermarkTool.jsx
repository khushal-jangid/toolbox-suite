import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Type, Sliders, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function ImageWatermarkTool() {
  const [imageSrc, setImageSrc] = useState(null);
  const [fileName, setFileName] = useState('');
  const [watermarkText, setWatermarkText] = useState('© Khushal Jangid');
  const [fontSize, setFontSize] = useState(36);
  const [opacity, setOpacity] = useState(0.6);
  const [color, setColor] = useState('#ffffff');
  const [position, setPosition] = useState('bottom-right'); // center, top-left, top-right, bottom-left, bottom-right

  const canvasRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Draw watermark text
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.font = `bold ${fontSize}px sans-serif`;

      const textMetrics = ctx.measureText(watermarkText);
      const textWidth = textMetrics.width;
      const padding = 30;

      let x = canvas.width / 2 - textWidth / 2;
      let y = canvas.height / 2;

      if (position === 'top-left') {
        x = padding;
        y = padding + fontSize;
      } else if (position === 'top-right') {
        x = canvas.width - textWidth - padding;
        y = padding + fontSize;
      } else if (position === 'bottom-left') {
        x = padding;
        y = canvas.height - padding;
      } else if (position === 'bottom-right') {
        x = canvas.width - textWidth - padding;
        y = canvas.height - padding;
      }

      ctx.fillText(watermarkText, x, y);
      ctx.restore();
    };
  }, [imageSrc, watermarkText, fontSize, opacity, color, position]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `watermarked_${fileName || 'image.png'}`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto text-left">
      {/* Upload Zone */}
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 p-6 rounded-2xl text-center space-y-3 bg-slate-50 dark:bg-slate-800/40">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
          id="watermark-file-input"
        />
        <label
          htmlFor="watermark-file-input"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#3525cd] text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-indigo-600 transition shadow-md"
        >
          <Upload className="h-4 w-4" /> Choose Photo to Watermark
        </label>
        {fileName && <p className="text-xs font-mono text-slate-500">Selected: {fileName}</p>}
      </div>

      {imageSrc && (
        <div className="space-y-6">
          {/* Watermark Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Watermark Text</label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none"
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
                <option value="center">Center</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Font Size ({fontSize}px)</label>
              <input
                type="range"
                min="12"
                max="120"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-full accent-[#3525cd]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Opacity ({Math.round(opacity * 100)}%)</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(e.target.value)}
                className="w-full accent-[#3525cd]"
              />
            </div>
          </div>

          {/* Live Canvas Preview */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase">Live Watermark Preview</span>
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center p-2">
              <canvas ref={canvasRef} className="max-w-full h-auto rounded-xl object-contain max-h-[350px]" />
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" /> Download Watermarked Photo (PNG)
          </button>
        </div>
      )}
    </div>
  );
}
