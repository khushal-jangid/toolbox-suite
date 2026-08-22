import { downloadFile } from "../../utils/fileDownloader";
import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Download, Copy, Check, RefreshCw, CheckCircle2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import confetti from 'canvas-confetti';

export default function PdfToWordTool() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
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
      alert('Please select a valid PDF file.');
      return;
    }
    setFile(selectedFile);
    setExtractedText('');
    setIsProcessing(true);
    setProgress('Loading PDF document...');

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      let fullText = '';

      for (let i = 1; i <= numPages; i++) {
        setProgress(`Extracting text from page ${i} of ${numPages}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        let lastY = null;
        let pageText = '';
        textContent.items.forEach(item => {
          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
            pageText += '\n';
          } else if (pageText && !pageText.endsWith(' ')) {
            pageText += ' ';
          }
          pageText += item.str;
          lastY = item.transform[5];
        });

        fullText += `--- PAGE ${i} ---\n\n` + pageText.trim() + '\n\n';
      }

      setExtractedText(fullText.trim());
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      console.error('PDF to Word extraction error:', err);
      alert('Failed to extract text from PDF: ' + err.message);
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  };

  const downloadDocFile = () => {
    if (!extractedText) return;
    const baseName = file?.name.replace('.pdf', '') || 'document';
    
    // Create standard MS Word compatible HTML/DOC blob
    const docHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${baseName}</title>
        <style>
          body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; margin: 40px; color: #222; }
          h2 { color: #3525cd; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-top: 24px; }
          p { margin-bottom: 12px; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        ${extractedText.split('--- PAGE ').filter(Boolean).map(chunk => {
          const lines = chunk.split('\n\n');
          const pageNum = lines[0].replace(' ---', '');
          const content = lines.slice(1).join('\n\n');
          return `<h2>Page ${pageNum}</h2><p>${content.replace(/\n/g, '<br>')}</p>`;
        }).join('')}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + docHtml], { type: 'application/msword;charset=utf-8' });
    downloadFile(blob, `${baseName}.doc`, 'application/msword');
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
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-600 p-12 rounded-3xl text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/40 space-y-3"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
          <div className="w-16 h-16 bg-indigo-500/10 text-[#3525cd] dark:text-[#c3c0ff] rounded-2xl flex items-center justify-center mx-auto">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload PDF to Convert to Word (.doc)</h3>
            <p className="text-xs text-slate-500 mt-1">Extract text, structure, and paragraphs into editable Microsoft Word document</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#3525cd] text-white text-xs font-bold rounded-xl shadow-sm">
            <Upload className="h-3.5 w-3.5" /> Select PDF Document
          </span>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Header Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="space-y-0.5 truncate max-w-sm">
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
                onClick={downloadDocFile}
                disabled={!extractedText || isProcessing}
                className="px-4 py-1.5 bg-[#3525cd] hover:bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" /> Download .DOC
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
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Extracted Editable Document Text
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
