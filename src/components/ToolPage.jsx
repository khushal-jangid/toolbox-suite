import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, Star, Share2, Check, ChevronDown, ChevronUp, Sparkles, 
  HelpCircle, BookOpen, Layers, Maximize2, Files, FileImage, QrCode, 
  KeyRound, FileSpreadsheet, Braces, Scaling, Wand2, CaseSensitive, 
  Video, ArrowLeftRight, Calculator, AlignLeft, Code, Link, Fingerprint, 
  Binary, Palette, FileCode, GitCompare, Lock, FileEdit, AppWindow, 
  Landmark, HeartPulse, Percent, Ruler, Pipette, Globe, Eye, Scan, 
  ShieldAlert, Calendar, TextSearch, Tag, Code2, Timer, Laptop, Monitor,
  Terminal, Cpu, FileText, FolderArchive, FileDown, Scissors, Coins, Crop,
  Presentation, Trash2, RotateCw, Hash, PenTool, Unlock, ScanText, Wrench, Edit3, EyeOff
} from 'lucide-react';
import { TOOLS_REGISTRY } from '../data/toolsRegistry';

// Tool Components Imports
import ImageCompressorTool from './tools/ImageCompressorTool';
import PdfMergerTool from './tools/PdfMergerTool';
import PdfToImageTool from './tools/PdfToImageTool';
import QrGeneratorTool from './tools/QrGeneratorTool';
import PasswordGeneratorTool from './tools/PasswordGeneratorTool';
import WordCounterTool from './tools/WordCounterTool';
import JsonFormatterTool from './tools/JsonFormatterTool';
import ImageResizerTool from './tools/ImageResizerTool';
import BackgroundRemoverTool from './tools/BackgroundRemoverTool';
import TextConverterTool from './tools/TextConverterTool';
import UnitConverterTool from './tools/UnitConverterTool';
import CalculatorTool from './tools/CalculatorTool';

// New Tool Imports
import PomodoroTimerTool from './tools/PomodoroTimerTool';
import GpaCalculatorTool from './tools/GpaCalculatorTool';
import ProfitMarginTool from './tools/ProfitMarginTool';
import UnitPriceTool from './tools/UnitPriceTool';

// Invoice & Watermark Tool Imports
import InvoiceGeneratorTool from './tools/InvoiceGeneratorTool';
import ImageWatermarkTool from './tools/ImageWatermarkTool';

// New Advanced Feature Tools
import ZipTool from './tools/ZipTool';
import PdfCompressorTool from './tools/PdfCompressorTool';
import ImageToPdfTool from './tools/ImageToPdfTool';
import ImageConverterTool from './tools/ImageConverterTool';
import PdfSplitterTool from './tools/PdfSplitterTool';
import FileEncryptorTool from './tools/FileEncryptorTool';
import DateCalculatorTool from './tools/DateCalculatorTool';
import CurrencyConverterTool from './tools/CurrencyConverterTool';
import ImageCropperTool from './tools/ImageCropperTool';
import AgeCalculatorTool from './tools/AgeCalculatorTool';

// PDF Suite Tools
import PdfToWordTool from './tools/PdfToWordTool';
import PdfToExcelTool from './tools/PdfToExcelTool';
import PdfToPptTool from './tools/PdfToPptTool';
import WordToPdfTool from './tools/WordToPdfTool';
import ExcelToPdfTool from './tools/ExcelToPdfTool';
import PptToPdfTool from './tools/PptToPdfTool';
import HtmlToPdfTool from './tools/HtmlToPdfTool';
import PdfPageRemoverTool from './tools/PdfPageRemoverTool';
import PdfRotateTool from './tools/PdfRotateTool';
import PdfPageNumbersTool from './tools/PdfPageNumbersTool';
import PdfSignTool from './tools/PdfSignTool';
import PdfProtectTool from './tools/PdfProtectTool';
import PdfUnlockTool from './tools/PdfUnlockTool';
import PdfOcrTool from './tools/PdfOcrTool';
import PdfRepairTool from './tools/PdfRepairTool';
import PdfEditTool from './tools/PdfEditTool';
import PdfRedactTool from './tools/PdfRedactTool';
import PdfCompareTool from './tools/PdfCompareTool';
import PdfCropTool from './tools/PdfCropTool';

