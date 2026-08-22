import { downloadFile } from "../../utils/fileDownloader";
import React, { useState, useRef } from 'react';
import { Archive, Upload, Download, FileText, Trash2, Plus, CheckCircle2, FolderArchive, RefreshCw } from 'lucide-react';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';

export default function ZipTool() {
  const [mode, setMode] = useState('create'); // 'create' or 'extract'

  // Create ZIP state
  const [createFiles, setCreateFiles] = useState([]);
  const [zipName, setZipName] = useState('archive.zip');
  const [isZipping, setIsZipping] = useState(false);
  const createFileRef = useRef(null);

  // Extract ZIP state
  const [extractedZipFile, setExtractedZipFile] = useState(null);
  const [extractedEntries, setExtractedEntries] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const extractFileRef = useRef(null);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // --- CREATE ZIP HANDLERS ---
  const handleAddFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setCreateFiles(prev => [...prev, ...files]);
  };

  const removeCreateFile = (index) => {
    setCreateFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerateZip = async () => {
    if (createFiles.length === 0) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      createFiles.forEach((file) => {
        zip.file(file.name, file);
      });

      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = zipName.endsWith('.zip') ? zipName : `${zipName}.zip`;
      a.click();
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
    } catch (err) {
      alert('Error creating ZIP: ' + err.message);
    } finally {
      setIsZipping(false);
    }
  };

  // --- EXTRACT ZIP HANDLERS ---
  const handleZipUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtractedZipFile(file);
    setIsExtracting(true);
    setExtractedEntries([]);

    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);
      const entries = [];

      const promises = Object.keys(loadedZip.files).map(async (filename) => {
        const entry = loadedZip.files[filename];
        if (!entry.dir) {
          const blob = await entry.async('blob');
          entries.push({
            name: filename,
            size: blob.size,
            blob: blob
          });
        }
      });

      await Promise.all(promises);
      setExtractedEntries(entries);
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      alert('Failed to read ZIP file: ' + err.message);
    } finally {
      setIsExtracting(false);
    }
  };

  const downloadSingleExtractedFile = (entry) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(entry.blob);
    a.download = entry.name.split('/').pop() || entry.name;
    a.click();
  };

  const downloadAllExtractedFiles = () => {
    extractedEntries.forEach(entry => {
      downloadSingleExtractedFile(entry);
    });
  };

  const totalCreateSize = createFiles.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="space-y-6 text-left">
      {/* Mode Switch Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-md mx-auto">
        <button
          onClick={() => setMode('create')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            mode === 'create'
              ? 'bg-[#3525cd] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <FolderArchive className="h-4 w-4" /> Create ZIP File
        </button>
        <button
          onClick={() => setMode('extract')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            mode === 'extract'
              ? 'bg-[#3525cd] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Archive className="h-4 w-4" /> Extract / UnZIP
        </button>
      </div>

      {/* MODE 1: CREATE ZIP */}
      {mode === 'create' && (
        <div className="space-y-6">
          <div
            onClick={() => createFileRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#3525cd] dark:hover:border-[#c3c0ff] p-10 rounded-2xl text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/40 space-y-3"
          >
            <input
              ref={createFileRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleAddFiles}
            />
            <div className="w-14 h-14 bg-indigo-500/10 text-[#3525cd] dark:text-[#c3c0ff] rounded-2xl flex items-center justify-center mx-auto">
              <Upload className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Choose Files to Compress</h3>
              <p className="text-xs text-slate-500 mt-1">Select documents, images, code files, or any format</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3525cd] text-white text-xs font-bold rounded-xl shadow-sm">
              <Plus className="h-3.5 w-3.5" /> Browse Files
            </span>
          </div>

          {createFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Selected Files: <strong>{createFiles.length}</strong> • Total Size: <strong>{formatBytes(totalCreateSize)}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label className="text-xs font-bold text-slate-500 whitespace-nowrap">ZIP Name:</label>
                  <input
                    type="text"
                    value={zipName}
                    onChange={(e) => setZipName(e.target.value)}
                    className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {createFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{file.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({formatBytes(file.size)})</span>
                    </div>
                    <button
                      onClick={() => removeCreateFile(idx)}
                      className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setCreateFiles([])}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Clear All
                </button>
                <button
                  onClick={handleGenerateZip}
                  disabled={isZipping}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {isZipping ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Download {zipName}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: EXTRACT / UNZIP */}
      {mode === 'extract' && (
        <div className="space-y-6">
          <div
            onClick={() => extractFileRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#3525cd] dark:hover:border-[#c3c0ff] p-10 rounded-2xl text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/40 space-y-3"
          >
            <input
              ref={extractFileRef}
              type="file"
              accept=".zip,application/zip"
              className="hidden"
              onChange={handleZipUpload}
            />
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
              <Archive className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Choose .ZIP Archive to Extract</h3>
              <p className="text-xs text-slate-500 mt-1">100% private in-browser decompression without server uploads</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm">
              <Upload className="h-3.5 w-3.5" /> Select .ZIP File
            </span>
          </div>

          {isExtracting && (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <RefreshCw className="h-6 w-6 text-[#3525cd] animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Extracting ZIP contents...</p>
            </div>
          )}

          {extractedEntries.length > 0 && !isExtracting && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Extracted <strong>{extractedEntries.length}</strong> files from <strong>{extractedZipFile?.name}</strong>
                </span>
                <button
                  onClick={downloadAllExtractedFiles}
                  className="px-4 py-1.5 bg-[#3525cd] hover:bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="h-3.5 w-3.5" /> Download All Files
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {extractedEntries.map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{entry.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({formatBytes(entry.size)})</span>
                    </div>
                    <button
                      onClick={() => downloadSingleExtractedFile(entry)}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-[#3525cd] hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      <Download className="h-3.5 w-3.5" /> Save
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
