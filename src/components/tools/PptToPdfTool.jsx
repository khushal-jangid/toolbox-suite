import React, { useState, useRef } from 'react';
import { Upload, Presentation, Download, RefreshCw, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import confetti from 'canvas-confetti';

export default function PptToPdfTool() {
  const [slides, setSlides] = useState([
    { title: 'Project Overview', content: '• Antigravity 2.0 Web Suite Architecture\n• 100% Client-side browser execution\n• Zero file uploads to servers' },
    { title: 'Key Advantages', content: '• Ultimate privacy & data security\n• Instant offline capabilities\n• Lightning fast processing' },
    { title: 'Next Milestones', content: '• Expanded PDF and Developer Tools\n• Mobile responsive layout optimizations\n• Enhanced user productivity' }
  ]);
  const [deckTitle, setDeckTitle] = useState('Presentation Deck');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const addSlide = () => {
    setSlides(prev => [...prev, { title: `Slide ${prev.length + 1}`, content: '• Enter your slide bullet points here\n• Add key insights' }]);
    setPdfUrl(null);
  };

  const removeSlide = (idx) => {
    if (slides.length <= 1) return;
    setSlides(prev => prev.filter((_, i) => i !== idx));
    setPdfUrl(null);
  };

  const updateSlide = (idx, field, value) => {
    const updated = [...slides];
    updated[idx][field] = value;
    setSlides(updated);
    setPdfUrl(null);
  };

  const generatePdf = async () => {
    setIsGenerating(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // 16:9 Slide Dimensions in points (960 x 540)
      const slideWidth = 960;
      const slideHeight = 540;

      slides.forEach((slide, idx) => {
        const page = pdfDoc.addPage([slideWidth, slideHeight]);

        // Background
        page.drawRectangle({
          x: 0,
          y: 0,
          width: slideWidth,
          height: slideHeight,
          color: rgb(0.98, 0.98, 1.0)
        });

        // Top Accent Bar
        page.drawRectangle({
          x: 0,
          y: slideHeight - 8,
          width: slideWidth,
          height: 8,
          color: rgb(0.2, 0.15, 0.8)
        });

        // Slide Title
        page.drawText(slide.title || `Slide ${idx + 1}`, {
          x: 60,
          y: slideHeight - 80,
          size: 28,
          font: boldFont,
          color: rgb(0.1, 0.1, 0.2)
        });

        // Slide Number
        page.drawText(`${idx + 1} / ${slides.length}`, {
          x: slideWidth - 100,
          y: 40,
          size: 12,
          font,
          color: rgb(0.5, 0.5, 0.6)
        });

        // Footer Title
        page.drawText(deckTitle, {
          x: 60,
          y: 40,
          size: 12,
          font,
          color: rgb(0.5, 0.5, 0.6)
        });

        // Content
        let currentY = slideHeight - 140;
        const lines = (slide.content || '').split('\n');

        lines.forEach(line => {
          if (!line.trim()) {
            currentY -= 15;
            return;
          }
          page.drawText(line, {
            x: 60,
            y: currentY,
            size: 16,
            font,
            color: rgb(0.2, 0.2, 0.3)
          });
          currentY -= 28;
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      console.error('PPT to PDF error:', err);
      alert('Error creating presentation PDF: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto">
      {/* Title */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 space-y-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase">Presentation Title</label>
          <input
            type="text"
            value={deckTitle}
            onChange={(e) => setDeckTitle(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
          />
        </div>
        <button
          onClick={addSlide}
          className="self-end sm:self-auto px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-amber-600 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" /> Add Slide
        </button>
      </div>

      {/* Slide Cards */}
      <div className="space-y-4">
        {slides.map((slide, idx) => (
          <div key={idx} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 relative shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-600">Slide #{idx + 1}</span>
              {slides.length > 1 && (
                <button
                  onClick={() => removeSlide(idx)}
                  className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <input
              type="text"
              value={slide.title}
              onChange={(e) => updateSlide(idx, 'title', e.target.value)}
              placeholder="Slide Headline"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
            />

            <textarea
              rows={4}
              value={slide.content}
              onChange={(e) => updateSlide(idx, 'content', e.target.value)}
              placeholder="Slide bullet points (start each with •)..."
              className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
            />
          </div>
        ))}
      </div>

      {/* Action */}
      <div className="flex justify-end pt-2">
        <button
          onClick={generatePdf}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
        >
          {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Presentation className="h-4 w-4" />}
          Generate 16:9 Presentation PDF ({slides.length} slides)
        </button>
      </div>

      {/* Result */}
      {pdfUrl && (
        <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
            <CheckCircle2 className="h-4 w-4" /> 16:9 Presentation PDF Ready!
          </div>
          <a
            href={pdfUrl}
            download={`${deckTitle}-slides.pdf`}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Download Presentation PDF
          </a>
        </div>
      )}
    </div>
  );
}
