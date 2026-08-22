import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

/**
 * Converts a Blob to a Base64 string
 */
export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}

/**
 * Universal file saver function that works on:
 * 1. Native Capacitor Android / iOS App (Writes to filesystem and triggers native Android Share/Save sheet)
 * 2. Mobile Safari / Mobile Chrome / Android WebView (Web Share API + Data URL fallback)
 * 3. Desktop Chrome / Firefox / Edge (Standard ObjectURL download)
 *
 * @param {Blob|Uint8Array|string} data - File content as Blob, Uint8Array or URL
 * @param {string} filename - Desired filename (e.g. "merged-document.pdf")
 * @param {string} mimeType - MIME type (e.g. "application/pdf")
 */
export async function downloadFile(data, filename = "document.pdf", mimeType = "application/pdf") {
  let blob;
  if (data instanceof Blob) {
    blob = data;
  } else if (data instanceof Uint8Array) {
    blob = new Blob([data], { type: mimeType });
  } else if (typeof data === "string" && data.startsWith("blob:")) {
    try {
      const res = await fetch(data);
      blob = await res.blob();
    } catch {
      blob = new Blob([], { type: mimeType });
    }
  } else if (typeof data === "string" && data.startsWith("data:")) {
    const byteString = atob(data.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    blob = new Blob([ab], { type: mimeType });
  } else {
    blob = new Blob([data], { type: mimeType });
  }

  // 1. Check if running inside Capacitor Android / iOS Native App
  if (Capacitor.isNativePlatform()) {
    try {
      const dataUrl = await blobToBase64(blob);
      const base64Data = dataUrl.split(",")[1];

      // Write file to Cache or Documents directory
      const result = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Cache,
      });

      // Trigger native Android system share / save sheet
      await Share.share({
        title: filename,
        text: "Here is your generated file from ToolBox Suite",
        url: result.uri,
        dialogTitle: "Save or Share " + filename,
      });
      return true;
    } catch (nativeErr) {
      console.warn("Capacitor Native Save fallback:", nativeErr);
    }
  }

  // 2. Web Share API for Mobile Devices (Android Chrome & iOS Safari)
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile && navigator.canShare) {
    try {
      const file = new File([blob], filename, { type: mimeType });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: filename,
        });
        return true;
      }
    } catch (shareErr) {
      if (shareErr.name !== "AbortError") {
        console.warn("Web Share API fallback:", shareErr);
      }
    }
  }

  // 3. Standard Browser Blob Link Download
  try {
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    a.style.display = "none";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (document.body.contains(a)) document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }, 1500);
    return true;
  } catch (err) {
    console.error("Standard Blob download error:", err);
  }

  // 4. Fallback: Base64 Data URI Download for strict WebViews
  try {
    const dataUrl = await blobToBase64(blob);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.target = "_blank";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (document.body.contains(a)) document.body.removeChild(a);
    }, 1500);
    return true;
  } catch (fallbackErr) {
    console.error("Base64 Data URI fallback error:", fallbackErr);
  }

  return false;
}
