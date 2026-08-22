import { downloadFile } from "../../utils/fileDownloader";
import React, { useState, useRef, useEffect } from 'react';
import { Crop, Upload, Download, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, RefreshCw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ImageCropperTool() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageName, setImageName] = useState('image');
  const [aspectRatio, setAspectRatio] = useState('free'); // 'free', '1:1', '16:9', '4:3', '9:16', '3:2'
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  // Crop rectangle in normalized [0, 1] relative coordinates
  const [crop, setCrop] = useState({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeHandle, setActiveHandle] = useState(null); // 'move', 'nw', 'ne', 'sw', 'se'

  const [croppedUrl, setCroppedUrl] = useState(null);
  const [cropDimensions, setCropDimensions] = useState({ width: 0, height: 0 });

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageName(file.name.substring(0, file.name.lastIndexOf('.')) || 'cropped-image');
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setCroppedUrl(null);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setCrop({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 });
    };
    reader.readAsDataURL(file);
  };

  // Adjust crop box when aspect ratio changes
  useEffect(() => {
    if (aspectRatio === 'free') return;
    const [rw, rh] = aspectRatio.split(':').map(Number);
    const ratio = rw / rh;

    setCrop(prev => {
      let newW = prev.width;
      let newH = newW / ratio;
      if (newH > 0.9) {
        newH = 0.9;
        newW = newH * ratio;
      }
      return {
        x: Math.max(0, Math.min(1 - newW, prev.x)),
        y: Math.max(0, Math.min(1 - newH, prev.y)),
        width: Math.min(1, newW),
        height: Math.min(1, newH)
      };
    });
  }, [aspectRatio]);

  // Render canvas with image and crop overlay
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.src = imageSrc;
    imgRef.current = img;

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const isRotated90 = rotation === 90 || rotation === 270;
      const naturalW = isRotated90 ? img.naturalHeight : img.naturalWidth;
      const naturalH = isRotated90 ? img.naturalWidth : img.naturalHeight;

      // Fit to container width (max 600px)
      const displayWidth = Math.min(600, window.innerWidth - 60);
      const scale = displayWidth / naturalW;
      const displayHeight = naturalH * scale;

      canvas.width = displayWidth;
      canvas.height = displayHeight;

      // Draw transformed image
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      const drawW = isRotated90 ? displayHeight : displayWidth;
      const drawH = isRotated90 ? displayWidth : displayHeight;
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Draw Dimmed overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Clear Crop Box
      const cx = crop.x * canvas.width;
      const cy = crop.y * canvas.height;
      const cw = crop.width * canvas.width;
      const ch = crop.height * canvas.height;

      ctx.clearRect(cx, cy, cw, ch);

      // Re-draw clean image inside crop box
      ctx.save();
      ctx.beginPath();
      ctx.rect(cx, cy, cw, ch);
      ctx.clip();

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Draw Crop Box Border and Grid lines (Rule of Thirds)
      ctx.strokeStyle = '#3525cd';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx, cy, cw, ch);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      // Thirds lines
      ctx.beginPath();
      ctx.moveTo(cx + cw / 3, cy);
      ctx.lineTo(cx + cw / 3, cy + ch);
      ctx.moveTo(cx + (cw * 2) / 3, cy);
      ctx.lineTo(cx + (cw * 2) / 3, cy + ch);
      ctx.moveTo(cx, cy + ch / 3);
      ctx.lineTo(cx + cw, cy + ch / 3);
      ctx.moveTo(cx, cy + (ch * 2) / 3);
      ctx.lineTo(cx + cw, cy + (ch * 2) / 3);
      ctx.stroke();

      // Corner handles
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#3525cd';
      ctx.lineWidth = 2;
      const handleSize = 8;
      const corners = [
        [cx, cy],
        [cx + cw, cy],
        [cx, cy + ch],
        [cx + cw, cy + ch]
      ];
      corners.forEach(([hx, hy]) => {
        ctx.fillRect(hx - handleSize / 2, hy - handleSize / 2, handleSize, handleSize);
        ctx.strokeRect(hx - handleSize / 2, hy - handleSize / 2, handleSize, handleSize);
      });

      // Calculate actual pixel dimensions
      setCropDimensions({
        width: Math.round(crop.width * naturalW),
        height: Math.round(crop.height * naturalH)
      });
    };
  }, [imageSrc, rotation, flipH, flipV, crop]);

  // Mouse / Touch handlers for dragging and resizing
  const getCanvasPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height
    };
  };

  const handleMouseDown = (e) => {
    const pos = getCanvasPos(e);
    const cx = crop.x;
    const cy = crop.y;
    const cw = crop.width;
    const ch = crop.height;
    const threshold = 0.08;

    if (Math.abs(pos.x - (cx + cw)) < threshold && Math.abs(pos.y - (cy + ch)) < threshold) {
      setActiveHandle('se');
    } else if (pos.x >= cx && pos.x <= cx + cw && pos.y >= cy && pos.y <= cy + ch) {
      setActiveHandle('move');
    } else {
      return;
    }

    setIsDragging(true);
    setDragStart(pos);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const pos = getCanvasPos(e);
    const dx = pos.x - dragStart.x;
    const dy = pos.y - dragStart.y;

    if (activeHandle === 'move') {
      setCrop(prev => ({
        ...prev,
        x: Math.max(0, Math.min(1 - prev.width, prev.x + dx)),
        y: Math.max(0, Math.min(1 - prev.height, prev.y + dy))
      }));
    } else if (activeHandle === 'se') {
      setCrop(prev => {
        let newW = Math.max(0.1, Math.min(1 - prev.x, prev.width + dx));
        let newH = Math.max(0.1, Math.min(1 - prev.y, prev.height + dy));
        if (aspectRatio !== 'free') {
          const [rw, rh] = aspectRatio.split(':').map(Number);
          newH = newW / (rw / rh);
        }
        return { ...prev, width: newW, height: newH };
      });
    }
    setDragStart(pos);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveHandle(null);
  };

  // Perform Final Crop Export
  const executeCrop = () => {
    const img = imgRef.current;
    if (!img) return;

    const isRotated90 = rotation === 90 || rotation === 270;
    const naturalW = isRotated90 ? img.naturalHeight : img.naturalWidth;
    const naturalH = isRotated90 ? img.naturalWidth : img.naturalHeight;

    // Create intermediate rotated canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = naturalW;
    tempCanvas.height = naturalH;
    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.save();
    tempCtx.translate(naturalW / 2, naturalH / 2);
    tempCtx.rotate((rotation * Math.PI) / 180);
    tempCtx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    const drawW = isRotated90 ? naturalH : naturalW;
    const drawH = isRotated90 ? naturalW : naturalH;
    tempCtx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    tempCtx.restore();

    // Crop from intermediate canvas
    const cropX = crop.x * naturalW;
    const cropY = crop.y * naturalH;
    const cropW = crop.width * naturalW;
    const cropH = crop.height * naturalH;

    const outCanvas = document.createElement('canvas');
    outCanvas.width = cropW;
    outCanvas.height = cropH;
    const outCtx = outCanvas.getContext('2d');

    outCtx.drawImage(tempCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

    const dataUrl = outCanvas.toDataURL('image/png');
    setCroppedUrl(dataUrl);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
  };

  return (
    <div className="space-y-6 text-left max-w-2xl mx-auto">
      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#3525cd] p-12 rounded-2xl text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/40 space-y-3"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <div className="w-16 h-16 bg-indigo-500/10 text-[#3525cd] dark:text-[#c3c0ff] rounded-2xl flex items-center justify-center mx-auto">
            <Crop className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload Image to Crop</h3>
            <p className="text-xs text-slate-500 mt-1">Preset aspect ratios (1:1, 16:9, 9:16) with rotation & flip</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#3525cd] text-white text-xs font-bold rounded-xl shadow-sm">
            <Upload className="h-3.5 w-3.5" /> Choose Photo
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
            {/* Aspect Ratio Buttons */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">Aspect Ratio</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Freeform', val: 'free' },
                  { label: '1:1 Square (DP)', val: '1:1' },
                  { label: '16:9 (YouTube)', val: '16:9' },
                  { label: '9:16 (Story/Reel)', val: '9:16' },
                  { label: '4:3 (Standard)', val: '4:3' },
                  { label: '3:2 (Photo)', val: '3:2' }
                ].map(r => (
                  <button
                    key={r.val}
                    onClick={() => setAspectRatio(r.val)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      aspectRatio === r.val
                        ? 'bg-[#3525cd] text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transform Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRotation(prev => (prev - 90 + 360) % 360)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                  title="Rotate Left 90°"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setRotation(prev => (prev + 90) % 360)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                  title="Rotate Right 90°"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setFlipH(!flipH)}
                  className={`p-2 rounded-xl transition ${flipH ? 'bg-[#3525cd] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                  title="Flip Horizontal"
                >
                  <FlipHorizontal className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setFlipV(!flipV)}
                  className={`p-2 rounded-xl transition ${flipV ? 'bg-[#3525cd] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                  title="Flip Vertical"
                >
                  <FlipVertical className="h-4 w-4" />
                </button>
              </div>

              <span className="text-xs font-mono font-bold text-slate-500">
                {cropDimensions.width} × {cropDimensions.height} px
              </span>
            </div>
          </div>

          {/* Interactive Canvas */}
          <div className="flex justify-center p-4 bg-slate-900 rounded-2xl overflow-hidden touch-none select-none">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
              className="cursor-crosshair max-w-full rounded shadow-xl"
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => { setImageSrc(null); setCroppedUrl(null); }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
            >
              Upload Different Photo
            </button>
            <button
              onClick={executeCrop}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#3525cd] hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              <Crop className="h-4 w-4" /> Crop & Preview
            </button>
          </div>

          {/* Cropped Output Result */}
          {croppedUrl && (
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Cropped Image Ready ({cropDimensions.width} × {cropDimensions.height} px)
                </span>
                <button type="button" onClick={(e) => { e.preventDefault(); downloadFile(croppedUrl, `${imageName}-cropped.png`, "image/png"); }}  
                  className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  <Download className="h-3.5 w-3.5" /> Download PNG
                </button>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl flex justify-center max-h-72 overflow-hidden">
                <img src={croppedUrl} alt="Cropped Result" className="max-h-64 object-contain rounded" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
