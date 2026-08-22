import { downloadFile } from "../../utils/fileDownloader";
import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileSpreadsheet, Download, Copy, Check, RefreshCw, CheckCircle2, Table } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import confetti from 'canvas-confetti';

export default function PdfToExcelTool() {
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
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
      alert('Please select a valid PDF file.');
      return;
    }
    setFile(selectedFile);
    setRows([]);
    setIsProcessing(true);
    setProgress('Reading PDF tables...');

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const parsedRows = [];

      for (let i = 1; i <= numPages; i++) {
        setProgress(`Analyzing tables on page ${i} of ${numPages}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // Group text items by Y coordinate (rows)
        const rowMap = new Map();
        textContent.items.forEach(item => {
          const y = Math.round(item.transform[5] / 4) * 4; // snap to 4px row grid
          if (!rowMap.has(y)) rowMap.set(y, []);
          rowMap.get(y).push({ x: item.transform[4], text: item.str.trim() });
        });

        // Sort rows top-to-bottom (higher Y to lower Y in PDF coordinates)
        const sortedYs = Array.from(rowMap.keys()).sort((a, b) => b - a);

        sortedYs.forEach(y => {
          const items = rowMap.get(y).filter(it => it.text);
          if (items.length === 0) return;
          // Sort columns left-to-right
          items.sort((a, b) => a.x - b.x);
          const cols = items.map(it => it.text);
          parsedRows.push(cols);
        });
      }

      setRows(parsedRows);
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      console.error('PDF to Excel error:', err);
      alert('Failed to parse tables: ' + err.message);
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  };

  const downloadCsv = () => {
    if (rows.length === 0) return;
    const baseName = file?.name.replace('.pdf', '') || 'spreadsheet';
    const csvContent = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `${baseName}.csv`, 'text/csv');
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-600 p-12 rounded-3xl text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/40 space-y-3"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
            <FileSpreadsheet className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload PDF to Convert to Excel (.csv / .xlsx)</h3>
            <p className="text-xs text-slate-500 mt-1">Extract structured table rows, columns, financials, and invoice data</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition">
            <Upload className="h-3.5 w-3.5" /> Select PDF Document
          </span>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="space-y-0.5 truncate max-w-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Target Document</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setFile(null); setRows([]); }}
                className="px-3 py-1.5 text-xs font-bold border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Change PDF
              </button>
              <button
                onClick={downloadCsv}
                disabled={rows.length === 0 || isProcessing}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" /> Download .CSV / Excel
              </button>
            </div>
          </div>

          {isProcessing && (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <RefreshCw className="h-6 w-6 text-emerald-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{progress}</p>
            </div>
          )}

          {rows.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Extracted Table Grid ({rows.length} rows detected)
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 max-h-96">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <tbody>
                    {rows.slice(0, 100).map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-2.5 text-slate-400 text-[10px] select-none bg-slate-50 dark:bg-slate-800/60 border-r w-10 text-center font-bold">
                          {rIdx + 1}
                        </td>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-2.5 text-slate-800 dark:text-slate-200 border-r border-slate-100 dark:border-slate-800/60">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
