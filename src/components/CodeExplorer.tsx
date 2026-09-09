import React, { useState } from 'react';
import {
  FileCode,
  Download,
  Copy,
  Check,
  FolderTree,
  FileText,
  Smartphone,
  Cpu,
  Database,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import JSZip from 'jszip';
import { PROJECT_FILES, ProjectFile } from '../projectFiles';

export function CodeExplorer() {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      // Add all project files into the zip archive
      PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.code);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'CamScannerPython-Full-Project.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create ZIP file:', err);
      alert('Error creating zip bundle.');
    } finally {
      setIsZipping(false);
    }
  };

  const getCategoryIcon = (category: ProjectFile['category']) => {
    switch (category) {
      case 'scanner':
        return <Cpu className="w-4 h-4 text-emerald-600" />;
      case 'image_processing':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'ocr':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'database':
      case 'storage':
        return <Database className="w-4 h-4 text-purple-600" />;
      case 'ui':
        return <Smartphone className="w-4 h-4 text-teal-600" />;
      default:
        return <FileCode className="w-4 h-4 text-stone-600" />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Banner with 1-Click ZIP Download */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider">
            <FolderTree className="w-4 h-4" /> Python & Android Project Tree
          </div>
          <h2 className="text-xl font-bold">All 30+ Specified Python Modules Generated</h2>
          <p className="text-stone-400 text-xs max-w-2xl">
            Cleanly structured according to the specification with KivyMD, OpenCV 4-corner perspective warp, 10 document enhancement filters, Google ML Kit OCR bridge, SQLite persistence, and Buildozer APK packaging.
          </p>
        </div>

        <button
          onClick={handleDownloadAllZip}
          disabled={isZipping}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all shrink-0 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {isZipping ? 'Bundling ZIP...' : 'Download Full Project (.ZIP)'}
        </button>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* File Tree Column */}
        <div className="lg:col-span-4 bg-stone-50 border border-stone-200 rounded-xl p-3 flex flex-col gap-1 max-h-[640px] overflow-y-auto">
          <div className="px-3 py-2 text-xs font-bold text-stone-500 uppercase tracking-wider border-b border-stone-200 mb-1 flex items-center justify-between">
            <span>Project Files</span>
            <span className="bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full text-[10px]">
              {PROJECT_FILES.length} Files
            </span>
          </div>

          {PROJECT_FILES.map((file) => {
            const isSelected = selectedFile.path === file.path;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs font-semibold'
                    : 'text-stone-700 hover:bg-stone-200/60'
                }`}
              >
                {getCategoryIcon(file.category)}
                <div className="flex-1 truncate">
                  <div className="truncate font-mono">{file.path}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Code Viewer Column */}
        <div className="lg:col-span-8 bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
          {/* File Header */}
          <div className="bg-stone-950 px-5 py-3 border-b border-stone-800 flex items-center justify-between text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <span className="font-mono text-emerald-400 font-bold">{selectedFile.path}</span>
              <span className="text-stone-500">•</span>
              <span className="text-stone-400 hidden sm:inline">{selectedFile.description}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded text-[11px] flex items-center gap-1.5 transition-colors"
                title="Copy code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownloadSingle}
                className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded text-[11px] flex items-center gap-1.5 transition-colors"
                title="Download single file"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </div>

          {/* Code Content */}
          <div className="p-4 max-h-[580px] overflow-auto font-mono text-xs text-stone-200 leading-relaxed bg-[#14181f]">
            <pre>
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
