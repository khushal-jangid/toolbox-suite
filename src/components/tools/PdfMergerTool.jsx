import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, Trash2, ArrowUp, ArrowDown, RefreshCw, CheckCircle2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';

export default function PdfMergerTool() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFilesSelect = async (selectedFiles) => {
    const validPdfs = Array.from(selectedFiles).filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    
    const processedFiles = await Promise.all(
      validPdfs.map(async (file) => {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
          return {
            id: Math.random().toString(36).substring(2, 9),
            file,
            pageCount: pdfDoc.getPageCount(),
            size: file.size
          };
        } catch (err) {
          return {
            id: Math.random().toString(36).substring(2, 9),
            file,
            pageCount: '?',
            size: file.size
          };
        }
      })
    );

    setFiles(prev => [...prev, ...processedFiles]);
    setMergedPdfUrl(null);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(item => item.id !== id));
    setMergedPdfUrl(null);
  };

  const moveFile = (index, direction) => {
    const newFiles = [...files];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;
    
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIndex];
    newFiles[targetIndex] = temp;
    
    setFiles(newFiles);
    setMergedPdfUrl(null);
  };

  const mergePdfs = async () => {
    if (files.length < 1) return;
    setIsProcessing(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const fileBuffer = await item.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
    } catch (err) {
      alert('Error merging PDFs: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalPages = files.reduce((acc, curr) => acc + (typeof curr.pageCount === 'number' ? curr.pageCount : 0), 0);

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="dropzone cursor-pointer rounded-2xl p-8 text-center transition-all"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFilesSelect(e.target.files)}
        />
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 mb-3">
          <Upload className="h-7 w-7" />
        </div>
        <h3 className="text-base font-semibold mb-1">Upload PDF Files to Merge</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          Select multiple PDFs or drag & drop them here
        </p>
        <span className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 text-white shadow-sm hover:bg-rose-700 transition">
          Browse PDF Files
        </span>
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Selected Files ({files.length}) • Total Pages: {totalPages}
            </span>
            <button
              onClick={() => setFiles([])}
              className="text-xs text-rose-600 hover:underline font-medium"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            {files.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 font-bold text-xs">
                    {index + 1}
                  </span>
                  <FileText className="h-5 w-5 shrink-0 text-slate-400" />
                  <div className="truncate">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      {item.file.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.pageCount} pages • {formatBytes(item.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveFile(index, -1)}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveFile(index, 1)}
                    disabled={index === files.length - 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeFile(item.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                    title="Remove File"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Merge & Download Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {!mergedPdfUrl ? (
              <button
                onClick={mergePdfs}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-rose-600 text-white shadow-md hover:bg-rose-700 disabled:opacity-50 transition"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Merging PDFs...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Merge {files.length} PDF Documents
                  </>
                )}
              </button>
            ) : (
              <a
                href={mergedPdfUrl}
                download="merged-document.pdf"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-emerald-600 text-white shadow-md hover:bg-emerald-700 transition"
              >
                <Download className="h-4 w-4" />
                Download Merged PDF
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
