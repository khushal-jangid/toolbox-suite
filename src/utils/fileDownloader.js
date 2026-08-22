import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

/**
 * Robustly extract a Blob object from any data format (Blob, Uint8Array, ArrayBuffer, Data URI, or Blob URL)
 */
async function extractBlob(data, mimeType = 'application/pdf') {
  if (!data) return null;
  
  if (data instanceof Blob) {
    return data;
  }
  if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
    return new Blob([data], { type: mimeType });
  }
  if (typeof data === 'string') {
    if (data.startsWith('data:')) {
      const parts = data.split(',');
      const byteString = atob(parts[1] || '');
      const mime = (parts[0].split(':')[1] || '').split(';')[0] || mimeType;
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mime });
    }
    if (data.startsWith('blob:')) {
      return new Promise((resolve) => {
        try {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', data, true);
          xhr.responseType = 'blob';
          xhr.onload = () => {
            if (xhr.response) {
              resolve(xhr.response);
            } else {
              fetch(data).then(r => r.blob()).then(resolve).catch(() => resolve(null));
            }
          };
          xhr.onerror = () => {
            fetch(data).then(r => r.blob()).then(resolve).catch(() => resolve(null));
          };
          xhr.send();
        } catch {
          fetch(data).then(r => r.blob()).then(resolve).catch(() => resolve(null));
        }
      });
    }
  }
  return null;
}

/**
 * Convert a Blob to raw Base64 string without data: URI prefix
 */
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const res = reader.result;
      if (typeof res === 'string') {
        const commaIdx = res.indexOf(',');
        resolve(commaIdx !== -1 ? res.substring(commaIdx + 1) : res);
      } else {
        reject(new Error('FileReader result is not string'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Universal file downloader that works flawlessly on web, mobile browsers, and native Android apps
 */
export async function downloadFile(data, filename = 'document.pdf', mimeType = 'application/pdf') {
  if (!data) return false;

  try {
    const blob = await extractBlob(data, mimeType);

    // 1. If running in Capacitor Native Android/iOS App
    if (Capacitor.isNativePlatform()) {
      try {
        let base64Data = '';
        if (blob) {
          base64Data = await blobToBase64(blob);
        } else if (typeof data === 'string' && data.startsWith('data:')) {
          base64Data = data.split(',')[1];
        }

        if (base64Data) {
          const writeResult = await Filesystem.writeFile({
            path: filename,
            data: base64Data,
            directory: Directory.Cache,
            recursive: true
          });

          await Share.share({
            title: filename,
            text: 'Save ' + filename,
            url: writeResult.uri,
            dialogTitle: 'Save ' + filename,
          });
          return true;
        }
      } catch (nativeErr) {
        console.warn('Native Capacitor Save error:', nativeErr);
      }
    }

    // 2. Standard Web Browser Download
    const downloadBlob = blob || (data instanceof Blob ? data : new Blob([data], { type: mimeType }));
    const downloadUrl = URL.createObjectURL(downloadBlob);

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    a.rel = 'noopener noreferrer';
    a.style.position = 'fixed';
    a.style.top = '-9999px';
    a.style.left = '-9999px';
    document.body.appendChild(a);
    
    try {
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    } catch {
      a.click();
    }

    setTimeout(() => {
      if (document.body.contains(a)) document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    }, 45000);

    return true;
  } catch (err) {
    console.error('Download error:', err);
    return false;
  }
}
