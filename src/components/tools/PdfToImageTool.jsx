import { downloadFile } from "../../utils/fileDownloader";
import React, { useState, useRef } from 'react';
import { Upload, FileImage, Download, RefreshCw, Check, Layers } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';

export default function PdfToImageTool() {
  const [file, setFile] = useState(null);

  React.useEffect(() => {
    try {
      if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
      }
    } catch (e) {
      console.warn('PDF.js worker init:', e);
    }
  }, []);
  const [pages, setPages] = useState([]);
  const [format, setFormat] = useState('image/png');
  const [scale, setScale] = useState(1.5);
  const [isRendering, setIsRendering] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile || selectedFile.type !== 'application/pdf') return;
    setFile(selectedFile);
    renderPdfPages(selectedFile, format, scale);
  };

  const renderPdfPages = async (pdfFile, outputFmt, scaleFactor) => {
    setIsRendering(true);
    setPages([]);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      const renderedPages = [];

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: scaleFactor });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        const dataUrl = canvas.toDataURL(outputFmt);

        renderedPages.push({
          pageNum,
          dataUrl,
          width: viewport.width,
          height: viewport.height
        });
      }

      setPages(renderedPages);
    } catch (err) {
      console.error('Error rendering PDF:', err);
      alert('Could not render PDF pages: ' + err.message);
    } finally {
      setIsRendering(false);
    }
  };

  const handleDownloadPage = (page) => {
    const ext = format === 'image/png' ? 'png' : 'jpg';
    downloadFile(page.dataUrl, `${file.name.replace('.pdf', '')}-page-${page.pageNum}.${ext}`, `image/${ext === 'png' ? 'png' : 'jpeg'}`);
  };

  const handleDownloadAllZip = async () => {
    if (pages.length === 0) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const ext = format === 'image/png' ? 'png' : 'jpg';
      const baseName = file.name.replace('.pdf', '');

      pages.forEach((p) => {
        const base64Data = p.dataUrl.split(',')[1];
        zip.file(`${baseName}-page-${p.pageNum}.${ext}`, base64Data, { base64: true });
      });

      const content = await zip.generateAsync({ type: 'blob' });
      downloadFile(content, `${baseName}-images.zip`, 'application/zip');
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
    } catch (err) {
      alert('Error building ZIP file: ' + err.message);
    } finally {
      setIsZipping(false);
    }
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
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 mb-4">
            <FileImage className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Upload PDF File to Convert to Images</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Extract every PDF page as high quality PNG or JPG image
          </p>
          <span className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl bg-rose-600 text-white shadow-sm hover:bg-rose-700 transition">
            Choose PDF File
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls header */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                  Image Format
                </label>
                <select
                  value={format}
                  onChange={(e) => {
                    setFormat(e.target.value);
                    if (file) renderPdfPages(file, e.target.value, scale);
                  }}
                  className="px-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                >
                  <option value="image/png">PNG (High Quality)</option>
                  <option value="image/jpeg">JPG (Compressed)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                  Quality Scale
                </label>
                <select
                  value={scale}
                  onChange={(e) => {
                    const newScale = Number(e.target.value);
                    setScale(newScale);
                    if (file) renderPdfPages(file, format, newScale);
                  }}
                  className="px-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                >
                  <option value="1">Standard (1x DPI)</option>
                  <option value="1.5">HD Quality (1.5x DPI)</option>
                  <option value="2">Ultra HD (2x DPI)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => { setFile(null); setPages([]); }}
                className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Choose Another PDF
              </button>
              <button
                onClick={handleDownloadAllZip}
                disabled={pages.length === 0 || isRendering || isZipping}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-rose-600 text-white shadow-md hover:bg-rose-700 disabled:opacity-50 transition"
              >
                {isZipping ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Layers className="h-4 w-4" />}
                Download All Pages (.ZIP)
              </button>
            </div>
          </div>

          {/* Rendered pages grid */}
          {isRendering ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <RefreshCw className="h-8 w-8 animate-spin text-rose-600 mx-auto mb-3" />
              <p className="text-sm font-semibold">Rendering PDF pages into images...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {pages.map((page) => (
                <div
                  key={page.pageNum}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                >
                  <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-xl overflow-hidden mb-3 flex items-center justify-center min-h-[220px]">
                    <img src={page.dataUrl} alt={`Page ${page.pageNum}`} className="max-h-[260px] object-contain rounded shadow-sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Page {page.pageNum} of {pages.length}
                    </span>
                    <button
                      onClick={() => handleDownloadPage(page)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Save Image
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
