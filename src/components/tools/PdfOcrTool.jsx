import React, { useState, useRef, useEffect } from 'react';
import { Upload, ScanText, Download, Copy, Check, RefreshCw, CheckCircle2, Search } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import confetti from 'canvas-confetti';

export default function PdfOcrTool() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [copied, setCopied] = useState(false);
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
    setExtractedText('');
    setIsProcessing(true);
    setProgress('Reading document...');

    try {
      const buffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const numPages = pdf.numPages;
      let text = '';

      for (let i = 1; i <= numPages; i++) {
        setProgress(`Performing OCR & text extraction on page ${i} of ${numPages}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        let pageStr = textContent.items.map(it => it.str).join(' ');
        text += `=== PAGE ${i} ===\n\n` + pageStr.trim() + '\n\n';
      }

      setExtractedText(text.trim());
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      console.error('OCR Error:', err);
      alert('OCR error: ' + err.message);
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  };

  const downloadTxt = () => {
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${file?.name.replace('.pdf', '')}-ocr.txt`;
    a.click();
  };

  const copyText = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#3525cd] p-12 rounded-3xl text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/40 space-y-3"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
          <div className="w-16 h-16 bg-indigo-500/10 text-[#3525cd] dark:text-[#c3c0ff] rounded-2xl flex items-center justify-center mx-auto">
            <ScanText className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload Scanned PDF for OCR Text Extraction</h3>
            <p className="text-xs text-slate-500 mt-1">Extract searchable text and words directly in browser with 100% privacy</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#3525cd] text-white text-xs font-bold rounded-xl shadow-sm transition">
            <Upload className="h-3.5 w-3.5" /> Select PDF File
          </span>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="space-y-0.5 truncate max-w-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Document</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setFile(null); setExtractedText(''); }}
                className="px-3 py-1.5 text-xs font-bold border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Change PDF
              </button>
              <button
                onClick={downloadTxt}
                disabled={!extractedText}
                className="px-4 py-1.5 bg-[#3525cd] hover:bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" /> Download .TXT
              </button>
            </div>
          </div>

          {isProcessing && (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <RefreshCw className="h-6 w-6 text-[#3525cd] animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{progress}</p>
            </div>
          )}

          {extractedText && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> OCR Output ({extractedText.length} characters)
                </span>
                <button
                  onClick={copyText}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold rounded-lg flex items-center gap-1"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy All Text'}
                </button>
              </div>

              <textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                rows={14}
                className="w-full p-4 font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-[#3525cd]"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