import GenericTool from './tools/GenericTool';

const ICON_MAP = {
  Maximize2, Files, FileImage, QrCode, KeyRound, FileSpreadsheet, Braces, Scaling, Wand2,
  CaseSensitive, Video, ArrowLeftRight, Calculator, AlignLeft, Code, Link, Fingerprint,
  Binary, Palette, FileCode, GitCompare, Lock, FileEdit, AppWindow, Landmark, HeartPulse,
  Percent, Ruler, Pipette, Globe, Eye, Scan, ShieldAlert, Calendar, TextSearch, Tag, Code2,
  Timer, Laptop, Monitor, FolderArchive, FileDown, Scissors, Coins, Crop, FileText,
  Presentation, Trash2, RotateCw, Hash, PenTool, Unlock, ScanText, Wrench, Edit3, EyeOff
};

export default function ToolPage({ toolSlug, onNavigate, isFavorite, toggleFavorite }) {
  const tool = TOOLS_REGISTRY.find(t => t.slug === toolSlug) || TOOLS_REGISTRY[0];
  const [activeFaq, setActiveFaq] = useState(null);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (!tool) return;
    
    const pageTitle = tool.seo?.title || `${tool.name} — Free Online Tool`;
    const pageDesc = tool.seo?.description || tool.shortDescription || '';
    
    document.title = `${pageTitle} — ToolBox by Khushal Jangid`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && pageDesc) {
      metaDesc.setAttribute('content', pageDesc);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": tool.name || 'ToolBox Utility',
      "operatingSystem": "All",
      "applicationCategory": "UtilitiesApplication",
      "author": {
        "@type": "Person",
        "name": "Khushal Jangid"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": pageDesc
    };

    let scriptTag = document.getElementById('json-ld-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(schemaData);

    window.scrollTo(0, 0);
  }, [tool]);

  if (!tool) return null;

  const IconComp = ICON_MAP[tool.icon] || Sparkles;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const renderToolComponent = () => {
    switch (tool.id) {
      case 'image-compressor': return <ImageCompressorTool />;
      case 'pdf-merger': return <PdfMergerTool />;
      case 'pdf-to-image': return <PdfToImageTool />;
      case 'qr-generator': return <QrGeneratorTool />;
      case 'password-generator': return <PasswordGeneratorTool />;
      case 'word-counter': return <WordCounterTool />;
      case 'json-formatter': return <JsonFormatterTool />;
      case 'image-resizer': return <ImageResizerTool />;
      case 'background-remover': return <BackgroundRemoverTool />;
      case 'text-converter': return <TextConverterTool />;
      case 'unit-converter': return <UnitConverterTool />;
      case 'calculator': return <CalculatorTool />;

      // Everyday & Business Tools
      case 'pomodoro-timer': return <PomodoroTimerTool />;
      case 'gpa-calculator': return <GpaCalculatorTool />;
      case 'profit-margin-calculator': return <ProfitMarginTool />;
      case 'unit-price-calculator': return <UnitPriceTool />;

      // Invoice & Watermark Tools
      case 'invoice-generator': return <InvoiceGeneratorTool />;
      case 'image-watermark': return <ImageWatermarkTool />;

      // Advanced Utility Tools
      case 'zip-tool': return <ZipTool />;
      case 'pdf-compressor': return <PdfCompressorTool />;
      case 'image-to-pdf': return <ImageToPdfTool />;
      case 'image-converter': return <ImageConverterTool />;
      case 'pdf-splitter': return <PdfSplitterTool />;
      case 'file-encryptor': return <FileEncryptorTool />;
      case 'date-calculator': return <DateCalculatorTool />;
      case 'currency-converter': return <CurrencyConverterTool />;
      case 'image-cropper': return <ImageCropperTool />;
      case 'age-calculator': return <AgeCalculatorTool />;

      // 19 Complete PDF Suite Tools
      case 'pdf-to-word': return <PdfToWordTool />;
      case 'pdf-to-excel': return <PdfToExcelTool />;
      case 'pdf-to-powerpoint': return <PdfToPptTool />;
      case 'word-to-pdf': return <WordToPdfTool />;
      case 'excel-to-pdf': return <ExcelToPdfTool />;
      case 'powerpoint-to-pdf': return <PptToPdfTool />;
      case 'html-to-pdf': return <HtmlToPdfTool />;
      case 'remove-pdf-pages': return <PdfPageRemoverTool />;
      case 'rotate-pdf': return <PdfRotateTool />;
      case 'add-pdf-page-numbers': return <PdfPageNumbersTool />;
      case 'sign-pdf': return <PdfSignTool />;
      case 'protect-pdf': return <PdfProtectTool />;
      case 'unlock-pdf': return <PdfUnlockTool />;
      case 'ocr-pdf': return <PdfOcrTool />;
      case 'repair-pdf': return <PdfRepairTool />;
      case 'edit-pdf': return <PdfEditTool />;
      case 'redact-pdf': return <PdfRedactTool />;
      case 'compare-pdf': return <PdfCompareTool />;
      case 'crop-pdf': return <PdfCropTool />;

      default: return <GenericTool tool={tool} />;
    }
  };

  const relatedTools = TOOLS_REGISTRY
    .filter(t => t.category === tool.category && t.id !== tool.id)
    .slice(0, 4);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
          <button onClick={() => onNavigate('home')} className="hover:underline">Home</button>
          <span>/</span>
          <span className="capitalize">{tool.category || 'Utility'}</span>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100 font-black">{tool.name}</span>
        </nav>

        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl bg-yellow-300 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] hover:bg-yellow-400 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to ToolBox
        </button>
      </div>

      {/* Main Tool Header */}
      <section className="max-w-[900px] mx-auto text-center space-y-3">
        <div className="w-14 h-14 bg-yellow-300 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] rounded-2xl flex items-center justify-center text-slate-900 mx-auto">
          <IconComp className="h-7 w-7" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {tool.name}
          </h1>
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-500 text-white border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0f172a]">
            100% FREE
          </span>
        </div>

        <p className="text-base text-slate-700 dark:text-slate-300 max-w-2xl mx-auto font-medium">
          {tool.shortDescription}
        </p>

        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => toggleFavorite(tool.id)}
            className={`px-3.5 py-1.5 rounded-xl border-2 border-slate-900 transition flex items-center gap-1.5 text-xs font-black shadow-[2px_2px_0px_0px_#0f172a] ${
              isFavorite
                ? 'bg-amber-400 text-slate-900'
                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-yellow-100'
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${isFavorite ? 'fill-slate-900 text-slate-900' : ''}`} />
            {isFavorite ? 'Saved in Favorites' : 'Save Tool'}
          </button>

          <button
            onClick={handleShare}
            className="px-3.5 py-1.5 rounded-xl border-2 border-slate-900 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-yellow-100 transition flex items-center gap-1.5 text-xs font-black shadow-[2px_2px_0px_0px_#0f172a]"
          >
            {copiedShare ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
            {copiedShare ? 'Copied Link!' : 'Share Tool'}
          </button>
        </div>
      </section>

      {/* Main Tool Execution Sandbox Container */}
      <section className="max-w-[900px] mx-auto bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#0f172a] dark:shadow-[6px_6px_0px_0px_#000]">
        {renderToolComponent()}
      </section>

      {/* SEO & Information Section */}
      <div className="max-w-[900px] mx-auto space-y-8 pt-4">
        {/* How to Use Section */}
        {tool.howToUse && tool.howToUse.length > 0 && (
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-[#e0e3e5] dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-lg font-bold text-[#131b2e] dark:text-white">
              <BookOpen className="h-5 w-5 text-[#3525cd]" />
              <h2>How to Use {tool.name}</h2>
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {tool.howToUse.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-[#f2f3ff] dark:bg-slate-800/50 border border-[#e0e3e5] dark:border-slate-800">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#3525cd] text-white font-bold text-xs">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-[#464555] dark:text-slate-300 leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Features Section */}
        {tool.features && tool.features.length > 0 && (
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-[#e0e3e5] dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-lg font-bold text-[#131b2e] dark:text-white">
              <Sparkles className="h-5 w-5 text-[#3525cd]" />
              <h2>Key Features</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {tool.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl bg-[#f2f3ff] dark:bg-slate-800/50 border border-[#e0e3e5] dark:border-slate-800 text-xs sm:text-sm text-[#464555] dark:text-slate-300">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
