import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import ToolPage from './components/ToolPage';
import QuickSearchModal from './components/QuickSearchModal';
import MobileBottomNav from './components/MobileBottomNav';
import { TOOLS_REGISTRY } from './data/toolsRegistry';

export default function App() {
  const [route, setRoute] = useState({ page: 'home', slug: null });
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('omnitools_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('omnitools_favorites'));
      return Array.isArray(saved) ? saved : ['image-compressor', 'pdf-merger', 'qr-generator'];
    } catch {
      return ['image-compressor', 'pdf-merger', 'qr-generator'];
    }
  });

  // Sync theme class to document html
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('omnitools_theme', theme);
  }, [theme]);

  // Sync hash URL routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('/tools/')) {
        const slug = hash.replace('/tools/', '');
        setRoute({ page: 'tool', slug });
      } else {
        setRoute({ page: 'home', slug: null });
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page, slug = null, catFilter = 'all') => {
    if (page === 'tool' && slug) {
      window.location.hash = `/tools/${slug}`;
      setRoute({ page: 'tool', slug });
    } else {
      window.location.hash = '';
      setRoute({ page: 'home', slug: null });
      setCategoryFilter(catFilter);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleFavorite = (toolId) => {
    setFavorites(prev => {
      const updated = prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId];
      localStorage.setItem('omnitools_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-slate-900 dark:bg-[#0f141c] dark:text-slate-100 transition-colors duration-200 pb-20 sm:pb-0">
      <Header
        onNavigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        favoritesCount={favorites.length}
      />

      <main className="flex-1">
        {route.page === 'tool' && route.slug ? (
          <ToolPage
            toolSlug={route.slug}
            onNavigate={navigate}
            isFavorite={Array.isArray(favorites) && favorites.includes(route.slug)}
            toggleFavorite={toggleFavorite}
          />
        ) : (
          <HomePage
            onNavigate={navigate}
            activeCategoryFilter={categoryFilter}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        )}
      </main>

      <Footer onNavigate={navigate} />

      {/* Native App-Style Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentRoute={route}
        activeCategory={categoryFilter}
        onNavigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        favoritesCount={favorites.length}
      />

      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={(slug) => navigate('tool', slug)}
      />
    </div>
  );
}
