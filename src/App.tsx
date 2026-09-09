/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Layers,
  FileCode,
  Smartphone,
  Sparkles,
  Download,
  Terminal,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { ScannerStudio } from './components/ScannerStudio';
import { CodeExplorer } from './components/CodeExplorer';
import { AndroidBuildGuide } from './components/AndroidBuildGuide';

export default function App() {
  const [currentView, setCurrentView] = useState<'studio' | 'code' | 'guide'>('studio');

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans">
      {/* Top Global Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-sm font-black text-lg">
              CS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg text-stone-900 tracking-tight">
                  CamScanner Python
                </h1>
                <span className="bg-teal-100 text-teal-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-mono">
                  Android APK Suite
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                OpenCV 4-Corner Warp • KivyMD • Google ML Kit • SQLite • Buildozer
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
            <button
              id="nav-studio"
              onClick={() => setCurrentView('studio')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                currentView === 'studio'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span>Interactive Scanner</span>
            </button>
            <button
              id="nav-code"
              onClick={() => setCurrentView('code')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                currentView === 'code'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-700" />
              <span>Python Files & ZIP</span>
            </button>
            <button
              id="nav-guide"
              onClick={() => setCurrentView('guide')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                currentView === 'guide'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-teal-700" />
              <span>Android APK Guide</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main View Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {currentView === 'studio' && <ScannerStudio />}
        {currentView === 'code' && <CodeExplorer />}
        {currentView === 'guide' && <AndroidBuildGuide />}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 text-stone-500 text-xs text-center mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>CamScanner Python Android Suite • Architecture & Code Generator</span>
          <span className="font-mono text-stone-400 text-[11px]">
            Ready for Buildozer / GitHub Actions (.github/workflows/build-apk.yml)
          </span>
        </div>
      </footer>
    </div>
  );
}
