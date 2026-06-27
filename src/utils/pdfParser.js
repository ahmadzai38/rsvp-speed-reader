// Extracts plain text from a PDF file entirely in the browser using PDF.js.
//
// PDF.js needs a "worker" script to do the heavy parsing off the main thread.
// With Vite, the clean way to wire this up is to import the worker file as a
// URL (the `?url` suffix) and hand it to PDF.js. This avoids the common
// "fake worker" / version-mismatch warnings.
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// Point PDF.js at the worker bundled by Vite.
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export async function extractTextFromPdf(file) {
  // 1. Read the uploaded file into an ArrayBuffer.
  const arrayBuffer = await file.arrayBuffer();

  // 2. Load the PDF document.
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  // 3. Loop through every page and collect its text.
  const pageTexts = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    // Each "item" is a chunk of text; join them with spaces.
    const pageText = content.items.map((item) => item.str).join(" ");
    pageTexts.push(pageText);
  }

  // 4. Join all pages into one big string and return it.
  return pageTexts.join("\n");
}
