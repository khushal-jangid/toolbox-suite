import React from "react";
import { Home, FileText, Image, Search, Star, Sparkles } from "lucide-react";

export default function MobileBottomNav({ currentRoute, activeCategory, onNavigate, onOpenSearch, favoritesCount = 0 }) {
  const isHome = currentRoute.page === "home" && activeCategory === "all";
  const isPdf = currentRoute.page === "home" && activeCategory === "pdf";
  const isImage = currentRoute.page === "home" && activeCategory === "image";
  const isFav = currentRoute.page === "home" && activeCategory === "favorites";

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:hidden z-50">
      <nav className="bg-white/95 dark:bg-[#0f141c]/95 border-2 border-slate-900 dark:border-slate-700 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] dark:shadow-[4px_4px_0px_0px_#000] backdrop-blur-md px-2 py-1.5 flex items-center justify-around">
        {/* 1. Home */}
        <button
          onClick={() => onNavigate("home", null, "all")}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-transform active:scale-90 ${
            isHome
              ? "bg-yellow-300 text-slate-950 border border-slate-900 font-black"
              : "text-slate-600 dark:text-slate-400 font-bold"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* 2. PDF Suite */}
        <button
          onClick={() => onNavigate("home", null, "pdf")}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-transform active:scale-90 ${
            isPdf
              ? "bg-rose-500 text-white border border-slate-900 font-black"
              : "text-slate-600 dark:text-slate-400 font-bold"
          }`}
        >
          <FileText className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">PDFs</span>
        </button>

        {/* 3. Central Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center -mt-5 bg-yellow-300 text-slate-950 border-2 border-slate-900 rounded-full w-12 h-12 shadow-[2px_2px_0px_0px_#0f172a] active:scale-90 transition-transform"
        >
          <Search className="h-5 w-5 stroke-[2.5]" />
        </button>

        {/* 4. Image Tools */}
        <button
          onClick={() => onNavigate("home", null, "image")}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-transform active:scale-90 ${
            isImage
              ? "bg-sky-500 text-white border border-slate-900 font-black"
              : "text-slate-600 dark:text-slate-400 font-bold"
          }`}
        >
          <Image className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">Images</span>
        </button>

        {/* 5. Favorites */}
        <button
          onClick={() => onNavigate("home", null, "favorites")}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-transform active:scale-90 relative ${
            isFav
              ? "bg-amber-400 text-slate-950 border border-slate-900 font-black"
              : "text-slate-600 dark:text-slate-400 font-bold"
          }`}
        >
          <Star className={`h-5 w-5 ${isFav ? "fill-slate-950" : ""}`} />
          <span className="text-[10px] mt-0.5">Saved</span>
          {favoritesCount > 0 && (
            <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center border border-slate-900">
              {favoritesCount}
            </span>
          )}
        </button>
      </nav>
    </div>
  );
}
