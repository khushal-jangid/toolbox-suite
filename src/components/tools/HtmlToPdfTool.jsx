import { downloadFile } from "../../utils/fileDownloader";
import React, { useState, useRef } from 'react';
import { Upload, Code, Download, RefreshCw, CheckCircle2, Eye } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';

export default function HtmlToPdfTool() {
  const [htmlCode, setHtmlCode] = useState(`<div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; max-width: 600px; margin: auto;">
  <h1 style="color: #3525cd; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Invoice Summary</h1>
  <p style="font-size: 14px; line-height: 1.6;">Thank you for your business. Here is a summary of your recent transaction.</p>
  
  <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px;">
    <thead>
      <tr style="background: #f1f5f9; text-align: left;">
        <th style="padding: 8px; border: 1px solid #cbd5e1;">Item</th>
        <th style="padding: 8px; border: 1px solid #cbd5e1;">Qty</th>
        <th style="padding: 8px; border: 1px solid #cbd5e1;">Price</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 8px; border: 1px solid #cbd5e1;">Cloud Hosting Plan</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1;">1</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1;">$120.00</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #cbd5e1;">SSL Certificate</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1;">1</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1;">$29.00</td>
      </tr>
    </tbody>
  </table>
  
  <div style="margin-top: 20px; text-align: right; font-weight: bold; font-size: 16px; color: #059669;">
    Total Paid: $149.00
  </div>
</div>`);

  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const iframeRef = useRef(null);

  const generatePdf = async () => {
    setIsGenerating(true);
    try {
      // Render HTML in hidden SVG / Canvas foreignObject
      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="794" height="1123">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml">
              ${htmlCode}
            </div>
          </foreignObject>
        </svg>
      `;

      const blobSvg = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const urlSvg = URL.createObjectURL(blobSvg);

      const img = new Image();
      img.src = urlSvg;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = 794; // A4 96 DPI
      canvas.height = 1123;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.92);

      const pdfDoc = await PDFDocument.create();
      const jpegImage = await pdfDoc.embedJpg(jpegDataUrl);
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 in points
      page.drawImage(jpegImage, {
        x: 0,
        y: 0,
        width: 595.28,
        height: 841.89
      });

      const pdfBytes = await pdfDoc.save();
      const blobPdf = new Blob([pdfBytes], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blobPdf));
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      console.error('HTML to PDF error:', err);
      alert('Error converting HTML to PDF: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
              <Code className="h-4 w-4 text-[#3525cd]" /> HTML / CSS Code
            </span>
          </div>
          <textarea
            rows={14}
            value={htmlCode}
            onChange={(e) => { setHtmlCode(e.target.value); setPdfUrl(null); }}
            className="w-full p-4 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-[#3525cd]"
          />
        </div>

        {/* Live HTML Preview */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-emerald-500" /> Live HTML Preview
            </span>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 overflow-y-auto max-h-72">
              <div dangerouslySetInnerHTML={{ __html: htmlCode }} />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={generatePdf}
              disabled={isGenerating || !htmlCode.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#3525cd] hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
            >
              {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Convert HTML to PDF
            </button>
          </div>
        </div>
      </div>

      {/* Result */}
      {pdfUrl && (
        <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
            <CheckCircle2 className="h-4 w-4" /> HTML Document Converted to PDF!
          </div>
          <button type="button" onClick={(e) => { e.preventDefault(); downloadFile(pdfUrl, "html-document.pdf", "application/pdf"); }}  
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Download PDF Document
          </button>
        </div>
      )}
    </div>
  );
}
