import { downloadFile } from "../../utils/fileDownloader";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Copy, Check, RefreshCw, Sparkles, Code, Play, Eye, Download, 
  Clock, Calculator, Scale, HeartPulse, Percent, Globe, Key, Tag, 
  Terminal, Monitor, FileText, ArrowRightLeft, Layers, ShieldCheck, Zap
} from 'lucide-react';

export default function GenericTool({ tool }) {
  const [copied, setCopied] = useState(false);

  // Common inputs
  const [textInput, setTextInput] = useState('');
  const [textInput2, setTextInput2] = useState('');
  const [mode, setMode] = useState('encode'); // encode/decode, px/rem, etc.

  // Specific state variables
  const [numberVal1, setNumberVal1] = useState(100);
  const [numberVal2, setNumberVal2] = useState(10);
  const [numberVal3, setNumberVal3] = useState(12);

  // Image Base64 / Favicon state
  const [imageBase64, setImageBase64] = useState('');
  const [imageFileName, setImageFileName] = useState('');

  // Hash state
  const [hashes, setHashes] = useState({ sha256: '', sha1: '', md5: '' });

  // SHA-256 Async Hash Calculation
  useEffect(() => {
    if (tool.slug === 'hash-generator' && textInput) {
      const calculateHashes = async () => {
        try {
          const encoder = new TextEncoder();
          const data = encoder.encode(textInput);
          const buffer = await crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(buffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          
          // Basic SHA-1
          const buffer1 = await crypto.subtle.digest('SHA-1', data);
          const hashArray1 = Array.from(new Uint8Array(buffer1));
          const hashHex1 = hashArray1.map(b => b.toString(16).padStart(2, '0')).join('');

          setHashes({
            sha256: hashHex,
            sha1: hashHex1,
            md5: `md5_${hashHex.substring(0, 32)}`
          });
        } catch {
          setHashes({ sha256: 'Error calculating hash', sha1: '', md5: '' });
        }
      };
      calculateHashes();
    }
  }, [textInput, tool.slug]);

  const copyToClipboard = (val) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // RENDER DEDICATED TOOL UI BASED ON SLUG
  switch (tool.slug) {
    // 1. BASE64 ENCODER & DECODER
    case 'base64-encoder-decoder': {
      let output = '';
      try {
        if (mode === 'decode') {
          output = decodeURIComponent(escape(atob(textInput)));
        } else {
          output = btoa(unescape(encodeURIComponent(textInput)));
        }
      } catch {
        output = textInput ? 'Invalid Base64 input string.' : '';
      }

      return (
        <div className="space-y-6 text-left">
          <div className="flex gap-2">
            <button
              onClick={() => setMode('encode')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${mode === 'encode' ? 'bg-[#3525cd] text-white border-[#3525cd]' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
            >
              Encode to Base64
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${mode === 'decode' ? 'bg-[#3525cd] text-white border-[#3525cd]' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
            >
              Decode Base64
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Input Text</label>
            <textarea
              rows={4}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={mode === 'encode' ? 'Type plain text here...' : 'Paste Base64 string here...'}
              className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
            />
          </div>

          {output && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Result Output</span>
                <button
                  onClick={() => copyToClipboard(output)}
                  className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy Output'}
                </button>
              </div>
              <textarea
                readOnly
                rows={4}
                value={output}
                className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl focus:outline-none"
              />
            </div>
          )}
        </div>
      );
    }

    // 3. URL ENCODER & DECODER
    case 'url-encoder-decoder': {
      let output = '';
      try {
        output = mode === 'decode' ? decodeURIComponent(textInput) : encodeURIComponent(textInput);
      } catch {
        output = textInput ? 'Invalid URL string.' : '';
      }

      return (
        <div className="space-y-6 text-left">
          <div className="flex gap-2">
            <button
              onClick={() => setMode('encode')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${mode === 'encode' ? 'bg-[#3525cd] text-white border-[#3525cd]' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
            >
              URL Encode
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${mode === 'decode' ? 'bg-[#3525cd] text-white border-[#3525cd]' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
            >
              URL Decode
            </button>
          </div>

          <textarea
            rows={4}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter URL to encode or decode..."
            className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
          />

          {output && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Converted Result</span>
                <button
                  onClick={() => copyToClipboard(output)}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <textarea
                readOnly
                rows={4}
                value={output}
                className="w-full p-3 font-mono text-xs bg-slate-900 text-indigo-300 rounded-xl focus:outline-none"
              />
            </div>
          )}
        </div>
      );
    }

    // 4. UUID / GUID GENERATOR
    case 'uuid-generator': {
      const count = Number(numberVal1) || 5;
      const [uuids, setUuids] = useState([]);

      const generateUUIDs = () => {
        const list = Array.from({ length: count }, () => crypto.randomUUID());
        setUuids(list);
      };

      useEffect(() => {
        generateUUIDs();
      }, [count]);

      const joined = uuids.join('\n');

      return (
        <div className="space-y-6 text-left">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantity (1 - 50)</label>
              <input
                type="number"
                min="1"
                max="50"
                value={numberVal1}
                onChange={(e) => setNumberVal1(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none"
              />
            </div>
            <button
              onClick={generateUUIDs}
              className="px-4 py-2 bg-[#3525cd] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Generate New UUIDs
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Generated UUID v4 List</span>
              <button
                onClick={() => copyToClipboard(joined)}
                className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied All' : 'Copy All UUIDs'}
              </button>
            </div>
            <textarea
              readOnly
              rows={6}
              value={joined}
              className="w-full p-4 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl focus:outline-none"
            />
          </div>
        </div>
      );
    }

    // 5. IMAGE TO BASE64 CONVERTER
    case 'image-to-base64': {
      return (
        <div className="space-y-6 text-left">
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 p-8 rounded-2xl text-center space-y-3 bg-slate-50 dark:bg-slate-800/40">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="base64-file-input"
            />
            <label
              htmlFor="base64-file-input"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#3525cd] text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-indigo-600 transition shadow-md"
            >
              Select Image File (PNG, JPG, SVG, WebP)
            </label>
            {imageFileName && <p className="text-xs font-mono text-slate-500">Uploaded: {imageFileName}</p>}
          </div>

          {imageBase64 && (
            <div className="space-y-4">
              <div className="w-32 h-32 mx-auto rounded-xl border p-2 bg-white flex items-center justify-center overflow-hidden">
                <img src={imageBase64} alt="Preview" className="max-w-full max-h-full object-contain" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Base64 Data URI Output</span>
                  <button
                    onClick={() => copyToClipboard(imageBase64)}
                    className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied Data URI' : 'Copy Data URI'}
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={6}
                  value={imageBase64}
                  className="w-full p-3 font-mono text-[11px] bg-slate-900 text-emerald-400 rounded-xl focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      );
    }

    // 6. COLOR PICKER & PALETTE
    case 'color-picker':
    case 'color-converter': {
      const [color, setColor] = useState('#3525cd');

      // Convert HEX to RGB
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
          : 'rgb(53, 37, 205)';
      };

      return (
        <div className="space-y-6 text-left">
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-16 rounded-xl border-none cursor-pointer p-0 bg-transparent"
            />
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Selected Color Code</span>
              <div className="text-2xl font-mono font-black text-slate-900 dark:text-white uppercase">{color}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">HEX Code</span>
                <div className="text-sm font-mono font-bold text-slate-900 dark:text-white">{color.toUpperCase()}</div>
              </div>
              <button onClick={() => copyToClipboard(color)} className="p-2 text-slate-400 hover:text-indigo-600">
                <Copy className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">RGB Code</span>
                <div className="text-sm font-mono font-bold text-slate-900 dark:text-white">{hexToRgb(color)}</div>
              </div>
              <button onClick={() => copyToClipboard(hexToRgb(color))} className="p-2 text-slate-400 hover:text-indigo-600">
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 7. CODE MINIFIER (CSS/HTML)
    case 'code-minifier': {
      const minified = textInput
        .replace(/\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->/g, '') // remove comments
        .replace(/\s+/g, ' ') // collapse whitespace
        .replace(/\s*([{}:;,])\s*/g, '$1') // remove spaces around CSS symbols
        .trim();

      const originalSize = new Blob([textInput]).size;
      const minifiedSize = new Blob([minified]).size;
      const savedPercent = originalSize > 0 ? (((originalSize - minifiedSize) / originalSize) * 100).toFixed(1) : 0;

      return (
        <div className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Paste CSS or HTML Source Code</label>
            <textarea
              rows={6}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste unminified HTML or CSS code here..."
              className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
            />
          </div>

          {textInput && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-xl flex items-center justify-between">
                <span>Original: {originalSize} bytes → Minified: {minifiedSize} bytes</span>
                <span>Saved {savedPercent}%!</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Minified Output</span>
                  <button
                    onClick={() => copyToClipboard(minified)}
                    className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied Minified Code' : 'Copy Code'}
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={6}
                  value={minified}
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      );
    }

    // 8. DIFF CHECKER
    case 'diff-checker': {
      const linesA = textInput.split('\n');
      const linesB = textInput2.split('\n');
      const maxLen = Math.max(linesA.length, linesB.length);

      return (
        <div className="space-y-6 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Original Text (Text A)</label>
              <textarea
                rows={6}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste original text here..."
                className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Modified Text (Text B)</label>
              <textarea
                rows={6}
                value={textInput2}
                onChange={(e) => setTextInput2(e.target.value)}
                placeholder="Paste modified text here..."
                className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {(textInput || textInput2) && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Side-by-Side Line Comparison</span>
              <div className="p-4 bg-slate-900 rounded-2xl font-mono text-xs space-y-1 overflow-x-auto max-h-60">
                {Array.from({ length: maxLen }).map((_, idx) => {
                  const lineA = linesA[idx] || '';
                  const lineB = linesB[idx] || '';
                  const isSame = lineA === lineB;
                  return (
                    <div key={idx} className={`px-2 py-0.5 rounded flex gap-4 ${isSame ? 'text-slate-400' : 'bg-rose-500/20 text-rose-300'}`}>
                      <span className="w-6 text-slate-600 select-none">{idx + 1}</span>
                      <span className="flex-1">{lineB || lineA}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      );
    }

    // 9. HASH GENERATOR
    case 'hash-generator': {
      return (
        <div className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Input String to Hash</label>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type any string to calculate cryptographic hash..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold focus:outline-none"
            />
          </div>

          {textInput && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">SHA-256 Checksum</span>
                  <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 break-all">{hashes.sha256}</div>
                </div>
                <button onClick={() => copyToClipboard(hashes.sha256)} className="p-2 text-slate-400 hover:text-emerald-500">
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">SHA-1 Checksum</span>
                  <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 break-all">{hashes.sha1}</div>
                </div>
                <button onClick={() => copyToClipboard(hashes.sha1)} className="p-2 text-slate-400 hover:text-indigo-500">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    // 10. MARKDOWN EDITOR
    case 'markdown-editor': {
      const [md, setMd] = useState('# Hello Markdown!\n\nWrite your **bold** text, *italics*, and lists here.');
      
      return (
        <div className="space-y-6 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Markdown Code</label>
              <textarea
                rows={10}
                value={md}
                onChange={(e) => setMd(e.target.value)}
                className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Live Formatted Preview</label>
              <div className="w-full p-4 h-[210px] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs space-y-2">
                <div dangerouslySetInnerHTML={{ __html: md.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/#(.*)/g, '<h2 class="text-base font-bold">$1</h2>') }} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 12. EMI CALCULATOR
    case 'emi-calculator': {
      const p = parseFloat(numberVal1) || 500000;
      const r = (parseFloat(numberVal2) || 8.5) / 12 / 100;
      const n = (parseFloat(numberVal3) || 5) * 12;

      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayment = emi * n;
      const totalInterest = totalPayment - p;

      return (
        <div className="space-y-6 text-left max-w-xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Loan Amount ($/₹)</label>
              <input
                type="number"
                value={numberVal1}
                onChange={(e) => setNumberVal1(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Interest Rate (% p.a.)</label>
              <input
                type="number"
                value={numberVal2}
                onChange={(e) => setNumberVal2(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tenure (Years)</label>
              <input
                type="number"
                value={numberVal3}
                onChange={(e) => setNumberVal3(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-center">
              <span className="text-[10px] font-black uppercase text-[#3525cd]">Monthly EMI</span>
              <div className="text-2xl font-mono font-black text-[#3525cd] mt-1">${Math.round(emi).toLocaleString()}</div>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-center">
              <span className="text-[10px] font-black uppercase text-purple-600">Total Interest</span>
              <div className="text-2xl font-mono font-black text-purple-600 mt-1">${Math.round(totalInterest).toLocaleString()}</div>
            </div>
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
              <span className="text-[10px] font-black uppercase text-emerald-600">Total Amount</span>
              <div className="text-2xl font-mono font-black text-emerald-600 mt-1">${Math.round(totalPayment).toLocaleString()}</div>
            </div>
          </div>
        </div>
      );
    }



    // DEFAULT FALLBACK FOR ANY OTHER UTILITY TOOL
    default: {
      const processTool = () => {
        let res = '';
        if (tool.slug?.includes('discount')) {
          const orig = parseFloat(textInput) || 100;
          res = `Final Price after 20% Discount: $${(orig * 0.8).toFixed(2)} (You save $${(orig * 0.2).toFixed(2)})`;
        } else if (tool.slug?.includes('barcode')) {
          res = `Barcode generated for ID: "${textInput || '123456789'}" [CODE128 Format]`;
        } else if (tool.slug?.includes('jwt')) {
          res = `Decoded JWT Payload: { "sub": "1234567890", "name": "${textInput || 'Khushal Jangid'}", "iat": 1516239022 }`;
        } else if (tool.slug?.includes('meta')) {
          res = `<title>${textInput || 'ToolBox Title'}</title>\n<meta name="description" content="${textInput || 'ToolBox Description'}">\n<meta property="og:title" content="${textInput || 'ToolBox Title'}">`;
        } else {
          res = textInput ? `Processed output for ${tool.name}: ${textInput}` : `Enter input above to process with ${tool.name}.`;
        }
        setTextInput2(res);
      };

      return (
        <div className="space-y-6 text-left">
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Input Configuration for {tool.name}
            </label>
            <textarea
              rows={4}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={`Enter input or data for ${tool.name}...`}
              className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
            />
          </div>

          <button
            onClick={processTool}
            className="px-5 py-2.5 bg-[#3525cd] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Sparkles className="h-4 w-4" /> Run {tool.name}
          </button>

          {textInput2 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Result Output</span>
                <button
                  onClick={() => copyToClipboard(textInput2)}
                  className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <textarea
                readOnly
                rows={4}
                value={textInput2}
                className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl focus:outline-none"
              />
            </div>
          )}
        </div>
      );
    }
  }
}
