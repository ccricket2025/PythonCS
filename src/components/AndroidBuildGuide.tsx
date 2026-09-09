import React, { useState } from 'react';
import {
  Terminal,
  Github,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Smartphone,
  AlertTriangle,
  FileKey,
  Flame,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export function AndroidBuildGuide() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'github' | 'wsl' | 'deploy' | 'troubleshoot'>('github');

  const copySnippet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-4 h-4" /> Android Compilation Pipeline
          </span>
          <h2 className="text-xl font-bold">Android APK Build & Deployment Guide</h2>
          <p className="text-stone-300 text-xs max-w-2xl leading-relaxed">
            Python-for-Android à¦“ Buildozer à¦¦à¦¿à§Ÿà§‡ à¦ªà§‚à¦°à§à¦£à¦¾à¦™à§à¦— Android APK à¦•à¦®à§à¦ªà¦¾à¦‡à¦² à¦•à¦°à¦¾à¦° à¦¬à¦¿à¦¸à§à¦¤à¦¾à¦°à¦¿à¦¤ à¦—à¦¾à¦‡à¦¡à¥¤ à¦•à§‹à¦¨à§‹ à¦­à¦¾à¦°à§€ à¦¸à§‡à¦Ÿà¦†à¦ª à¦›à¦¾à§œà¦¾à¦‡ GitHub Actions à¦•à§à¦²à¦¾à¦‰à¦¡ à¦°à¦¾à¦¨à¦¾à¦° à¦¦à¦¿à§Ÿà§‡ à¦…à¦¥à¦¬à¦¾ à¦†à¦ªà¦¨à¦¾à¦° à¦²à§‹à¦•à¦¾à¦² à¦²à¦¿à¦¨à¦¾à¦•à§à¦¸/WSL2 à¦®à§‡à¦¶à¦¿à¦¨à§‡ à¦¬à¦¿à¦²à§à¦¡ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à§‡à¦¨à¥¤
          </p>
        </div>

        {/* Navigation sub-tabs */}
        <div className="bg-stone-800 p-1 rounded-xl flex items-center gap-1 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('github')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'github' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            GitHub Actions (Cloud)
          </button>
          <button
            onClick={() => setActiveTab('wsl')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'wsl' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            WSL2 / Ubuntu (Local)
          </button>
          <button
            onClick={() => setActiveTab('deploy')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'deploy' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            USB Run & Signing
          </button>
          <button
            onClick={() => setActiveTab('troubleshoot')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'troubleshoot' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            Troubleshooting
          </button>
        </div>
      </div>

      {/* Tab 1: GitHub Actions */}
      {activeTab === 'github' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white border border-stone-200 rounded-xl p-6 shadow-xs flex flex-col gap-5">
            {/* Quick Fix for the user's exact error */}
            <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-amber-950 text-xs sm:text-sm">
                    à¦à¦°à¦° à¦¸à¦®à¦¾à¦§à¦¾à¦¨: &quot;yes: standard output: Broken pipe / Buildozer failed to execute the last command&quot;
                  </span>
                  <p className="text-stone-700 text-xs leading-relaxed">
                    à¦†à¦ªà¦¨à¦¾à¦° à¦¸à¦°à§à¦¬à¦¶à§‡à¦· à¦¸à§à¦•à§à¦°à¦¿à¦¨à¦¶à¦Ÿà§‡ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦šà§à¦›à§‡ <code className="font-mono bg-amber-100 text-amber-950 px-1 py-0.5 rounded font-bold">yes | buildozer</code> à¦¦à§‡à¦“à§Ÿà¦¾à¦° à¦•à¦¾à¦°à¦£à§‡ à¦¸à¦¾à¦¬-à¦ªà§à¦°à¦¸à§‡à¦¸ à¦¬à¦¨à§à¦§ à¦¹à§Ÿà§‡ <strong className="text-red-700 font-mono">Broken pipe</strong> à¦¹à§Ÿà§‡à¦›à§‡ à¦à¦¬à¦‚ à¦¬à¦¿à¦²à§à¦¡ à¦¬à¦¨à§à¦§ à¦¹à§Ÿà§‡ à¦—à§‡à¦›à§‡à¥¤ à¦à¦›à¦¾à§œà¦¾ NDK à¦à¦¬à¦‚ à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦® à¦ªà§à¦¯à¦¾à¦•à§‡à¦œà§‡à¦° à¦œà¦Ÿà¦¿à¦²à¦¤à¦¾à¦° à¦•à¦¾à¦°à¦£à§‡ à¦¬à¦¿à¦²à§à¦¡ à¦«à§‡à¦‡à¦² à¦¹à§Ÿà¥¤ 
                  </p>
                  <p className="text-stone-700 text-xs leading-relaxed font-semibold text-emerald-800">
                    ðŸ’¡ à¦¸à§‡à¦°à¦¾ à¦à¦¬à¦‚ à¦…à¦«à¦¿à¦¸à¦¿à§Ÿà¦¾à¦² à¦¸à¦®à¦¾à¦§à¦¾à¦¨: Kivy à¦Ÿà¦¿à¦®à§‡à¦° à¦…à¦«à¦¿à¦¸à¦¿à¦¯à¦¼à¦¾à¦² à¦¡à¦•à¦¾à¦° à¦…à§à¦¯à¦¾à¦•à¦¶à¦¨ (<code className="font-mono bg-emerald-100 px-1 py-0.5 rounded text-emerald-900">ArtemSBulgakov/buildozer-action@v1</code>) à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¾à¥¤ à¦à¦¤à§‡ à¦…à§à¦¯à¦¾à¦¨à§à¦¡à§à¦°à¦¯à¦¼à§‡à¦¡ SDK, NDK, Java à¦“ à¦¸à¦¬ à¦¡à¦¿à¦ªà§‡à¦¨à§à¦¡à§‡à¦¨à§à¦¸à¦¿ à¦ªà§à¦°à¦¿-à¦‡à¦¨à§à¦¸à¦Ÿà¦²à§à¦¡ à¦¥à¦¾à¦•à§‡, à¦•à§‹à¦¨à§‹ Broken Pipe à¦¹à§Ÿ à¦¨à¦¾!
                  </p>
                </div>
              </div>

              <div className="bg-white border border-amber-300 rounded-lg p-3.5 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 font-mono flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    à§§à§¦à§¦% à¦¨à¦¿à¦°à§à¦­à¦°à¦¯à§‹à¦—à§à¦¯ .github/workflows/build-apk.yml à¦•à§‹à¦¡ (à¦®à¦¾à¦¤à§à¦° à§©à¦Ÿà¦¿ à¦¸à§à¦Ÿà§‡à¦ª):
                  </span>
                  <button
                    onClick={() => copySnippet(`name: Build Android APK with Buildozer

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Build with Buildozer Action (Official Docker)
        uses: ArtemSBulgakov/buildozer-action@v1
        id: buildozer
        with:
          workdir: .
          buildozer_version: stable

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: CamScanner-Android-APK
          path: \${{ steps.buildozer.outputs.filename }}`, 99)}
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copiedIndex === 99 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedIndex === 99 ? 'à¦•à¦ªà¦¿ à¦¹à§Ÿà§‡à¦›à§‡!' : 'à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦…à§à¦¯à¦¾à¦•à¦¶à¦¨ à¦•à§‹à¦¡ à¦•à¦ªà¦¿ à¦•à¦°à§à¦¨'}
                  </button>
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded p-2 text-[11px] text-stone-700 space-y-1">
                  <p><strong>à§¨à¦Ÿà¦¿ à¦œà¦°à§à¦°à¦¿ à¦ªà¦¦à¦•à§à¦·à§‡à¦ª:</strong></p>
                  <p>à§§. à¦†à¦ªà¦¨à¦¾à¦° à¦—à¦¿à¦Ÿà¦¹à¦¾à¦¬à§‡à¦° <strong><code className="bg-white px-1 py-0.5 border rounded">.github/workflows/build-apk.yml</code></strong> à¦«à¦¾à¦‡à¦²à§‡ à¦à¦‡ à¦•à§‹à¦¡à¦Ÿà¦¿ à¦ªà§‡à¦¸à§à¦Ÿ à¦•à¦°à§‡ Commit à¦•à¦°à§à¦¨à¥¤</p>
                  <p>à§¨. à¦†à¦ªà¦¨à¦¾à¦° <strong><code className="bg-white px-1 py-0.5 border rounded">buildozer.spec</code></strong> à¦«à¦¾à¦‡à¦²à§‡ requirements à¦²à¦¾à¦‡à¦¨à¦Ÿà¦¿ à¦¨à¦¿à¦šà§‡à¦° à¦®à¦¤à§‹ à¦¨à¦¿à¦¶à§à¦šà¦¿à¦¤ à¦•à¦°à§à¦¨ (à¦¯à§‡à¦–à¦¾à¦¨à§‡ sqlite3 à¦“ reportlab à¦¬à¦¾à¦¦ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦•à¦¾à¦°à¦£ sqlite3 à¦ªà¦¾à¦‡à¦¥à¦¨à§‡ à¦¬à¦¿à¦²à§à¦Ÿ-à¦‡à¦¨ à¦à¦¬à¦‚ Pillow à¦¦à¦¿à§Ÿà§‡ PDF à¦¤à§ˆà¦°à¦¿ à¦¹à§Ÿ):</p>
                  <code className="block bg-stone-900 text-emerald-400 p-2 rounded font-mono text-[11px]">requirements = python3,kivy,kivymd,pillow,numpy,opencv,pyjnius,android</code>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-stone-900 font-bold text-sm">
              <div className="p-2 bg-stone-100 rounded-lg text-stone-800">
                <Github className="w-4 h-4" />
              </div>
              <span>à¦ªà¦¦à§à¦§à¦¤à¦¿ à§§: GitHub Actions à¦¦à¦¿à§Ÿà§‡ à¦…à¦Ÿà§‹à¦®à§‡à¦Ÿà¦¿à¦• APK à¦¤à§ˆà¦°à¦¿ (à¦¸à¦¬à¦šà§‡à¦¯à¦¼à§‡ à¦¸à¦¹à¦œ à¦“ à¦°à§‡à¦•à¦®à§‡à¦¨à§à¦¡à§‡à¦¡)</span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              à¦†à¦ªà¦¨à¦¾à¦° à¦²à§‹à¦•à¦¾à¦² à¦ªà¦¿à¦¸à¦¿à¦¤à§‡ à¦•à§‹à¦¨à§‹ à¦­à¦¾à¦°à§€ Android Studio, NDK à¦¬à¦¾ à¦²à¦¿à¦¨à¦¾à¦•à§à¦¸ à¦‡à¦¨à§à¦¸à¦Ÿà¦² à¦•à¦°à¦¾à¦° à¦ªà§à¦°à§Ÿà§‹à¦œà¦¨ à¦¨à§‡à¦‡à¥¤ à¦ªà§à¦°à¦œà§‡à¦•à§à¦Ÿà§‡ <code className="bg-stone-100 px-1.5 py-0.5 rounded text-teal-800 font-mono font-semibold">.github/workflows/build-apk.yml</code> à¦¤à§ˆà¦°à¦¿ à¦°à§Ÿà§‡à¦›à§‡à¥¤
            </p>

            <div className="space-y-4 text-xs text-stone-700">
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex flex-col gap-2">
                <span className="font-bold text-stone-900 flex items-center gap-2">
                  <span className="bg-teal-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-[11px]">à§§</span>
                  à¦—à¦¿à¦Ÿà¦¹à¦¾à¦¬à§‡ à¦°à¦¿à¦ªà§‹à¦œà¦¿à¦Ÿà¦°à¦¿ à¦¤à§ˆà¦°à¦¿ à¦“ à¦•à§‹à¦¡ à¦ªà§à¦¶ à¦•à¦°à§à¦¨:
                </span>
                <p className="text-stone-500 text-[11px]">
                  à¦ªà§à¦°à¦¥à¦®à§‡ GitHub-à¦ à¦à¦•à¦Ÿà¦¿ à¦¨à¦¤à§à¦¨ à¦°à¦¿à¦ªà§‹à¦œà¦¿à¦Ÿà¦°à¦¿ (à¦¯à§‡à¦®à¦¨: <code className="font-mono">CamScannerPython</code>) à¦–à§à¦²à§à¦¨à¥¤ à¦à¦°à¦ªà¦° à¦ªà§à¦°à¦œà§‡à¦•à§à¦Ÿ à¦«à§‹à¦²à§à¦¡à¦¾à¦°à§‡ à¦Ÿà¦¾à¦°à§à¦®à¦¿à¦¨à¦¾à¦²à§‡ à¦¨à¦¿à¦šà§‡à¦° à¦•à¦®à¦¾à¦¨à§à¦¡à¦—à§à¦²à§‹ à¦¦à¦¿à¦¨:
                </p>
                <div className="bg-stone-900 text-stone-200 p-3 rounded-lg font-mono text-[11px] relative group">
                  <pre>{`git init
git add .
git commit -m "Initial commit: CamScanner Python Android App"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/CamScannerPython.git
git push -u origin main`}</pre>
                  <button
                    onClick={() => copySnippet(`git init\ngit add .\ngit commit -m "Initial commit: CamScanner Python Android App"\ngit branch -M main\ngit remote add origin https://github.com/YOUR_GITHUB_USERNAME/CamScannerPython.git\ngit push -u origin main`, 1)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-300"
                  >
                    {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex flex-col gap-2">
                <span className="font-bold text-stone-900 flex items-center gap-2">
                  <span className="bg-teal-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-[11px]">à§¨</span>
                  GitHub Actions à¦Ÿà§à¦¯à¦¾à¦¬à§‡ à¦¬à¦¿à¦²à§à¦¡ à¦…à¦—à§à¦°à¦—à¦¤à¦¿ à¦ªà¦°à§à¦¯à¦¬à§‡à¦•à§à¦·à¦£ à¦•à¦°à§à¦¨:
                </span>
                <p className="text-stone-600 leading-relaxed">
                  à¦•à§‹à¦¡ à¦ªà§à¦¶ à¦¹à¦“à§Ÿà¦¾à¦° à¦¸à¦¾à¦¥à§‡ à¦¸à¦¾à¦¥à§‡ GitHub Actions à¦°à¦¾à¦¨à¦¾à¦° Ubuntu 22.04 à¦‡à¦¨à¦¸à§à¦Ÿà§à¦¯à¦¾à¦¨à§à¦¸à§‡ Buildozer, Android SDK/NDK, KivyMD à¦“ OpenCV à¦•à¦®à§à¦ªà¦¾à¦‡à¦² à¦•à¦°à¦¾ à¦¶à§à¦°à§ à¦•à¦°à¦¬à§‡à¥¤ à¦ªà§à¦°à§‹ à¦¬à¦¿à¦²à§à¦¡ à¦¸à¦®à§à¦ªà¦¨à§à¦¨ à¦¹à¦¤à§‡ à¦ªà§à¦°à¦¾à¦¯à¦¼ à§§à§«â€“à§¨à§¦ à¦®à¦¿à¦¨à¦¿à¦Ÿ à¦¸à¦®à§Ÿ à¦¨à§‡à§Ÿà¥¤
                </p>
              </div>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex flex-col gap-2">
                <span className="font-bold text-stone-900 flex items-center gap-2">
                  <span className="bg-teal-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-[11px]">à§©</span>
                  à¦¤à§ˆà¦°à¦¿ à¦¹à¦“à§Ÿà¦¾ APK à¦¡à¦¾à¦‰à¦¨à¦²à§‹à¦¡ à¦“ à¦«à§‹à¦¨à§‡ à¦‡à¦¨à¦¸à§à¦Ÿà¦² à¦•à¦°à§à¦¨:
                </span>
                <p className="text-stone-600 leading-relaxed">
                  à¦¬à¦¿à¦²à§à¦¡ à¦¶à§‡à¦· à¦¹à¦²à§‡ à¦¸à¦¬à§à¦œ à¦šà§‡à¦•à¦®à¦¾à¦°à§à¦• à¦¦à§‡à¦–à¦¾à¦¬à§‡à¥¤ à¦ªà§‡à¦‡à¦œà§‡à¦° à¦¨à¦¿à¦šà§‡à¦° <strong>Artifacts</strong> à¦¸à§‡à¦•à¦¶à¦¨ à¦¥à§‡à¦•à§‡ <span className="font-mono font-semibold text-teal-800">CamScanner-Android-APK</span> à¦œà¦¿à¦ª à¦«à¦¾à¦‡à¦²à¦Ÿà¦¿ à¦¡à¦¾à¦‰à¦¨à¦²à§‹à¦¡ à¦•à¦°à§‡ à¦«à§‹à¦¨à§‡ à¦¨à¦¿à§Ÿà§‡ à¦‡à¦¨à¦¸à§à¦Ÿà¦² à¦•à¦°à§‡ à¦¨à¦¿à¦¨à¥¤
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>à¦•à§à¦²à¦¾à¦‰à¦¡ à¦¬à¦¿à¦²à§à¦¡à§‡à¦° à¦¸à§à¦¬à¦¿à¦§à¦¾</span>
              </div>
              <ul className="text-[11px] text-emerald-800 space-y-2 leading-relaxed">
                <li>â€¢ à¦ªà¦¿à¦¸à¦¿à¦¤à§‡ à§¨à§«-à§©à§¦ à¦œà¦¿à¦¬à¦¿ NDK/SDK à¦¸à§à¦Ÿà§‹à¦°à§‡à¦œ à¦¦à¦°à¦•à¦¾à¦° à¦¹à§Ÿ à¦¨à¦¾à¥¤</li>
                <li>â€¢ à¦°â€à§à¦¯à¦¾à¦® à¦•à¦® à¦¬à¦¾ à¦‰à¦‡à¦¨à§à¦¡à§‹à¦œ à¦…à¦ªà¦¾à¦°à§‡à¦Ÿà¦¿à¦‚ à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦®à§‡ à¦•à§‹à¦¨à§‹ à¦•à¦¨à¦«à§à¦²à¦¿à¦•à§à¦Ÿ à¦¤à§ˆà¦°à¦¿ à¦¹à§Ÿ à¦¨à¦¾à¥¤</li>
                <li>â€¢ à¦¯à§‡à¦•à§‹à¦¨à§‹ à¦¸à¦®à§Ÿ à¦¯à§‡à¦•à§‹à¦¨à§‹ à¦¡à¦¿à¦­à¦¾à¦‡à¦¸à§‡ à¦—à¦¿à¦Ÿ à¦ªà§à¦¶ à¦•à¦°à¦²à§‡à¦‡ à¦¨à¦¤à§à¦¨ APK à¦¤à§ˆà¦°à¦¿ à¦¹à§Ÿà¥¤</li>
              </ul>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 flex flex-col gap-2">
              <span className="text-xs font-bold text-stone-900">à¦‡à¦¨à¦¸à§à¦Ÿà¦²à§‡à¦¶à¦¨ à¦ªà¦¾à¦°à¦®à¦¿à¦¶à¦¨ à¦¨à§‹à¦Ÿ</span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                à¦…à§à¦¯à¦¾à¦¨à§à¦¡à§à¦°à§Ÿà§‡à¦¡ à¦«à§‹à¦¨à§‡ à¦‡à¦¨à¦¸à§à¦Ÿà¦² à¦•à¦°à¦¾à¦° à¦¸à¦®à§Ÿ &quot;Install from unknown sources&quot; à¦ªà¦¾à¦°à¦®à¦¿à¦¶à¦¨ à¦¦à¦¿à¦¨à¥¤ à¦…à§à¦¯à¦¾à¦ªà¦Ÿà¦¿à¦¤à§‡ <code className="font-mono text-teal-700">CAMERA</code> à¦“ <code className="font-mono text-teal-700">WRITE_EXTERNAL_STORAGE</code> à¦ªà¦¾à¦°à¦®à¦¿à¦¶à¦¨ à¦ªà§à¦°à¦¥à¦®à¦¬à¦¾à¦° à¦–à§‹à¦²à¦¾à¦° à¦¸à¦®à§Ÿ à¦°à¦¿à¦•à§‹à§Ÿà§‡à¦¸à§à¦Ÿ à¦•à¦°à¦¾ à¦¹à¦¬à§‡à¥¤
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Local WSL2 / Ubuntu */}
      {activeTab === 'wsl' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white border border-stone-200 rounded-xl p-6 shadow-xs flex flex-col gap-5">
            <div className="flex items-center gap-2.5 text-stone-900 font-bold text-sm">
              <div className="p-2 bg-stone-100 rounded-lg text-stone-800">
                <Terminal className="w-4 h-4" />
              </div>
              <span>à¦ªà¦¦à§à¦§à¦¤à¦¿ à§¨: à¦²à§‹à¦•à¦¾à¦² à¦ªà¦¿à¦¸à¦¿à¦¤à§‡ (WSL2 / Ubuntu 22.04) à¦¬à¦¿à¦²à§à¦¡ à¦•à¦°à¦¾à¦° à¦•à¦®à¦¾à¦¨à§à¦¡</span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              à¦†à¦ªà¦¨à¦¿ à¦¯à¦¦à¦¿ à¦²à§‹à¦•à¦¾à¦² à¦¡à§‡à¦­à§‡à¦²à¦ªà¦®à§‡à¦¨à§à¦Ÿ à¦“ à¦¦à§à¦°à§à¦¤ à¦•à§‹à¦¡ à¦à¦¡à¦¿à¦Ÿà¦¿à¦‚ à¦•à¦°à¦¤à§‡ à¦šà¦¾à¦¨, à¦¤à¦¬à§‡ à¦²à¦¿à¦¨à¦¾à¦•à§à¦¸ à¦¬à¦¾ à¦‰à¦‡à¦¨à§à¦¡à§‹à¦œ WSL2 (Ubuntu 22.04 LTS) à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à§‡ à¦¨à¦¿à¦šà§‡ à¦‰à¦²à§à¦²à§‡à¦–à¦¿à¦¤ à¦¸à§à¦Ÿà§‡à¦ªà¦—à§à¦²à§‹ à¦…à¦¨à§à¦¸à¦°à¦£ à¦•à¦°à§à¦¨:
            </p>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-stone-800">à¦§à¦¾à¦ª à§§: à¦²à¦¿à¦¨à¦¾à¦•à§à¦¸ à¦¬à¦¿à¦²à§à¦¡ à¦¡à¦¿à¦ªà§‡à¦¨à§à¦¡à§‡à¦¨à§à¦¸à¦¿ à¦“ à¦²à¦¾à¦‡à¦¬à§à¦°à§‡à¦°à¦¿ à¦‡à¦¨à¦¸à§à¦Ÿà¦²</span>
                <div className="bg-stone-900 text-stone-200 p-3 rounded-lg mt-1 font-mono text-[11px] relative group">
                  <pre>{`sudo apt update && sudo apt install -y \\
  python3-pip python3-venv git zip unzip openjdk-17-jdk \\
  autoconf automake libtool pkg-config zlib1g-dev \\
  libncurses5-dev cmake libffi-dev libssl-dev libsqlite3-dev`}</pre>
                  <button
                    onClick={() => copySnippet(`sudo apt update && sudo apt install -y python3-pip python3-venv git zip unzip openjdk-17-jdk autoconf automake libtool pkg-config zlib1g-dev libncurses5-dev cmake libffi-dev libssl-dev libsqlite3-dev`, 2)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-300"
                  >
                    {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-stone-800">à¦§à¦¾à¦ª à§¨: à¦­à¦¾à¦°à§à¦šà§à§Ÿà¦¾à¦² à¦à¦¨à¦­à¦¾à¦¯à¦¼à¦°à¦¨à¦®à§‡à¦¨à§à¦Ÿ à¦“ à¦¬à¦¿à¦²à§à¦¡à§‹à¦œà¦¾à¦° à¦‡à¦¨à¦¸à§à¦Ÿà¦²</span>
                <div className="bg-stone-900 text-stone-200 p-3 rounded-lg mt-1 font-mono text-[11px] relative group">
                  <pre>{`python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install buildozer cython==0.29.36`}</pre>
                  <button
                    onClick={() => copySnippet(`python3 -m venv venv\nsource venv/bin/activate\npip install --upgrade pip setuptools wheel\npip install buildozer cython==0.29.36`, 3)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-300"
                  >
                    {copiedIndex === 3 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-stone-800">à¦§à¦¾à¦ª à§©: APK à¦•à¦®à§à¦ªà¦¾à¦‡à¦² à¦“ à¦œà§‡à¦¨à¦¾à¦°à§‡à¦¶à¦¨</span>
                <div className="bg-stone-900 text-stone-200 p-3 rounded-lg mt-1 font-mono text-[11px] relative group">
                  <pre>{`buildozer -v android debug`}</pre>
                  <button
                    onClick={() => copySnippet(`buildozer -v android debug`, 4)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-300"
                  >
                    {copiedIndex === 4 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  à¦•à¦®à§à¦ªà¦¾à¦‡à¦²à§‡à¦¶à¦¨ à¦¸à¦«à¦² à¦¹à¦²à§‡ APK à¦«à¦¾à¦‡à¦²à¦Ÿà¦¿ à¦ªà§à¦°à¦œà§‡à¦•à§à¦Ÿà§‡à¦° <code className="font-mono text-teal-800 font-semibold">bin/</code> à¦«à§‹à¦²à§à¦¡à¦¾à¦°à§‡ à¦œà¦®à¦¾ à¦¹à¦¬à§‡ (à¦¯à§‡à¦®à¦¨: <code className="font-mono">camscanner-0.1.0-arm64-v8a-debug.apk</code>)à¥¤
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-stone-50 border border-stone-200 rounded-xl p-5 flex flex-col gap-3">
            <span className="text-xs font-bold text-stone-900">à¦¹à¦¾à¦°à§à¦¡à¦“à§Ÿà§à¦¯à¦¾à¦° à¦°à¦¿à¦•à§‹à§Ÿà¦¾à¦°à¦®à§‡à¦¨à§à¦Ÿà¦¸</span>
            <ul className="text-xs text-stone-600 space-y-2">
              <li>â€¢ <strong>à¦°â€à§à¦¯à¦¾à¦®:</strong> à¦•à¦®à¦ªà¦•à§à¦·à§‡ 8GB RAM (16GB à¦°à§‡à¦•à¦®à§‡à¦¨à§à¦¡à§‡à¦¡)</li>
              <li>â€¢ <strong>à¦¡à¦¿à¦¸à§à¦• à¦¸à§à¦ªà§‡à¦¸:</strong> à¦•à¦®à¦ªà¦•à§à¦·à§‡ 20GB à¦«à§à¦°à¦¿ à¦¸à§à¦ªà§‡à¦¸ (Android SDK, NDK à¦“ à¦ªà¦¾à¦‡à¦¥à¦¨ à¦°à§‡à¦¸à¦¿à¦ªà¦¿ à¦•à§à¦¯à¦¾à¦¶à¦¿à¦‚à§Ÿà§‡à¦° à¦œà¦¨à§à¦¯)</li>
              <li>â€¢ <strong>à¦‡à¦¨à§à¦Ÿà¦¾à¦°à¦¨à§‡à¦Ÿ:</strong> à¦ªà§à¦°à¦¥à¦®à¦¬à¦¾à¦° à¦¬à¦¿à¦²à§à¦¡ à¦•à¦°à¦¾à¦° à¦¸à¦®à§Ÿ à¦ªà§à¦°à¦¾à¦¯à¦¼ 2-3 GB à¦Ÿà§à¦²à¦šà§‡à¦‡à¦¨ à¦¡à¦¾à¦‰à¦¨à¦²à§‹à¦¡ à¦¹à¦¬à§‡</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: USB Deployment & Play Store Signing */}
      {activeTab === 'deploy' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2.5 text-stone-900 font-bold text-sm">
              <div className="p-2 bg-stone-100 rounded-lg text-stone-800">
                <Smartphone className="w-4 h-4" />
              </div>
              <span>USB Debugging à¦¦à¦¿à§Ÿà§‡ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦«à§‹à¦¨à§‡ à¦°à¦¾à¦¨ à¦“ Logcat à¦¦à§‡à¦–à¦¾</span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              à¦®à§‹à¦¬à¦¾à¦‡à¦²à§‡ <strong>Developer Options</strong> à¦à¦¬à¦‚ <strong>USB Debugging</strong> à¦…à¦¨ à¦•à¦°à§‡ à¦‡à¦‰à¦à¦¸à¦¬à¦¿ à¦•à§à¦¯à¦¾à¦¬à¦² à¦¦à¦¿à§Ÿà§‡ à¦ªà¦¿à¦¸à¦¿à¦° à¦¸à¦¾à¦¥à§‡ à¦¯à§à¦•à§à¦¤ à¦•à¦°à§à¦¨:
            </p>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-stone-800">à¦à¦• à¦•à§à¦²à¦¿à¦•à§‡ à¦¬à¦¿à¦²à§à¦¡, à¦‡à¦¨à¦¸à§à¦Ÿà¦² à¦“ à¦°à¦¿à§Ÿà§‡à¦²-à¦Ÿà¦¾à¦‡à¦® à¦²à¦— à¦¦à§‡à¦–à¦¾:</span>
                <div className="bg-stone-900 text-stone-200 p-3 rounded-lg mt-1 font-mono text-[11px] relative group">
                  <pre>{`buildozer android debug deploy run logcat`}</pre>
                  <button
                    onClick={() => copySnippet(`buildozer android debug deploy run logcat`, 5)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-300"
                  >
                    {copiedIndex === 5 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-stone-800">à¦¶à§à¦§à§à¦®à¦¾à¦¤à§à¦° à¦ªà¦¾à¦‡à¦¥à¦¨à§‡à¦° à¦°à¦¿à§Ÿà§‡à¦²-à¦Ÿà¦¾à¦‡à¦® à¦•à¦¨à¦¸à§‹à¦² à¦²à¦— à¦«à¦¿à¦²à§à¦Ÿà¦¾à¦° à¦•à¦°à¦¤à§‡:</span>
                <div className="bg-stone-900 text-stone-200 p-3 rounded-lg mt-1 font-mono text-[11px] relative group">
                  <pre>{`adb logcat -s python`}</pre>
                  <button
                    onClick={() => copySnippet(`adb logcat -s python`, 6)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-300"
                  >
                    {copiedIndex === 6 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2.5 text-stone-900 font-bold text-sm">
              <div className="p-2 bg-stone-100 rounded-lg text-stone-800">
                <FileKey className="w-4 h-4" />
              </div>
              <span>Google Play Store à¦°à¦¿à¦²à¦¿à¦œ à¦¸à¦¾à¦‡à¦¨à¦¿à¦‚ (Signed Release APK)</span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              à¦ªà§à¦°à§‹à¦¡à¦¾à¦•à¦¶à¦¨ à¦¬à¦¾ à¦ªà§à¦²à§‡ à¦¸à§à¦Ÿà§‹à¦°à§‡ à¦†à¦ªà¦²à§‹à¦¡à§‡à¦° à¦œà¦¨à§à¦¯ Release Keystore à¦¤à§ˆà¦°à¦¿ à¦“ à¦¸à¦¾à¦‡à¦¨ à¦•à¦°à¦¾à¦° à¦¨à¦¿à¦°à§à¦¦à§‡à¦¶à¦¿à¦•à¦¾:
            </p>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-stone-800">à§§. à¦¸à¦¿à¦•à¦¿à¦‰à¦° à¦•à§€à¦¸à§à¦Ÿà§‹à¦° à¦œà§‡à¦¨à¦¾à¦°à§‡à¦Ÿ à¦•à¦°à§à¦¨:</span>
                <div className="bg-stone-900 text-stone-200 p-3 rounded-lg mt-1 font-mono text-[11px] relative group">
                  <pre>{`keytool -genkey -v -keystore camscanner.keystore \\
  -alias camscanner -keyalg RSA -keysize 2048 -validity 10000`}</pre>
                  <button
                    onClick={() => copySnippet(`keytool -genkey -v -keystore camscanner.keystore -alias camscanner -keyalg RSA -keysize 2048 -validity 10000`, 7)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-300"
                  >
                    {copiedIndex === 7 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-stone-800">à§¨. à¦°à¦¿à¦²à¦¿à¦œ APK à¦¬à¦¿à¦²à§à¦¡ à¦•à¦°à§à¦¨:</span>
                <div className="bg-stone-900 text-stone-200 p-3 rounded-lg mt-1 font-mono text-[11px] relative group">
                  <pre>{`buildozer -v android release`}</pre>
                  <button
                    onClick={() => copySnippet(`buildozer -v android release`, 8)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-300"
                  >
                    {copiedIndex === 8 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Troubleshooting */}
      {activeTab === 'troubleshoot' && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>à¦¸à¦šà¦°à¦¾à¦šà¦° à¦¹à¦“à¦¯à¦¼à¦¾ à¦à¦°à¦° à¦à¦¬à¦‚ à¦¸à¦®à¦¾à¦§à¦¾à¦¨ (Buildozer FAQ)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg flex flex-col gap-1.5">
              <span className="font-bold text-stone-800">à§§. Cython compile error</span>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Kivy 2.3 à¦¸à¦¾à¦§à¦¾à¦°à¦£à¦¤ Cython 3 à¦à¦° à¦¸à¦¾à¦¥à§‡ à¦•à¦®à§à¦ªà§à¦¯à¦¾à¦Ÿà¦¿à¦¬à¦¿à¦²à¦¿à¦Ÿà¦¿ à¦‡à¦¸à§à¦¯à§ à¦•à¦°à§‡à¥¤ à¦¸à¦®à¦¾à¦§à¦¾à¦¨: à¦¸à¦¬à¦¸à¦®à§Ÿ <code className="font-mono bg-stone-200 px-1 rounded text-stone-800">pip install cython==0.29.36</code> à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à§à¦¨à¥¤
              </p>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg flex flex-col gap-1.5">
              <span className="font-bold text-stone-800">à§¨. Android NDK r25b Compatibility</span>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                à¦¬à¦¿à¦²à§à¦¡à§‹à¦œà¦¾à¦° à¦¸à§à¦ªà§‡à¦•à§‡ <code className="font-mono bg-stone-200 px-1 rounded text-stone-800">android.ndk = 25b</code> à¦¸à§‡à¦Ÿ à¦•à¦°à¦¾ à¦°à§Ÿà§‡à¦›à§‡ à¦¯à¦¾ Android API 34 à¦“ KivyMD à¦à¦° à¦¸à¦¾à¦¥à§‡ à§§à§¦à§¦% à¦•à¦®à§à¦ªà§à¦¯à¦¾à¦Ÿà¦¿à¦¬à¦²à¥¤
              </p>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg flex flex-col gap-1.5">
              <span className="font-bold text-stone-800">à§©. Camera Black Screen in Android 13/14</span>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Android 13+ à¦ à¦•à§à¦¯à¦¾à¦®à§‡à¦°à¦¾ à¦ªà¦¾à¦°à¦®à¦¿à¦¶à¦¨ à¦°à¦¾à¦¨à¦Ÿà¦¾à¦‡à¦®à§‡ à¦¦à¦¿à¦¤à§‡ à¦¹à§Ÿà¥¤ à¦†à¦®à¦¾à¦¦à§‡à¦° <code className="font-mono bg-stone-200 px-1 rounded text-stone-800">main.py</code>-à¦¤à§‡ <code className="font-mono">request_permissions()</code> à¦¹à§à¦¯à¦¾à¦¨à§à¦¡à¦²à¦¾à¦° à¦°à§Ÿà§‡à¦›à§‡ à¦¯à¦¾ à¦…à§à¦¯à¦¾à¦ª à¦…à¦¨ à¦•à¦°à¦¾à¦° à¦¸à¦¾à¦¥à§‡ à¦¸à¦¾à¦¥à§‡ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦•à§‡ à¦ªà¦¾à¦°à¦®à¦¿à¦¶à¦¨ à¦¡à¦¾à§Ÿà¦¾à¦²à¦— à¦ªà§à¦°à¦¦à¦°à§à¦¶à¦¨ à¦•à¦°à§‡à¥¤
              </p>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg flex flex-col gap-1.5">
              <span className="font-bold text-stone-800">à§ª. Out of Memory on WSL2</span>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                WSL2 à¦ à¦®à§‡à¦®à§‹à¦°à¦¿ à¦•à¦® à¦¹à¦²à§‡ à¦†à¦ªà¦¨à¦¾à¦° à¦‰à¦‡à¦¨à§à¦¡à§‹à¦œà§‡à¦° <code className="font-mono bg-stone-200 px-1 rounded text-stone-800">%USERPROFILE%/.wslconfig</code> à¦«à¦¾à¦‡à¦²à§‡ <code className="font-mono">memory=8GB</code> à¦à¦¬à¦‚ <code className="font-mono">swap=8GB</code> à¦¬à¦°à¦¾à¦¦à§à¦¦ à¦•à¦°à§‡ à¦¨à¦¿à¦¨à¥¤
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
