import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

/**
 * Universal file downloader that works flawlessly on web, mobile and Android apps
 */
export async function downloadFile(data, filename = 'document.pdf', mimeType = 'application/pdf') {
  if (!data) return false;

  // 1. If running in Capacitor Native Android/iOS App
  if (Capacitor.isNativePlatform()) {
    try {
      let base64Data = '';
      if (typeof data === 'string' && data.startsWith('data:')) {
        base64Data = data.split(',')[1];
      } else if (typeof data === 'string' && data.startsWith('blob:')) {
        const res = await fetch(data);
        const b = await res.blob();
        base64Data = await new Promise((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result.split(',')[1]);
          r.onerror = reject;
          r.readAsDataURL(b);
        });
      } else if (data instanceof Blob) {
        base64Data = await new Promise((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result.split(',')[1]);
          r.onerror = reject;
          r.readAsDataURL(data);
        });
      }

      if (base64Data) {
        const result = await Filesystem.writeFile({
          path: filename,
          data: base64Data,
          directory: Directory.Cache,
        });

        await Share.share({
          title: filename,
          url: result.uri,
          dialogTitle: 'Save ' + filename,
        });
        return true;
      }
    } catch (nativeErr) {
      console.warn('Native Capacitor Save error:', nativeErr);
    }
  }

  // 2. Standard Web Browser Download
  try {
    let url = data;
    let isCreatedUrl = false;

    if (data instanceof Blob || data instanceof Uint8Array) {
      const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
      url = URL.createObjectURL(blob);
      isCreatedUrl = true;
    }

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      if (document.body.contains(a)) document.body.removeChild(a);
      if (isCreatedUrl) URL.revokeObjectURL(url);
    }, 1500);

    return true;
  } catch (err) {
    console.error('Download error:', err);
    return false;
  }
}
