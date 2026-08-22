import { downloadFile } from "../../utils/fileDownloader";
import React, { useState, useRef } from 'react';
import { Upload, FileImage, Download, Trash2, ArrowUp, ArrowDown, RefreshCw, CheckCircle2, Sliders } from 'lucide-react';
import { PDFDocument, rgb } from 'pdf-lib';
import confetti from 'canvas-confetti';

export default function ImageToPdfTool() {
  const [images, setImages] = useState([]);
  const [pageSize, setPageSize] = useState('a4'); // 'a4', 'letter', 'fit'
  const [orientation, setOrientation] = useState('portrait'); // 'portrait', 'landscape', 'auto'
  const [margin, setMargin] = useState(20); // 0, 10, 20
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
    if (selectedFiles.length === 0) return;

    const newImages = selectedFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }));

    setImages(prev => [...prev, ...newImages]);
    setGeneratedPdfUrl(null);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
    setGeneratedPdfUrl(null);
  };

  const moveImage = (index, direction) => {
    const updated = [...images];
    const target = index + direction;
    if (target < 0 || target >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setImages(updated);
    setGeneratedPdfUrl(null);
  };

  const convertImageToPdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      const pdfDoc = await PDFDocument.create();

      // Page dimensions in points (72 pt = 1 inch)
      const A4_PORTRAIT = [595.28, 841.89];
      const A4_LANDSCAPE = [841.89, 595.28];
      const LETTER_PORTRAIT = [612.0, 792.0];
      const LETTER_LANDSCAPE = [792.0, 612.0];

      for (const item of images) {
        const file = item.file;
        const arrayBuffer = await file.arrayBuffer();
        
        let embeddedImage;
        if (file.type === 'image/png') {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          // For JPG, WebP, BMP, convert to JPG via canvas if needed
          try {
            embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
          } catch {
            const canvas = document.createElement('canvas');
            const img = new Image();
            img.src = item.url;
            await new Promise(r => { img.onload = r; });
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const jpgData = canvas.toDataURL('image/jpeg', 0.92);
            embeddedImage = await pdfDoc.embedJpg(jpgData);
          }
        }

        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;

        let pageWidth, pageHeight;

        if (pageSize === 'fit') {
          pageWidth = imgWidth + margin * 2;
          pageHeight = imgHeight + margin * 2;
        } else if (pageSize === 'letter') {
          const isLand = orientation === 'landscape' || (orientation === 'auto' && imgWidth > imgHeight);
          [pageWidth, pageHeight] = isLand ? LETTER_LANDSCAPE : LETTER_PORTRAIT;
        } else {
          // A4 default
          const isLand = orientation === 'landscape' || (orientation === 'auto' && imgWidth > imgHeight);
          [pageWidth, pageHeight] = isLand ? A4_LANDSCAPE : A4_PORTRAIT;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Calculate fitted image dimensions maintaining aspect ratio
        const maxWidth = pageWidth - margin * 2;
        const maxHeight = pageHeight - margin * 2;

        const widthRatio = maxWidth / imgWidth;
        const heightRatio = maxHeight / imgHeight;
        const bestRatio = Math.min(widthRatio, heightRatio, 1);

        const finalWidth = imgWidth * bestRatio;
        const finalHeight = imgHeight * bestRatio;

        // Center on page
        const x = (pageWidth - finalWidth) / 2;
        const y = (pageHeight - finalHeight) / 2;

        page.drawImage(embeddedImage, {
          x,
          y,
          width: finalWidth,
          height: finalHeight
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setGeneratedPdfUrl(url);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
    } catch (err) {
      console.error('Image to PDF error:', err);
      alert('Error generating PDF: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#3525cd] dark:hover:border-[#c3c0ff] p-10 rounded-2xl text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/40 space-y-3"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageSelect}
        />
        <div className="w-14 h-14 bg-indigo-500/10 text-[#3525cd] dark:text-[#c3c0ff] rounded-2xl flex items-center justify-center mx-auto">
          <FileImage className="h-7 w-7" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Upload Images to Convert to PDF</h3>
          <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WebP, BMP, and GIF</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3525cd] text-white text-xs font-bold rounded-xl shadow-sm">
          Select Photos
        </span>
      </div>

      {images.length > 0 && (
        <div className="space-y-6">
          {/* Options Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Page Size</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl text-xs font-bold"
              >
                <option value="a4">A4 (Standard Document)</option>
                <option value="letter">US Letter</option>
                <option value="fit">Fit to Image Dimensions</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Page Orientation</label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                disabled={pageSize === 'fit'}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl text-xs font-bold disabled:opacity-40"
              >
                <option value="auto">Auto (Match Image Aspect)</option>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Margin</label>
              <select
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl text-xs font-bold"
              >
                <option value={0}>No Margin (Edge-to-Edge)</option>
                <option value={10}>Small Margin (10px)</option>
                <option value={20}>Normal Margin (20px)</option>
              </select>
            </div>
          </div>

          {/* Selected Images Grid with reordering */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Pages Order ({images.length} photos)
              </span>
              <button
                onClick={() => setImages([])}
                className="text-xs font-bold text-rose-500 hover:underline"
              >
                Remove All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between"
                >
                  <div className="h-32 bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-1 mb-2">
                    <img src={img.url} alt={img.name} className="max-h-full max-w-full object-contain rounded" />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Page #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveImage(idx, -1)}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => moveImage(idx, 1)}
                        disabled={idx === images.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removeImage(img.id)}
                        className="p-1 text-rose-500 hover:bg-rose-500/10 rounded"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            {!generatedPdfUrl ? (
              <button
                onClick={convertImageToPdf}
                disabled={isGenerating}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#3525cd] hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
              >
                {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileImage className="h-4 w-4" />}
                Convert {images.length} Images to PDF
              </button>
            ) : (
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setGeneratedPdfUrl(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
                >
                  Edit Pages
                </button>
                <button type="button" onClick={(e) => { e.preventDefault(); downloadFile(generatedPdfUrl, "images-combined.pdf", "application/pdf"); }}  
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  <Download className="h-4 w-4" /> Download PDF Document
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
