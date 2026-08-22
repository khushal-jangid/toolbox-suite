import React, { useState } from "react";
import { 
  Download, QrCode, Smartphone, ShieldCheck, Zap, Sparkles, CheckCircle2,
  ArrowLeft, FileText, Image, Code2, Lock, ArrowRight, Share2, Star, Check
} from "lucide-react";

export default function DownloadAppPage({ onNavigate }) {
  const [copied, setCopied] = useState(false);

  // GitHub Release / Direct Artifact APK link
  const apkDownloadUrl = "https://github.com/khushal-jangid/toolbox-suite/releases/latest/download/ToolBox-v1.0.apk";
  const webAppUrl = window.location.origin;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Download ToolBox Suite Android App",
        text: "Get 66+ Free PDF, Image, Code & Calculator tools on your Android phone!",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-8 space-y-10">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate("home")}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black rounded-xl bg-yellow-300 text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] hover:bg-yellow-400 transition active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Web Tools
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition active:scale-95"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
          {copied ? "Link Copied!" : "Share App"}
        </button>
      </div>

      {/* Main Hero Card */}
      <section className="bg-[#fffbeb] dark:bg-[#1f1a14] border-2 border-slate-900 dark:border-slate-700 rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_0px_#0f172a] dark:shadow-[6px_6px_0px_0px_#000] relative overflow-hidden bg-paper-dots">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Details & Download Button */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-300 border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0f172a] text-slate-950 text-xs font-black">
              <span>📱 OFFICIAL ANDROID APK</span> • <span>v1.0.0</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white leading-tight">
              Download <span className="bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent underline decoration-wavy decoration-yellow-400">ToolBox Suite</span> for Android
            </h1>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              Carry 66+ lightning-fast client-side tools right in your pocket. Convert PDFs, compress photos, format code, and encrypt files completely offline with zero ads.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 bg-white dark:bg-slate-900 border-2 border-slate-900 rounded-lg text-xs font-black text-slate-900 dark:text-slate-100 shadow-[1.5px_1.5px_0px_0px_#0f172a]">
                ✨ 100% Free Forever
              </span>
              <span className="px-2.5 py-1 bg-white dark:bg-slate-900 border-2 border-slate-900 rounded-lg text-xs font-black text-slate-900 dark:text-slate-100 shadow-[1.5px_1.5px_0px_0px_#0f172a]">
                🔒 100% Private Offline
              </span>
              <span className="px-2.5 py-1 bg-white dark:bg-slate-900 border-2 border-slate-900 rounded-lg text-xs font-black text-slate-900 dark:text-slate-100 shadow-[1.5px_1.5px_0px_0px_#0f172a]">
                ⚡ Size: ~12 MB
              </span>
            </div>

            {/* Direct Download Button */}
            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              <a
                href={apkDownloadUrl}
                download="ToolBox-v1.0.apk"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] transition active:translate-x-0.5 active:translate-y-0.5"
              >
                <Download className="h-6 w-6 stroke-[2.5]" />
                <span>Download APK (Direct)</span>
              </a>

              <a
                href="https://github.com/khushal-jangid/toolbox-suite/actions"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold text-sm border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] hover:bg-yellow-100 transition"
              >
                <span>View GitHub Releases ➔</span>
              </a>
            </div>
          </div>

          {/* Right Column: Phone Mockup & QR Code */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center gap-4">
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_#0f172a] text-center space-y-3 w-full max-w-[280px]">
              <div className="flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(window.location.href)}`}
                  alt="Scan to Download APK"
                  className="w-40 h-40 border-2 border-slate-900 rounded-2xl p-1 bg-white"
                />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 dark:text-slate-100 block">
                  Scan QR Code on Phone
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Point your camera to download directly
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Step-by-Step Installation Guide */}
      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white text-center">
          📱 3 Simple Steps to Install on Android
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-[#fff5f5] dark:bg-[#1a1218] border-2 border-slate-900 dark:border-slate-700 rounded-3xl p-6 shadow-[4px_4px_0px_0px_#0f172a] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white font-black flex items-center justify-center text-lg border-2 border-slate-900 shadow-xs">
              1
            </div>
            <h3 className="font-black text-base text-slate-900 dark:text-slate-100">Download the APK</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Tap the green <strong>"Download APK"</strong> button above to download the latest <code>.apk</code> package to your Android phone.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#f0f9ff] dark:bg-[#0f1d2e] border-2 border-slate-900 dark:border-slate-700 rounded-3xl p-6 shadow-[4px_4px_0px_0px_#0f172a] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white font-black flex items-center justify-center text-lg border-2 border-slate-900 shadow-xs">
              2
            </div>
            <h3 className="font-black text-base text-slate-900 dark:text-slate-100">Allow Install</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Open your downloads folder, tap <code>ToolBox.apk</code>, and click <strong>"Allow from this source"</strong> if prompted by Android.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#f0fdf4] dark:bg-[#0c2217] border-2 border-slate-900 dark:border-slate-700 rounded-3xl p-6 shadow-[4px_4px_0px_0px_#0f172a] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-black flex items-center justify-center text-lg border-2 border-slate-900 shadow-xs">
              3
            </div>
            <h3 className="font-black text-base text-slate-900 dark:text-slate-100">Open & Enjoy</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Launch ToolBox Suite directly from your home screen. All 66+ tools work instantly with full client-side privacy!
            </p>
          </div>
        </div>
      </section>

      {/* Included Tools Overview */}
      <section className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
        <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" /> What is included inside the Android App?
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-slate-900/30">
            📄 <strong>25+ PDF Tools</strong> (Word, Excel, PPT, Compress, Sign, Split, OCR)
          </div>
          <div className="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-slate-900/30">
            🖼️ <strong>15+ Image Tools</strong> (Compress, BG Remover, Crop, Resize, Watermark)
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-slate-900/30">
            💻 <strong>12+ Dev Utilities</strong> (JSON, Code Formatter, QR, Base64, Hashes)
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-slate-900/30">
            🔐 <strong>14+ Calculators & Security</strong> (AES Encryptor, Currencies, Age, Margins)
          </div>
        </div>
      </section>
    </div>
  );
}
