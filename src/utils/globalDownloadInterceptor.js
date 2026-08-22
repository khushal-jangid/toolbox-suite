import { downloadFile } from "./fileDownloader";

export function initGlobalDownloadInterceptor() {
  if (typeof window === "undefined") return;

  document.addEventListener(
    "click",
    async (e) => {
      const anchor = e.target.closest('a[download], a[href^="blob:"], a[href^="data:"]');
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Don't intercept APK installation download
      if (href && href.endsWith(".apk")) return;

      if (href.startsWith("blob:") || href.startsWith("data:") || anchor.hasAttribute("download")) {
        e.preventDefault();
        e.stopPropagation();

        const filename = anchor.getAttribute("download") || "document.pdf";
        let mimeType = "application/octet-stream";
        if (filename.endsWith(".pdf")) mimeType = "application/pdf";
        else if (filename.endsWith(".png")) mimeType = "image/png";
        else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) mimeType = "image/jpeg";
        else if (filename.endsWith(".webp")) mimeType = "image/webp";
        else if (filename.endsWith(".svg")) mimeType = "image/svg+xml";
        else if (filename.endsWith(".zip")) mimeType = "application/zip";
        else if (filename.endsWith(".json")) mimeType = "application/json";
        else if (filename.endsWith(".txt")) mimeType = "text/plain";
        else if (filename.endsWith(".docx")) mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        else if (filename.endsWith(".xlsx")) mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        else if (filename.endsWith(".pptx")) mimeType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";

        await downloadFile(href, filename, mimeType);
      }
    },
    true
  );
}
