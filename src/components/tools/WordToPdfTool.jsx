import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, RefreshCw, CheckCircle2 } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import confetti from 'canvas-confetti';

export default function WordToPdfTool() {
  const [textContent, setTextContent] = useState('');
  const [docTitle, setDocTitle] = useState('Document');
  const [fontSize, setFontSize] = useState(12);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (event) => {
      setTextContent(event.target.result || '');
      setPdfUrl(null);
    };
    reader.readAsText(file);
  };

  const generatePdf = async () => {
    if (!textContent.trim()) {
      alert('Please enter or upload document text.');
      return;
    }
    setIsGenerating(true);

    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const margin = 50;
      const pageWidth = 595.28; // A4
      const pageHeight = 841.89;
      const contentWidth = pageWidth - margin * 2;

      let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      let currentY = pageHeight - margin;

      // Draw Title
      currentPage.drawText(docTitle, {
        x: margin,
        y: currentY - 18,
        size: 18,
        font: boldFont,
        color: rgb(0.2, 0.15, 0.8)
      });
      currentY -= 40;

      // Line wrap helper
      const paragraphs = textContent.split('\n');

      for (const para of paragraphs) {
        if (!para.trim()) {
          currentY -= fontSize * 0.8;
          continue;
        }

        const words = para.split(' ');
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const textWidth = font.widthOfTextAtSize(testLine, fontSize);

          if (textWidth > contentWidth && currentLine) {
            if (currentY < margin + fontSize) {
              currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
              currentY = pageHeight - margin;
            }
            currentPage.drawText(currentLine, {
              x: margin,
              y: currentY,
              size: fontSize,
              font,
              color: rgb(0.1, 0.1, 0.1)
            });
            currentY -= fontSize * 1.4;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }

        if (currentLine) {
          if (currentY < margin + fontSize) {
            currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
            currentY = pageHeight - margin;
          }
          currentPage.drawText(currentLine, {
            x: margin,
            y: currentY,
            size: fontSize,
            font,
            color: rgb(0.1, 0.1, 0.1)
          });
          currentY -= fontSize * 1.4;
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      console.error('Word to PDF error:', err);
      alert('Error creating PDF: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto">
      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#3525cd] p-8 rounded-2xl text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/40 space-y-2"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.doc,.docx,.rtf"
          className="hidden"
          onChange={handleFileUpload}
        />
        <div className="w-12 h-12 bg-indigo-500/10 text-[#3525cd] dark:text-[#c3c0ff] rounded-xl flex items-center justify-center mx-auto">
          <FileText className="h-6 w-6" />
        </div>
        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Upload Text / Document File or paste content below</p>
      </div>

      {/* Editor & Settings */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Document Title</label>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Font Size: {fontSize}pt</label>
            <input
              type="range"
              min="9"
              max="18"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-[#3525cd] mt-2"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Document Text Content</label>
          <textarea
            rows={8}
            value={textContent}
            onChange={(e) => { setTextContent(e.target.value); setPdfUrl(null); }}
            placeholder="Type or paste document paragraphs here..."
            className="w-full p-4 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#3525cd]"
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={generatePdf}
            disabled={isGenerating || !textContent.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#3525cd] hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Generate PDF Document
          </button>
        </div>
      </div>

      {/* Result */}
      {pdfUrl && (
        <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
            <CheckCircle2 className="h-4 w-4" /> PDF Document Generated Successfully!
          </div>
          <a
            href={pdfUrl}
            download={`${docTitle}.pdf`}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Download PDF
          </a>
        </div>
      )}
    </div>
  );
}
