import { downloadFile } from "../../utils/fileDownloader";
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Presentation, Download, RefreshCw, CheckCircle2, Layers } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';

export default function PdfToPptTool() {
  const [file, setFile] = useState(null);
  const [slides, setSlides] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
      }
    } catch (e) {
      console.warn('PDF.js init:', e);
    }
  }, []);

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile || !selectedFile.name.endsWith('.pdf')) {
      alert('Please select a valid PDF document.');
      return;
    }
    setFile(selectedFile);
    setSlides([]);
    setIsProcessing(true);
    setProgress('Converting PDF pages to slides...');

    try {
      const buffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const numPages = pdf.numPages;
      const renderedSlides = [];

      for (let i = 1; i <= numPages; i++) {
        setProgress(`Rendering slide ${i} of ${numPages}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        await page.render({ canvasContext: ctx, viewport }).promise;
        const dataUrl = canvas.toDataURL('image/png');

        renderedSlides.push({
          pageNumber: i,
          dataUrl,
          width: viewport.width,
          height: viewport.height
        });
      }

      setSlides(renderedSlides);
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      console.error('PDF to PPT error:', err);
      alert('Failed to convert slides: ' + err.message);
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  };

  const downloadAllSlidesZip = async () => {
    if (slides.length === 0) return;
    const zip = new JSZip();
    const baseName = file?.name.replace('.pdf', '') || 'presentation';

    slides.forEach((slide) => {
      const base64Data = slide.dataUrl.replace(/^data:image\/png;base64,/, '');
      zip.file(`slide-${slide.pageNumber}.png`, base64Data, { base64: true });
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    downloadFile(blob, `${baseName}-powerpoint-slides.zip`, 'application/zip');
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 p-12 rounded-3xl text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/40 space-y-3"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
          <div className="w-16 h-16 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <Presentation className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload PDF to Convert to PowerPoint Slides (.ppt)</h3>
            <p className="text-xs text-slate-500 mt-1">Extract high-resolution presentation slides ready for PowerPoint, Keynote & Google Slides</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition">
            <Upload className="h-3.5 w-3.5" /> Select PDF File
          </span>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="space-y-0.5 truncate max-w-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Presentation</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setFile(null); setSlides([]); }}
                className="px-3 py-1.5 text-xs font-bold border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Change PDF
              </button>
              <button
                onClick={downloadAllSlidesZip}
                disabled={slides.length === 0 || isProcessing}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" /> Download All Slides (ZIP)
              </button>
            </div>
          </div>

          {isProcessing && (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <RefreshCw className="h-6 w-6 text-amber-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{progress}</p>
            </div>
          )}

          {slides.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Generated Presentation Slides ({slides.length} slides)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {slides.map(slide => (
                  <div key={slide.pageNumber} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-2">
                    <div className="aspect-video bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100 dark:border-slate-800">
                      <img src={slide.dataUrl} alt={`Slide ${slide.pageNumber}`} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Slide #{slide.pageNumber}</span>
                      <button type="button" onClick={(e) => { e.preventDefault(); downloadFile(slide.dataUrl, `slide-${slide.pageNumber}.png`, "image/png"); }}  
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-amber-600 hover:text-white rounded-lg font-bold transition flex items-center gap-1 text-[11px]"
                      >
                        <Download className="h-3 w-3" /> Save Slide
                      </button>
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
