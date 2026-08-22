import { downloadFile } from "../../utils/fileDownloader";
import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, Download, RefreshCw, CheckCircle2, Table } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import confetti from 'canvas-confetti';

export default function ExcelToPdfTool() {
  const [csvText, setCsvText] = useState('Product, Category, Price, Stock, Rating\nMacBook Pro 16", Laptops, $2499, 45, 4.9\niPhone 16 Pro, Phones, $999, 120, 4.8\nSony WH-1000XM5, Audio, $399, 85, 4.7\nDell UltraSharp 32", Monitors, $799, 30, 4.6\nKeychron Q1 Pro, Keyboards, $199, 110, 4.9');
  const [tableTitle, setTableTitle] = useState('Inventory Report');
  const [orientation, setOrientation] = useState('landscape'); // 'landscape' or 'portrait'
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTableTitle(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvText(event.target.result || '');
      setPdfUrl(null);
    };
    reader.readAsText(file);
  };

  const generatePdf = async () => {
    if (!csvText.trim()) {
      alert('Please enter or upload CSV/Excel table data.');
      return;
    }
    setIsGenerating(true);

    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const isLand = orientation === 'landscape';
      const pageWidth = isLand ? 841.89 : 595.28;
      const pageHeight = isLand ? 595.28 : 841.89;
      const margin = 40;

      let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      let currentY = pageHeight - margin;

      // Draw Title
      currentPage.drawText(tableTitle, {
        x: margin,
        y: currentY - 15,
        size: 16,
        font: boldFont,
        color: rgb(0.1, 0.5, 0.3)
      });
      currentY -= 35;

      // Parse CSV rows
      const rawRows = csvText.split('\n').map(r => r.trim()).filter(Boolean);
      const rows = rawRows.map(r => r.split(',').map(c => c.trim().replace(/^"|"$/g, '')));

      if (rows.length === 0) throw new Error('No rows found.');

      const numCols = Math.max(...rows.map(r => r.length));
      const colWidth = (pageWidth - margin * 2) / numCols;
      const rowHeight = 22;

      rows.forEach((row, rIdx) => {
        if (currentY < margin + rowHeight) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          currentY = pageHeight - margin;
        }

        const isHeader = rIdx === 0;

        // Draw Row background
        if (isHeader) {
          currentPage.drawRectangle({
            x: margin,
            y: currentY - rowHeight + 5,
            width: pageWidth - margin * 2,
            height: rowHeight,
            color: rgb(0.9, 0.95, 0.92)
          });
        } else if (rIdx % 2 === 0) {
          currentPage.drawRectangle({
            x: margin,
            y: currentY - rowHeight + 5,
            width: pageWidth - margin * 2,
            height: rowHeight,
            color: rgb(0.97, 0.97, 0.98)
          });
        }

        // Draw Cells
        row.forEach((cell, cIdx) => {
          const truncated = cell.length > 25 ? cell.substring(0, 22) + '...' : cell;
          currentPage.drawText(truncated, {
            x: margin + cIdx * colWidth + 6,
            y: currentY - 10,
            size: isHeader ? 9 : 8.5,
            font: isHeader ? boldFont : font,
            color: isHeader ? rgb(0.1, 0.4, 0.2) : rgb(0.15, 0.15, 0.15)
          });
        });

        currentY -= rowHeight;
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      console.error('Excel to PDF error:', err);
      alert('Error creating PDF: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto">
      {/* Upload */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 p-8 rounded-2xl text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/40 space-y-2"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls,.tsv"
          className="hidden"
          onChange={handleFileUpload}
        />
        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center mx-auto">
          <FileSpreadsheet className="h-6 w-6" />
        </div>
        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Upload CSV / Spreadsheet or edit sample table below</p>
      </div>

      {/* Editor & Controls */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Spreadsheet Title</label>
            <input
              type="text"
              value={tableTitle}
              onChange={(e) => setTableTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Page Orientation</label>
            <div className="flex gap-2">
              <button
                onClick={() => setOrientation('landscape')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${orientation === 'landscape' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-slate-800'}`}
              >
                Landscape
              </button>
              <button
                onClick={() => setOrientation('portrait')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${orientation === 'portrait' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-slate-800'}`}
              >
                Portrait
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">CSV Table Data (Comma-separated)</label>
          <textarea
            rows={7}
            value={csvText}
            onChange={(e) => { setCsvText(e.target.value); setPdfUrl(null); }}
            className="w-full p-4 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={generatePdf}
            disabled={isGenerating || !csvText.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Generate PDF Spreadsheet
          </button>
        </div>
      </div>

      {/* Result */}
      {pdfUrl && (
        <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
            <CheckCircle2 className="h-4 w-4" /> PDF Table Document Ready!
          </div>
          <button type="button" onClick={(e) => { e.preventDefault(); downloadFile(pdfUrl, `${tableTitle}.pdf`, "application/pdf"); }}  
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Download PDF
          </button>
        </div>
      )}
    </div>
  );
}
