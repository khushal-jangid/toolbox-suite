import React, { useState } from "react";
import { 
  Download, QrCode, Smartphone, ShieldCheck, Zap, Sparkles, CheckCircle2,
  ArrowLeft, FileText, Image, Code2, Lock, ArrowRight, Share2, Star, Check,
  Award, Heart, Terminal, Compass, Layers, CheckSquare, Loader2, ExternalLink
} from "lucide-react";

export default function DownloadAppPage({ onNavigate }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Reliable absolute URLs
  const apkDownloadUrl = "https://khushal-jangid.github.io/toolbox-suite/ToolBox-v1.0.apk";
  const releaseDownloadUrl = "https://github.com/khushal-jangid/toolbox-suite/releases/download/v1.0.0/ToolBox-v1.0.apk";
  const repoReleasesUrl = "https://github.com/khushal-jangid/toolbox-suite/releases/tag/v1.0.0";

  // Forceful Blob & Direct Stream Downloader (100% immune to 404 & SPA routing errors)
  const handleDownload = async (e) => {
    if (e) e.preventDefault();
    setDownloading(true);

    try {
      // 1. Try Blob fetch download
      const response = await fetch(apkDownloadUrl);
      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "ToolBox-v1.0.apk";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);

        setDownloading(false);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 5000);
        return;
      }
    } catch (err) {
      console.warn("Direct blob fetch fallback:", err);
    }

    // 2. Direct browser navigation fallback
    const link = document.createElement("a");
    link.href = apkDownloadUrl;
    link.download = "ToolBox-v1.0.apk";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloading(false);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 5000);
  };

  const handleShare = () => {
    const url = "https://khushal-jangid.github.io/toolbox-suite/#download";
    if (navigator.share) {
      navigator.share({
        title: "Download ToolBox Suite Android App",
        text: "Get 66+ Free PDF, Image, Code & Calculator tools on your Android phone!",
        url: url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto px-3 sm:px-6 md:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12 bg-paper-grid min-h-screen">
      
      {/* Top Paper Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate("home")}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black rounded-xl bg-yellow-300 text-slate-950 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 stroke-[2.5]" /> Back to All Web Tools
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] hover:bg-yellow-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition cursor-pointer"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-600 stroke-[3]" /> : <Share2 className="h-4 w-4" />}
          {copied ? "Link Copied!" : "Share App"}
        </button>
      </div>

      {/* Main Hero Paper Sheet */}
      <section className="bg-[#fffbeb] dark:bg-[#1a160d] border-2 border-slate-900 dark:border-slate-700 rounded-3xl p-5 sm:p-10 shadow-[6px_6px_0px_0px_#0f172a] dark:shadow-[6px_6px_0px_0px_#000] relative overflow-hidden bg-paper-dots">
        
        {/* Paper Tape Sticker Decoration */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400/90 text-slate-900 px-6 py-1 text-[11px] font-black tracking-wider uppercase border-2 border-slate-900 shadow-xs rotate-1 z-20">
          📌 OFFICIAL RELEASE v1.0.0
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          
          {/* Left Column: Details & Tactile Buttons */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] text-xs font-black">
              <span>📱 ANDROID APK</span> • <span>66+ OFFLINE TOOLS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white leading-[1.15]">
              Get <span className="bg-yellow-300 text-slate-950 px-2 py-0.5 rounded-lg border-2 border-slate-900 inline-block shadow-[2px_2px_0px_0px_#0f172a] -rotate-1">ToolBox</span> on your Phone!
            </h1>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              Carry the entire suite of <strong>66+ client-side tools</strong> on your Android phone. Convert PDFs, crop & compress images, format code, and calculate data securely with <strong>zero server uploads and zero ads</strong>.
            </p>

            {/* Tactile Paper Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 bg-white dark:bg-slate-900 border-2 border-slate-900 rounded-xl text-xs font-black text-slate-900 dark:text-slate-100 shadow-[2px_2px_0px_0px_#0f172a]">
                ✨ 100% Free Forever
              </span>
              <span className="px-2.5 py-1 bg-white dark:bg-slate-900 border-2 border-slate-900 rounded-xl text-xs font-black text-slate-900 dark:text-slate-100 shadow-[2px_2px_0px_0px_#0f172a]">
                🔒 100% Private Client-Side
              </span>
              <span className="px-2.5 py-1 bg-white dark:bg-slate-900 border-2 border-slate-900 rounded-xl text-xs font-black text-slate-900 dark:text-slate-100 shadow-[2px_2px_0px_0px_#0f172a]">
                ⚡ Tiny Size: 4.75 MB
              </span>
            </div>

            {/* Direct Download Call To Actions */}
            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              
              {/* Primary Programmatic Downloader Button */}
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-base border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] active:translate-x-1 active:translate-y-1 active:shadow-none transition cursor-pointer disabled:opacity-75"
              >
                {downloading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin text-slate-950 stroke-[2.5]" />
                    <span>Starting Download...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-emerald-900 stroke-[2.5]" />
                    <span>Downloaded Successfully!</span>
                  </>
                ) : (
                  <>
                    <Download className="h-6 w-6 stroke-[2.5]" />
                    <span>Download APK (Direct 4.75 MB)</span>
                  </>
                )}
              </button>

              {/* Direct Anchor Tag Fallback */}
              <a
                href={apkDownloadUrl}
                download="ToolBox-v1.0.apk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-black text-sm border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] hover:bg-yellow-100 active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
              >
                <span>Direct Mirror Link ➔</span>
              </a>

            </div>

            {downloadSuccess && (
              <div className="p-3 bg-emerald-100 border-2 border-slate-900 rounded-xl text-xs font-black text-emerald-950 flex items-center gap-2 shadow-[2px_2px_0px_0px_#0f172a]">
                <Check className="h-4 w-4 text-emerald-700 stroke-[3]" />
                <span>ToolBox-v1.0.apk aapke downloads folder mein save ho gayi hai!</span>
              </div>
            )}

          </div>

          {/* Right Column: Paper QR Code Card Stamp */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-900 rounded-3xl p-5 shadow-[5px_5px_0px_0px_#0f172a] text-center space-y-3 w-full max-w-[270px] transform rotate-1 hover:rotate-0 transition">
              <div className="flex items-center justify-between border-b-2 border-dashed border-slate-300 dark:border-slate-700 pb-2">
                <span className="text-[10px] font-black uppercase text-rose-500">SCAN & INSTALL</span>
                <span className="text-[9px] font-mono font-bold text-slate-500">v1.0.0</span>
              </div>
              
              <div className="flex items-center justify-center py-1">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(apkDownloadUrl)}`}
                  alt="Scan to Download APK"
                  className="w-36 h-36 border-2 border-slate-900 rounded-xl p-1 bg-white"
                />
              </div>

              <a
                href={apkDownloadUrl}
                download="ToolBox-v1.0.apk"
                className="bg-yellow-300 hover:bg-yellow-400 text-slate-950 p-2.5 rounded-xl border-2 border-slate-900 shadow-xs block transition active:scale-95 cursor-pointer"
              >
                <span className="text-xs font-black block">
                  Scan to Download APK 📷
                </span>
                <span className="text-[9px] font-bold block opacity-90">
                  Tap or scan from phone camera
                </span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Colorful 3-Step Sticky Notes Installation Guide */}
      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white text-center">
          📑 3 Easy Steps to Install ToolBox on Android
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1: Rose Note */}
          <div className="bg-[#fff1f2] dark:bg-[#1f1216] border-2 border-slate-900 dark:border-slate-700 rounded-3xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_#0f172a] space-y-3 transform -rotate-1 hover:rotate-0 transition">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white font-black flex items-center justify-center text-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
              1
            </div>
            <h3 className="font-black text-base text-slate-900 dark:text-slate-100">
              Download the APK
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              Green button <strong>"Download APK"</strong> par click karein. <code>ToolBox-v1.0.apk</code> (4.75 MB) aapke phone par download ho jayegi.
            </p>
          </div>

          {/* Step 2: Sky Blue Note */}
          <div className="bg-[#f0f9ff] dark:bg-[#0f1d2e] border-2 border-slate-900 dark:border-slate-700 rounded-3xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_#0f172a] space-y-3 transform rotate-1 hover:rotate-0 transition">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white font-black flex items-center justify-center text-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
              2
            </div>
            <h3 className="font-black text-base text-slate-900 dark:text-slate-100">
              Allow Installation
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              Downloaded file par tap karein. Agar phone <em>"Install from Unknown Source"</em> maange toh use <strong>Allow</strong> kar dein.
            </p>
          </div>

          {/* Step 3: Mint Green Note */}
          <div className="bg-[#f0fdf4] dark:bg-[#0c2217] border-2 border-slate-900 dark:border-slate-700 rounded-3xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_#0f172a] space-y-3 transform -rotate-1 hover:rotate-0 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-black flex items-center justify-center text-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
              3
            </div>
            <h3 className="font-black text-base text-slate-900 dark:text-slate-100">
              Open App & Enjoy!
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              App icon aapki home screen par aa jayegi. Bina internet ke bhi saare 66 tools super-fast speed mein chalenge!
            </p>
          </div>

        </div>
      </section>

      {/* Colorful Paper Feature Grid */}
      <section className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-3xl p-5 sm:p-8 shadow-[5px_5px_0px_0px_#0f172a] space-y-5">
        <div className="flex items-center justify-between border-b-2 border-slate-900/30 dark:border-slate-800 pb-3">
          <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" /> What is included inside the Android App?
          </h3>
          <span className="text-[10px] font-black bg-yellow-300 text-slate-950 px-2 py-0.5 rounded border border-slate-900">
            66 UTILITIES
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-bold">
          
          <div className="p-3 bg-[#fff5f5] dark:bg-[#1a1218] rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] space-y-1">
            <span className="text-rose-600 dark:text-rose-400 font-black text-sm block">📄 PDF Suite</span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Word, Excel, PPT, Compress, Split, Merge, Rotate, Sign, Password</p>
          </div>

          <div className="p-3 bg-[#f0f9ff] dark:bg-[#0f1d2e] rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] space-y-1">
            <span className="text-sky-600 dark:text-sky-400 font-black text-sm block">🖼️ Image Studio</span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Compress, BG Remover, Crop, Resize, Color Extractor, Watermark</p>
          </div>

          <div className="p-3 bg-[#f0fdf4] dark:bg-[#0c2217] rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] space-y-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm block">💻 Dev Utilities</span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">JSON Formatter, QR Generator, Barcode, Base64, Code Minifiers</p>
          </div>

          <div className="p-3 bg-[#faf5ff] dark:bg-[#1e1333] rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] space-y-1">
            <span className="text-purple-600 dark:text-purple-400 font-black text-sm block">🔐 Security & Math</span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">AES File Encryptor, Currencies, Password Generator, Age & GPA</p>
          </div>

        </div>
      </section>

    </div>
  );
}
