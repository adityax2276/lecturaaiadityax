import React from 'react';
import { BookOpen, Sparkles, LogIn, LogOut, User, Layers, HelpCircle, Plus } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'study-kit';
  onNavigate: (view: 'landing' | 'dashboard' | 'study-kit') => void;
  onOpenImport: () => void;
  onOpenAuth: () => void;
  onOpenArchInfo: () => void;
  user: UserProfile | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenImport,
  onOpenAuth,
  onOpenArchInfo,
  user,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#E7E5E4] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Wordmark & Icon */}
        <div
          id="brand-logo"
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#12141D] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <BookOpen className="w-4 h-4 text-indigo-300" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-lg tracking-tight text-[#12141D] font-sans">
              LECTURA
            </span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 tracking-wider">
              AI
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#4B5563]">
          <button
            id="nav-link-landing"
            onClick={() => onNavigate('landing')}
            className={`transition-colors hover:text-[#12141D] ${
              currentView === 'landing' ? 'text-[#12141D] font-semibold' : ''
            }`}
          >
            Product
          </button>
          <button
            id="nav-link-dashboard"
            onClick={() => onNavigate('dashboard')}
            className={`transition-colors hover:text-[#12141D] ${
              currentView === 'dashboard' ? 'text-[#12141D] font-semibold' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            id="nav-link-arch"
            onClick={onOpenArchInfo}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-stone-200 hover:border-stone-300 bg-white text-stone-700 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Architecture</span>
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          <button
            id="btn-create-study-kit-nav"
            onClick={onOpenImport}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#12141D] text-white text-xs font-medium hover:bg-[#272B3E] active:scale-[0.98] transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Study Kit</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#E7E5E4]">
              <div className="flex items-center gap-2 text-xs text-[#374151]">
                <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-medium">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:inline-block max-w-[120px] truncate font-medium">
                  {user.full_name || user.email.split('@')[0]}
                </span>
              </div>
              <button
                id="btn-logout"
                onClick={onLogout}
                title="Log out"
                className="p-1.5 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="btn-login-trigger"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#D6D3D1] hover:border-[#A8A29E] bg-white text-xs font-medium text-[#1F2937] hover:bg-stone-50 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-stone-600" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
