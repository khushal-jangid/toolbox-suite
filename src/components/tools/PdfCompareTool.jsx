import { downloadFile } from "../../utils/fileDownloader";
import React, { useState, useRef, useEffect } from 'react';
import { Upload, GitCompare, RefreshCw, CheckCircle2, ArrowRight, FileText } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

export default function PdfCompareTool() {
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [isComparing, setIsComparing] = useState(false);
  const [progress, setProgress] = useState('');

  const fileInputARef = useRef(null);
  const fileInputBRef = useRef(null);

  useEffect(() => {
    try {
      if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
      }
    } catch (e) {
      console.warn('PDF.js init:', e);
    }
  }, []);

  const extractDocText = async (file) => {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    let full = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      full += `--- Page ${i} ---\n` + content.items.map(it => it.str).join(' ') + '\n\n';
    }
    return full.trim();
  };

  const handleCompare = async () => {
    if (!fileA || !fileB) {
      alert('Please upload both PDF files to compare.');
      return;
    }
    setIsComparing(true);
    setProgress('Reading Document A...');
    try {
      const tA = await extractDocText(fileA);
      setTextA(tA);
      setProgress('Reading Document B...');
      const tB = await extractDocText(fileB);
      setTextB(tB);
    } catch (err) {
      console.error('Compare error:', err);
      alert('Error extracting text: ' + err.message);
    } finally {
      setIsComparing(false);
      setProgress('');
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Upload Dual Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Document A */}
        <div
          onClick={() => fileInputARef.current?.click()}
          className={`p-6 border-2 border-dashed rounded-3xl text-center cursor-pointer transition ${fileA ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:border-[#3525cd]'}`}
        >
          <input
            ref={fileInputARef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && setFileA(e.target.files[0])}
          />
          <div className="w-12 h-12 bg-indigo-500/10 text-[#3525cd] rounded-2xl flex items-center justify-center mx-auto mb-2">
            <FileText className="h-6 w-6" />
          </div>
          <span className="text-xs font-black uppercase text-[#3525cd] block">Original Document (PDF A)</span>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 truncate">
            {fileA ? fileA.name : 'Click to select first PDF'}
          </p>
        </div>

        {/* Document B */}
        <div
          onClick={() => fileInputBRef.current?.click()}
          className={`p-6 border-2 border-dashed rounded-3xl text-center cursor-pointer transition ${fileB ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:border-emerald-600]'}`}
        >
          <input
            ref={fileInputBRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && setFileB(e.target.files[0])}
          />
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <FileText className="h-6 w-6" />
          </div>
          <span className="text-xs font-black uppercase text-emerald-600 block">Revised Document (PDF B)</span>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 truncate">
            {fileB ? fileB.name : 'Click to select second PDF'}
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleCompare}
          disabled={!fileA || !fileB || isComparing}
          className="flex items-center gap-2 px-8 py-3 bg-[#3525cd] hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
        >
          {isComparing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <GitCompare className="h-4 w-4" />}
          Compare PDF Documents Side-by-Side
        </button>
      </div>

      {isComparing && (
        <div className="p-6 text-center bg-white dark:bg-slate-900 rounded-2xl border text-xs font-bold text-slate-500">
          {progress}
        </div>
      )}

      {/* Side-by-Side Result */}
      {(textA || textB) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Comparison Content Output
            </span>
            <button
              type="button"
              onClick={() => {
                const report = `PDF COMPARISON REPORT\n====================\n\n[DOCUMENT A: ${fileA?.name}]\n${textA}\n\n====================\n\n[DOCUMENT B: ${fileB?.name}]\n${textB}`;
                const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
                downloadFile(blob, `pdf-comparison-${fileA?.name.replace('.pdf', '')}-vs-${fileB?.name.replace('.pdf', '')}.txt`, 'text/plain');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition"
            >
              Download Report (.txt)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
              <span className="text-xs font-black text-indigo-600 block truncate">PDF A: {fileA?.name}</span>
              <textarea
                readOnly
                value={textA}
                rows={16}
                className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-950 border rounded-xl"
              />
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
              <span className="text-xs font-black text-emerald-600 block truncate">PDF B: {fileB?.name}</span>
              <textarea
                readOnly
                value={textB}
                rows={16}
                className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-950 border rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
