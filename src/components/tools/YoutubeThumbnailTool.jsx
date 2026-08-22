import React, { useState } from 'react';
import { Video, Download, ExternalLink, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function YoutubeThumbnailTool() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState(null);

  const extractVideoId = (inputUrl) => {
    if (!inputUrl) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = inputUrl.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleUrlChange = (val) => {
    setUrl(val);
    const id = extractVideoId(val);
    setVideoId(id);
  };

  const qualities = videoId ? [
    { label: 'Max Resolution (1080p / 4K)', url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, code: 'maxres' },
    { label: 'High Definition (720p)', url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`, code: 'sd' },
    { label: 'High Quality (480p)', url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, code: 'hq' },
    { label: 'Medium Quality (360p)', url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`, code: 'mq' }
  ] : [];

  const handleDownload = (imgUrl, label) => {
    fetch(imgUrl)
      .then(res => res.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `yt-thumbnail-${videoId}-${label}.jpg`;
        a.click();
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
      })
      .catch(() => window.open(imgUrl, '_blank'));
  };

  return (
    <div className="space-y-6">
      {/* Input Link Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Paste YouTube Video or Shorts URL</label>
        <div className="relative">
          <input
            type="text"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/..."
            className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          <Video className="h-5 w-5 text-red-500 absolute left-3.5 top-3.5" />
        </div>
      </div>

      {/* Thumbnails grid */}
      {videoId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {qualities.map((item) => (
            <div key={item.code} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
              </div>
              <div className="bg-slate-950 rounded-xl overflow-hidden min-h-[180px] flex items-center justify-center">
                <img
                  src={item.url}
                  alt={item.label}
                  className="w-full object-cover max-h-[260px]"
                  onError={(e) => {
                    // Fallback to hqdefault if maxres doesn't exist
                    if (item.code === 'maxres') e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                  }}
                />
              </div>
              <button
                onClick={() => handleDownload(item.url, item.code)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-red-600 text-white shadow hover:bg-red-700 transition"
              >
                <Download className="h-4 w-4" /> Download {item.code.toUpperCase()} Image
              </button>
            </div>
          ))}
        </div>
      ) : url.trim() ? (
        <div className="p-8 text-center text-rose-500 font-medium bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-800">
          Invalid YouTube URL. Please enter a valid YouTube video or Shorts link.
        </div>
      ) : null}
    </div>
  );
}
